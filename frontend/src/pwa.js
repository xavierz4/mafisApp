import { registerSW } from 'virtual:pwa-register';

// Register service worker with automatic updates
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('🔄 New content available, refreshing...');
  },
  onOfflineReady() {
    console.log('✅ App ready to work offline');
  },
  onRegistered(registration) {
    console.log('✅ Service Worker registered:', registration);
  },
  onRegisterError(error) {
    console.error('❌ Service Worker registration error:', error);
  }
});

export { updateSW };
