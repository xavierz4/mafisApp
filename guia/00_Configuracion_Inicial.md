# Paso 0: Configuración Inicial y Estructura del Proyecto

Este documento sirve como guía maestra para configurar el entorno de desarrollo desde cero.

## 0.1 Prerrequisitos

Asegúrate de tener instalado:
- **Python 3.8+**: [Descargar](https://www.python.org/downloads/)
- **Node.js 18+**: [Descargar](https://nodejs.org/)
- **MySQL 8.0+**: [Descargar](https://dev.mysql.com/downloads/installer/)
- **Git**: [Descargar](https://git-scm.com/downloads)

## 0.2 Estructura del Proyecto

El proyecto utiliza una arquitectura monorepo híbrida:

```
MAFIS_MVP/
├── backend/                # API REST (Flask)
│   ├── app/                # Código fuente aplicación
│   ├── run.py              # Entry point
│   ├── requirements.txt    # Dependencias
│   └── .env                # Variables de entorno
├── frontend/               # SPA (React + Vite)
│   ├── src/                # Código fuente frontend
│   ├── package.json        # Dependencias
│   └── vite.config.js      # Configuración Vite
└── guia/                   # Documentación
```

## 0.3 Configuración del Backend

### 1. Crear Entorno Virtual
```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate
```

### 2. Archivo `requirements.txt`
Crea este archivo en `backend/` con el siguiente contenido exacto:

```text
Flask
Flask-SQLAlchemy
Flask-Migrate
Flask-Cors
Flask-JWT-Extended
python-dotenv
PyMySQL
cryptography
pydantic
email-validator
gunicorn
```

Instalar dependencias:
```bash
pip install -r requirements.txt
```

### 3. Variables de Entorno (`.env`)
Crea un archivo `.env` en `backend/` (este archivo **NO** se sube a Git):

```ini
FLASK_APP=run.py
FLASK_ENV=development
# Cambiar en producción
SECRET_KEY=dev-secret-key-change-in-production
JWT_SECRET_KEY=jwt-secret-key-change-in-production
# Ajustar usuario:password según tu instalación de MySQL
SQLALCHEMY_DATABASE_URI=mysql+pymysql://root:@localhost/mafis_mvp_db
CORS_ORIGINS=http://localhost:5173
```

### 4. Inicializar Base de Datos
Asegúrate de que el servicio MySQL esté corriendo y ejecuta:

```bash
# Inicializa tablas y usuario admin
python init_tables.py
```

## 0.4 Configuración del Frontend

### 1. Instalación
```bash
cd frontend
npm install
```

### 2. Archivo `package.json` (Referencia)
Las dependencias clave que deben estar presentes:

```json
{
  "dependencies": {
    "@headlessui/react": "^1.7.17",
    "@heroicons/react": "^2.0.18",
    "axios": "^1.6.2",
    "date-fns": "^2.30.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.48.2",
    "react-hot-toast": "^2.4.1",
    "react-router-dom": "^6.20.0",
    "zustand": "^4.4.7"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5",
    "vite": "^5.0.0",
    "vite-plugin-pwa": "^0.17.0"
  }
}
```

### 3. Configuración `vite.config.js`
Es CRÍTICO tener configurado el proxy para evitar errores de CORS durante el desarrollo:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'MAFIS MVP',
        short_name: 'MAFIS',
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

## 0.5 Ejecución del Proyecto

Para desarrollar, necesitarás dos terminales:

**Terminal 1 (Backend):**
```bash
cd backend
.\venv\Scripts\activate
python run.py
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

Accede a la aplicación en: `http://localhost:5173`
Credenciales por defecto: `admin@mafis.com` / `admin123`
