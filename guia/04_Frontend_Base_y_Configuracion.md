# Paso 4: Configuración Base del Frontend

En este paso, configuraremos el proyecto de React con Vite, Tailwind CSS y las herramientas básicas de comunicación con el backend.

## 4.1 Inicialización del Proyecto

Usamos Vite para crear un proyecto rápido y moderno.

```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
```

## 4.2 Dependencias (`package.json`)

Instalamos las librerías necesarias para routing, estado, estilos y PWA.

**Comando de instalación:**
```bash
npm install axios react-router-dom zustand react-hot-toast @headlessui/react @heroicons/react lucide-react clsx tailwind-merge date-fns socket.io-client vite-plugin-pwa framer-motion react-hook-form
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Archivo resultante:** `frontend/package.json` (parcial)
```json
{
  "dependencies": {
    "@headlessui/react": "^1.7.17",
    "@heroicons/react": "^2.0.18",
    "axios": "^1.6.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "vite-plugin-pwa": "^0.17.0",
    "zustand": "^4.4.7"
    // ... otras dependencias
  }
}
```

## 4.3 Configuración de Vite (`vite.config.js`)

Configuramos el **Proxy** para que las peticiones a `/api` se redirijan automáticamente a nuestro backend en el puerto 5000. También configuramos el plugin PWA.

**Archivo:** `frontend/vite.config.js`
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'MAFIS MVP',
        short_name: 'MAFIS',
        description: 'Mantenimiento de Activos Físicos y Servicios',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
```

## 4.4 Configuración de Axios (`src/lib/axios.js`)

Creamos una instancia de Axios configurada globalmente.
**Interceptores**:
1. **Request**: Inyecta automáticamente el token JWT en cada petición.
2. **Response**: Si el backend devuelve 401 (No autorizado), redirige al login.

**Archivo:** `frontend/src/lib/axios.js`
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Proxy configured in vite.config.js
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the JWT token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

## 4.5 Estilos Globales (`src/index.css`)

Configuramos Tailwind en nuestro CSS principal.

**Archivo:** `frontend/src/index.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
}
```
