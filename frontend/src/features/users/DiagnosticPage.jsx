import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../auth/store';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

export default function DiagnosticPage() {
  const { user, token, isAuthenticated } = useAuthStore();
  const [debugInfo, setDebugInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDebugInfo();
  }, []);

  const loadDebugInfo = async () => {
    try {
      const response = await api.get('/auth/me/debug');
      setDebugInfo(response.data);
    } catch (error) {
      console.error('Error loading debug info:', error);
      toast.error('Error al cargar información de diagnóstico');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Cargando información de diagnóstico...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🔍 Diagnóstico del Sistema</h1>

      {/* Authentication Status */}
      <div className="card mb-6">
        <h2 className="text-xl font-bold mb-4">Estado de Autenticación</h2>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={`badge ${isAuthenticated ? 'badge-success' : 'badge-danger'}`}>
              {isAuthenticated ? '✅ Autenticado' : '❌ No Autenticado'}
            </span>
          </div>
          <p><strong>Token presente:</strong> {token ? '✅ Sí' : '❌ No'}</p>
          {token && (
            <p className="text-xs text-muted">
              Token: {token.substring(0, 20)}...
            </p>
          )}
        </div>
      </div>

      {/* User Information */}
      <div className="card mb-6">
        <h2 className="text-xl font-bold mb-4">Información del Usuario</h2>
        {user ? (
          <div className="space-y-2">
            <p><strong>Nombre:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Rol:</strong> <span className={`badge ${
              user.role === 'admin' ? 'badge-primary' :
              user.role === 'technician' ? 'badge-success' :
              'badge-neutral'
            }`}>{user.role}</span></p>
            <p><strong>Activo:</strong> {user.is_active ? '✅ Sí' : '❌ No'}</p>
          </div>
        ) : (
          <p className="text-danger">No hay información de usuario en localStorage</p>
        )}
      </div>

      {/* Permissions */}
      {debugInfo && (
        <div className="card mb-6">
          <h2 className="text-xl font-bold mb-4">Permisos del Usuario</h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(debugInfo.permissions).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <span className={value ? 'text-success' : 'text-muted'}>
                  {value ? '✅' : '❌'}
                </span>
                <span>{key.replace(/_/g, ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* API Test */}
      <div className="card mb-6">
        <h2 className="text-xl font-bold mb-4">Prueba de Endpoints</h2>
        <div className="space-y-3">
          <button
            onClick={async () => {
              try {
                const response = await api.get('/users');
                toast.success(`✅ Endpoint /users: ${response.data.length} usuarios encontrados`);
                console.log('Users:', response.data);
              } catch (error) {
                toast.error(`❌ Endpoint /users: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
                console.error('Error:', error.response?.data);
              }
            }}
            className="btn btn-primary w-full"
          >
            Probar GET /api/users
          </button>

          <button
            onClick={async () => {
              try {
                const response = await api.get('/auth/me');
                toast.success('✅ Endpoint /auth/me funciona');
                console.log('Me:', response.data);
              } catch (error) {
                toast.error(`❌ Endpoint /auth/me: ${error.message}`);
              }
            }}
            className="btn btn-secondary w-full"
          >
            Probar GET /api/auth/me
          </button>
        </div>
      </div>

      {/* Recommendations */}
      <div className="card bg-warning-50 border-warning">
        <h2 className="text-xl font-bold mb-4">💡 Recomendaciones</h2>
        <div className="space-y-2">
          {!isAuthenticated && (
            <p className="text-danger">⚠️ No estás autenticado. <button onClick={() => navigate('/login')} className="text-primary underline">Ir a Login</button></p>
          )}
          {user && user.role !== 'admin' && (
            <p className="text-warning">⚠️ No eres administrador. Para ver usuarios, inicia sesión con: <code>admin@mafis.com / admin123</code></p>
          )}
          {user && user.role === 'admin' && (
            <p className="text-success">✅ Eres administrador. Deberías poder ver la lista de usuarios.</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-4">
        <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
          Volver al Dashboard
        </button>
        <button onClick={() => navigate('/dashboard/users')} className="btn btn-primary">
          Ir a Gestión de Usuarios
        </button>
      </div>
    </div>
  );
}
