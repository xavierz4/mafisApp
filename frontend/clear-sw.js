/**
 * Script para limpiar Service Workers y caché
 * Ejecutar en la consola del navegador (F12 -> Console)
 */

// Limpiar todos los Service Workers
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(registration => {
    registration.unregister();
    console.log('✅ Service Worker eliminado');
  });
});

// Limpiar todos los cachés
caches.keys().then(cacheNames => {
  cacheNames.forEach(cacheName => {
    caches.delete(cacheName);
    console.log('✅ Caché eliminado:', cacheName);
  });
});

console.log('🧹 Limpieza completada. Recarga la página (Ctrl+R)');
