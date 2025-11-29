import { useEffect } from 'react';
import io from 'socket.io-client';
import toast from 'react-hot-toast';
import useAuthStore from '../features/auth/store';
import useNotificationStore from '../features/notifications/store';

const SOCKET_URL = 'http://localhost:5000';

export const useNotifications = () => {
  const { user } = useAuthStore();
  const { notifications, addNotification, incrementUnread } = useNotificationStore();

  useEffect(() => {
    if (!user) return;

    const socket = io(SOCKET_URL);

    socket.on('connect', () => {
      console.log('Connected to notification server');
    });

    socket.on('notification', (data) => {
      // Only show if it's for me or broadcast
      if (data.userId === user.id || !data.userId) {
        // Add to store
        addNotification({
          id: Date.now(),
          ...data,
          read: false,
          timestamp: new Date()
        });
        incrementUnread();

        // Show toast
        toast(data.message, {
          icon: '🔔',
          duration: 5000,
          style: {
            border: '1px solid #3b82f6',
            padding: '16px',
            color: '#1e3a8a',
          },
        });
        
        // Play sound (optional)
        const audio = new Audio('/notification.mp3'); 
        audio.play().catch(e => console.log('Audio play failed', e));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user, addNotification, incrementUnread]);

  return { notifications };
};
