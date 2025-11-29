import { useEffect, useState } from 'react';
import axios from '../lib/axios';

/**
 * Hook para manejar suscripciones de Web Push (VAPID)
 */
export function useWebPush() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if Push API is supported
    const supported = 'serviceWorker' in navigator && 'PushManager' in window;
    setIsSupported(supported);

    if (supported) {
      checkSubscription();
    }
  }, []);

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (error) {
      console.error('Error checking push subscription:', error);
    }
  };

  const subscribe = async () => {
    try {
      console.log('🔔 Starting Web Push subscription...');
      
      // 1. Check if SW is supported and ready
      if (!('serviceWorker' in navigator)) {
        throw new Error('Service Worker not supported');
      }

      // 2. Get VAPID public key from backend
      console.log('📡 Fetching VAPID public key...');
      const { data } = await axios.get('/push/vapid-public-key');
      const publicKey = data.publicKey;
      console.log('✅ VAPID key received');

      // 3. Request notification permission
      console.log('🔐 Requesting notification permission...');
      const permission = await Notification.requestPermission();
      console.log('Permission result:', permission);
      
      if (permission !== 'granted') {
        console.log('❌ Notification permission denied');
        return false;
      }

      // 4. Get service worker registration with fallback
      console.log('⚙️ Waiting for service worker...');
      
      let registration = await Promise.race([
        navigator.serviceWorker.ready,
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000))
      ]).catch(async () => {
        console.log('⚠️ SW ready timeout, trying explicit registration...');
        // Fallback: Register explicitly
        try {
          const reg = await navigator.serviceWorker.register('/sw.js');
          await new Promise(resolve => {
            if (reg.active) resolve();
            else reg.addEventListener('updatefound', () => {
              const newWorker = reg.installing;
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'activated') resolve();
              });
            });
          });
          return reg;
        } catch (err) {
          throw new Error(`SW registration failed: ${err.message}`);
        }
      });

      if (!registration) {
         // Last attempt to get it
         registration = await navigator.serviceWorker.getRegistration();
         if (!registration) throw new Error('No Service Worker found');
      }

      console.log('✅ Service worker ready:', registration.scope);

      // 5. Subscribe to push notifications
      console.log('📝 Creating push subscription...');
      let subscription;
      
      try {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey)
        });
      } catch (subError) {
        console.warn('⚠️ Initial subscription failed, trying to unsubscribe and retry...', subError);
        
        // If subscription fails, it might be due to an old subscription with different keys
        // Try to get existing subscription and unsubscribe
        const existingSub = await registration.pushManager.getSubscription();
        if (existingSub) {
          await existingSub.unsubscribe();
          console.log('🗑️ Old subscription removed');
        }
        
        // Retry subscription
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey)
        });
      }
      
      console.log('✅ Push subscription created');

      // 6. Send subscription to backend
      console.log('📤 Sending subscription to backend...');
      await axios.post('/push/subscribe', subscription.toJSON());
      console.log('✅ Subscription saved to backend');

      setIsSubscribed(true);
      console.log('✅ Subscribed to Web Push notifications');
      return true;
    } catch (error) {
      console.error('❌ Error subscribing to push:', error);
      // Don't alert, just log. The UI will handle the false return.
      return false;
    }
  };

  const unsubscribe = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
        await axios.post('/push/unsubscribe', subscription.toJSON());
        setIsSubscribed(false);
        console.log('✅ Unsubscribed from Web Push');
        return true;
      }
    } catch (error) {
      console.error('Error unsubscribing:', error);
      return false;
    }
  };

  return {
    isSupported,
    isSubscribed,
    subscribe,
    unsubscribe
  };
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String) {
  try {
    // Remove any whitespace or newlines
    const cleanedString = base64String.trim().replace(/\s/g, '');
    
    // Add padding if needed
    const padding = '='.repeat((4 - cleanedString.length % 4) % 4);
    
    // Convert URL-safe base64 to standard base64
    const base64 = (cleanedString + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    // Decode base64
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    
    return outputArray;
  } catch (error) {
    console.error('❌ Error decoding VAPID key:', error);
    console.error('Received key:', base64String);
    console.error('Key length:', base64String?.length);
    throw new Error(`Invalid VAPID key format: ${error.message}`);
  }
}
