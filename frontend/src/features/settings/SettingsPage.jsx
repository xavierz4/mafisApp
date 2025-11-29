import { useState, useEffect } from 'react';
import { 
  BellIcon, 
  DevicePhoneMobileIcon, 
  EnvelopeIcon, 
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import useAuthStore from '../auth/store';
import { useWebPush } from '../../hooks/useWebPush';
import axios from '../../lib/axios';
import toast from 'react-hot-toast';
import '../../styles/pages/settings.css';

export default function SettingsPage() {
  const { user, checkAuth } = useAuthStore();
  const { isSupported, isSubscribed, subscribe, unsubscribe } = useWebPush();
  
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    email: true,
    whatsapp: true,
    push: true
  });

  // Load preferences from user object
  useEffect(() => {
    if (user?.preferences) {
      setPreferences(user.preferences);
    }
  }, [user]);

  const handleToggle = async (key) => {
    const newPreferences = { ...preferences, [key]: !preferences[key] };
    setPreferences(newPreferences);
    
    try {
      await axios.put('/users/me/preferences', newPreferences);
      toast.success('Preferencias actualizadas');
      checkAuth(); 
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Error al guardar cambios');
      setPreferences(preferences);
    }
  };

  const handlePushSubscription = async () => {
    setLoading(true);
    try {
      if (isSubscribed) {
        await unsubscribe();
        toast.success('Notificaciones desactivadas en este dispositivo');
      } else {
        const success = await subscribe();
        if (success) {
          toast.success('¡Dispositivo suscrito exitosamente!');
          if (!preferences.push) {
            handleToggle('push');
          }
        } else {
          toast.error('No se pudo suscribir. Verifica los permisos.');
        }
      }
    } catch (error) {
      console.error('Push subscription error:', error);
      toast.error('Ocurrió un error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1 className="settings-title">Configuración</h1>
        <p className="settings-subtitle">Gestiona tus preferencias de notificación y cuenta</p>
      </div>

      <div className="settings-card">
        {/* Header */}
        <div className="settings-section-header">
          <h2 className="settings-section-title">
            <BellIcon />
            Preferencias de Notificación
          </h2>
          <p className="settings-description" style={{ marginTop: '0.5rem' }}>
            Elige cómo quieres recibir las actualizaciones sobre tus reportes y órdenes de trabajo.
          </p>
        </div>

        {/* Email Toggle */}
        <div className="settings-row">
          <div className="settings-info">
            <div className="settings-icon-wrapper email">
              <EnvelopeIcon />
            </div>
            <div>
              <p className="settings-label">Notificaciones por Correo</p>
              <p className="settings-description">Recibe actualizaciones importantes en {user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => handleToggle('email')}
            className={`toggle-switch ${preferences.email ? 'active' : ''}`}
            aria-label="Toggle email notifications"
          >
            <span className="toggle-thumb" />
          </button>
        </div>

        {/* WhatsApp Toggle */}
        <div className="settings-row">
          <div className="settings-info">
            <div className="settings-icon-wrapper whatsapp">
              <ChatBubbleLeftRightIcon />
            </div>
            <div>
              <p className="settings-label">Notificaciones por WhatsApp</p>
              <p className="settings-description">
                {user?.phone 
                  ? `Recibe alertas instantáneas en ${user.phone}` 
                  : 'Agrega un teléfono en tu perfil para activar'}
              </p>
            </div>
          </div>
          <button
            onClick={() => handleToggle('whatsapp')}
            disabled={!user?.phone}
            className={`toggle-switch ${preferences.whatsapp ? 'active' : ''}`}
            aria-label="Toggle whatsapp notifications"
          >
            <span className="toggle-thumb" />
          </button>
        </div>

        {/* Push Notifications Section */}
        <div className="settings-row" style={{ display: 'block' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="settings-info">
              <div className="settings-icon-wrapper push">
                <DevicePhoneMobileIcon />
              </div>
              <div>
                <p className="settings-label">Notificaciones Push (Web)</p>
                <p className="settings-description">Recibe alertas en este dispositivo</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('push')}
              className={`toggle-switch ${preferences.push ? 'active' : ''}`}
              aria-label="Toggle push notifications"
            >
              <span className="toggle-thumb" />
            </button>
          </div>

          {/* Device Subscription Status */}
          <div className="push-status-box">
            <div className="push-status-header">
              <div className="push-status-text">
                {isSubscribed ? (
                  <CheckCircleIcon className="text-success" />
                ) : (
                  <ExclamationCircleIcon className="text-warning" />
                )}
                <span>
                  {isSubscribed 
                    ? 'Este dispositivo está suscrito y recibiendo notificaciones.' 
                    : 'Este dispositivo NO está suscrito.'}
                </span>
              </div>
              
              {isSupported ? (
                <button
                  onClick={handlePushSubscription}
                  disabled={loading}
                  className={`btn-push ${isSubscribed ? 'deactivate' : 'activate'}`}
                >
                  {loading ? 'Procesando...' : isSubscribed ? 'Desactivar en este dispositivo' : 'Activar en este dispositivo'}
                </button>
              ) : (
                <span className="text-error">Tu navegador no soporta notificaciones Web Push.</span>
              )}
            </div>
            {!isSubscribed && isSupported && (
              <p className="push-note">
                Debes activar esto en cada dispositivo (celular, laptop) donde quieras recibir alertas.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
