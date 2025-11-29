# 📱 MAFIS - Progressive Web App (PWA)

## ✨ Características PWA Implementadas

### 1. **Instalable**
- La aplicación puede instalarse en dispositivos móviles y escritorio
- Aparece como una app nativa en el menú de aplicaciones
- Se abre en modo standalone (sin barra del navegador)

### 2. **Funciona Offline**
- Los assets estáticos (JS, CSS, imágenes) se cachean automáticamente
- Las llamadas API se cachean con estrategia NetworkFirst (5 minutos)
- La app sigue funcionando sin conexión con datos cacheados

### 3. **Notificaciones**
#### Notificaciones In-App (Socket.IO)
- Funcionan mientras la app está abierta
- Alertas en tiempo real para todos los eventos

#### Notificaciones del Navegador
- Se muestran cuando la app está en segundo plano
- Requieren permiso del usuario
- Se activan automáticamente con eventos de Socket.IO

#### Notificaciones WhatsApp
- Mensajes directos al teléfono del usuario
- Funcionan 24/7, app abierta o cerrada
- Requieren configuración de Twilio

#### Notificaciones Email
- Correos detallados con información completa
- Funcionan 24/7
- Requieren configuración SMTP

### 4. **Optimización de Rendimiento**
- Service Worker con Workbox
- Caché inteligente de recursos
- Precarga de assets críticos

## 🚀 Cómo Instalar la PWA

### En Android
1. Abre la app en Chrome
2. Toca el menú (⋮) → "Agregar a pantalla de inicio"
3. Confirma la instalación

### En iOS
1. Abre la app en Safari
2. Toca el botón de compartir (□↑)
3. Selecciona "Agregar a pantalla de inicio"

### En Escritorio (Chrome/Edge)
1. Abre la app
2. Busca el ícono de instalación (+) en la barra de direcciones
3. Haz clic en "Instalar"

## 🔔 Configurar Notificaciones

### Notificaciones del Navegador
1. Al abrir la app por primera vez, acepta el permiso de notificaciones
2. Si lo rechazaste, ve a Configuración del navegador → Permisos → Notificaciones
3. Permite notificaciones para `localhost:5173` (o tu dominio)

### Notificaciones WhatsApp
1. Configura las credenciales de Twilio en `backend/.env`:
   ```env
   TWILIO_ACCOUNT_SID=tu_account_sid
   TWILIO_AUTH_TOKEN=tu_auth_token
   TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
   ```
2. Si usas Twilio Sandbox, envía el mensaje de activación desde tu WhatsApp
3. Asegúrate de que los usuarios tengan su número de teléfono configurado

### Notificaciones Email
1. Configura el servidor SMTP en `backend/.env`:
   ```env
   MAIL_SERVER=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USE_TLS=True
   MAIL_USERNAME=tu_email@gmail.com
   MAIL_PASSWORD=tu_app_password
   MAIL_DEFAULT_SENDER=noreply@mafis.sena.edu.co
   ```
2. Para Gmail, usa una "Contraseña de Aplicación" (no tu contraseña normal)

## 📊 Eventos que Generan Notificaciones

| Evento | Admin | Técnico | Solicitante | Canales |
|--------|-------|---------|-------------|---------|
| Nuevo Reporte | ✅ | ❌ | ✅ (confirmación) | Email, WhatsApp, Push |
| Orden Asignada | ❌ | ✅ | ✅ | Email, WhatsApp, Push |
| Estado Actualizado | ❌ | ❌ | ✅ | Email, WhatsApp, Push |
| Orden Completada | ❌ | ❌ | ✅ | Email, WhatsApp, Push |

## 🛠️ Desarrollo

### Probar PWA en Desarrollo
La PWA está habilitada en modo desarrollo (`devOptions.enabled: true`)

### Build para Producción
```bash
cd frontend
npm run build
```

El build generará:
- `dist/manifest.webmanifest` - Manifiesto de la PWA
- `dist/sw.js` - Service Worker
- Assets optimizados y cacheables

### Servir Build de Producción
```bash
npm run preview
```

## 🔍 Verificar Instalación PWA

### Chrome DevTools
1. Abre DevTools (F12)
2. Ve a la pestaña "Application"
3. Verifica:
   - **Manifest**: Debe mostrar todos los campos correctamente
   - **Service Workers**: Debe estar activo
   - **Cache Storage**: Debe tener entradas

### Lighthouse
1. Abre DevTools → Lighthouse
2. Selecciona "Progressive Web App"
3. Ejecuta el audit
4. Deberías obtener un puntaje alto (>80)

## 📝 Notas Importantes

- **Localhost**: Las PWAs funcionan en localhost sin HTTPS
- **Producción**: En producción NECESITAS HTTPS para que la PWA funcione
- **Service Worker**: Se actualiza automáticamente cuando hay cambios
- **Caché**: Los datos de API se cachean por 5 minutos
- **Offline**: La app funciona offline con datos cacheados

## 🐛 Troubleshooting

### La app no se puede instalar
- Verifica que el manifiesto esté cargando: `/manifest.webmanifest`
- Asegúrate de que los iconos existan en `/public`
- Revisa la consola por errores

### Las notificaciones no llegan
- Verifica permisos del navegador
- Revisa la consola del backend para logs de WhatsApp/Email
- Asegúrate de que Socket.IO esté conectado

### El Service Worker no se activa
- Limpia el caché del navegador
- Desregistra el SW anterior en DevTools → Application → Service Workers
- Recarga la página con Ctrl+Shift+R

## 🎯 Próximos Pasos (Opcional)

Para notificaciones Push "reales" (Web Push API):
1. Implementar servidor VAPID en el backend
2. Suscribir usuarios desde el frontend
3. Enviar push notifications desde el servidor
4. Manejar eventos `push` en el Service Worker

Esto permitiría notificaciones incluso con la app completamente cerrada.
