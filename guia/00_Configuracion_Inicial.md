# Paso 0: Configuración Inicial y Estructura del Proyecto

Este documento detalla la estructura base del proyecto, la configuración inicial y el flujo de trabajo con Git.

## 0.1 Estructura de Directorios

El proyecto `MAFIS_MVP` sigue una arquitectura de Monolito Modular para el backend y una SPA para el frontend.

```
MAFIS_MVP/
├── backend/                # API REST con Flask
│   ├── app/
│   │   ├── modules/        # Módulos funcionales (auth, assets, reports, etc.)
│   │   ├── __init__.py     # Factory de la aplicación
│   │   ├── config.py       # Configuraciones de entorno
│   │   └── extensions.py   # Extensiones (DB, JWT, CORS)
│   ├── run.py              # Punto de entrada
│   ├── requirements.txt    # Dependencias Python
│   └── .env                # Variables de entorno (NO subir al repo)
├── frontend/               # SPA con React + Vite
│   ├── src/
│   │   ├── features/       # Módulos funcionales (auth, assets, etc.)
│   │   ├── components/     # Componentes reutilizables
│   │   └── lib/            # Utilidades (axios, etc.)
│   ├── package.json        # Dependencias Node
│   └── vite.config.js      # Configuración de Vite
└── guia/                   # Documentación del proyecto
```

## 0.2 Flujo de Trabajo con Git

El repositorio cuenta con dos ramas principales para organizar el desarrollo:

1.  **`main` (Principal)**: Contiene el código estable y listo para producción. Solo se actualiza mediante merges desde `develop` cuando se completa una versión o hito importante.
2.  **`develop` (Desarrollo)**: Es la rama de trabajo activa. Aquí se integran las nuevas características y correcciones.

### Flujo Recomendado:
1.  Para trabajar, asegúrate de estar en `develop`: `git checkout develop`
2.  Realiza tus cambios y commits en `develop`.
3.  Para guardar progreso: `git push origin develop`

## 0.3 Configuración del Backend

### Dependencias (`requirements.txt`)
Las librerías principales incluyen:
- `Flask`: Framework web.
- `Flask-SQLAlchemy`: ORM para base de datos.
- `Flask-JWT-Extended`: Autenticación JWT.
- `PyMySQL`: Driver para MySQL.

### Variables de Entorno (`.env`)
Ejemplo de configuración requerida:
```ini
FLASK_APP=run.py
FLASK_ENV=development
SECRET_KEY=tu-secret-key
SQLALCHEMY_DATABASE_URI=mysql+pymysql://usuario:password@localhost/mafis_mvp_db
JWT_SECRET_KEY=tu-jwt-secret-key
CORS_ORIGINS=http://localhost:5173
```

## 0.4 Configuración del Frontend

### Dependencias (`package.json`)
El frontend utiliza React con Vite. Dependencias clave:
- `react-router-dom`: Navegación.
- `axios`: Peticiones HTTP.
- `zustand`: Gestión de estado global.
- `tailwindcss`: Estilos.
- `react-hook-form`: Manejo de formularios.

### Configuración de Vite (`vite.config.js`)
Configurado para proxy reverso en desarrollo para evitar problemas de CORS:

```javascript
export default defineConfig({
  plugins: [react(), VitePWA({...})],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Redirige /api al backend Flask
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
```
