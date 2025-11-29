import { useEffect } from 'react';
import useNotificationStore from '../features/notifications/store';

/**
 * Hook para manejar notificaciones del navegador (Notification API)
 * Se integra con el store de notificaciones para mostrar alertas nativas
 */
export function useBrowserNotifications() {
  const { notifications } = useNotificationStore();

  useEffect(() => {
    // Solicitar permiso para notificaciones
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    // Cuando llega una nueva notificación por Socket.IO, mostrarla como notificación del navegador
    if (notifications.length > 0 && 'Notification' in window && Notification.permission === 'granted') {
      const latestNotification = notifications[notifications.length - 1];
      
      // Solo mostrar si la app no está en foco
      if (document.hidden) {
        const notification = new Notification('MAFIS', {
          body: latestNotification.message,
          icon: '/pwa-192x192.png',
          badge: '/pwa-192x192.png',
          tag: `mafis-${latestNotification.id}`,
          requireInteraction: false,
          vibrate: [200, 100, 200]
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };

        // Auto-cerrar después de 5 segundos
        setTimeout(() => notification.close(), 5000);
      }
    }
  }, [notifications]);

  return {
    isSupported: 'Notification' in window,
    permission: 'Notification' in window ? Notification.permission : 'denied',
    requestPermission: () => {
      if ('Notification' in window) {
        return Notification.requestPermission();
      }
      return Promise.resolve('denied');
    }
  };
}
