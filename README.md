# MAFIS MVP
## Sistema de Gestión de Mantenimiento de Activos Fijos

![Version](https://img.shields.io/badge/version-2.0-blue)
![Python](https://img.shields.io/badge/python-3.8+-green)
![Node](https://img.shields.io/badge/node-18+-green)
![License](https://img.shields.io/badge/license-MIT-blue)

Sistema web progresivo (PWA) para la gestión de mantenimiento de activos fijos, desarrollado con Flask (Backend) y React (Frontend).

---

## Características

### Backend
- API REST con Flask
- Autenticación JWT
- SQLAlchemy ORM
- MySQL como base de datos
- CORS configurado
- Rutas protegidas
- Notificaciones Web Push (VAPID)

### Frontend
- React 18 con Vite
- PWA (Progressive Web App)
- Diseño responsive mobile-first
- Bottom navigation para móvil
- Gestión de estado con Zustand
- CSS semántico moderno
- Búsqueda en tiempo real

### UI/UX
- Diseño moderno con branding SENA
- Tablas que se convierten en tarjetas en móvil
- Menú contextual para acciones en móvil
- FAB (Floating Action Button)
- Optimizado para pantallas táctiles
- Sin scroll horizontal en móvil

---

## Requisitos Previos

- **Python 3.8+**
- **Node.js 18+**
- **MySQL 8.0+**
- **Git**

---

## Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/xavierz4/mafis.git
cd mafis
```

### 2. Configurar Backend

```bash
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
# Copiar el archivo de ejemplo y renombrarlo a .env
cp .env.example .env
# Editar .env con tus credenciales reales (DB, JWT, VAPID, etc.)

# Inicializar base de datos
flask db upgrade

# Poblar datos de prueba (opcional)
python seed_users.py
```

### 3. Configurar Frontend

```bash
cd frontend

# Instalar dependencias
npm install
```

---

## Ejecución

### Terminal 1 - Backend:
```bash
cd backend
.\venv\Scripts\activate
python run.py
```
El backend estará disponible en: `http://localhost:5000`

### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```
El frontend estará disponible en: `http://localhost:5173`

---

## Credenciales por Defecto

- **Email:** admin@mafis.com
- **Password:** admin123

---

## Estructura del Proyecto

```
MAFIS_MVP/
├── backend/                # API REST (Flask)
│   ├── app/
│   │   ├── modules/        # Módulos (auth, assets, reports, push)
│   │   ├── common/         # Utilidades compartidas
│   │   ├── config.py       # Configuración
│   │   └── extensions.py   # Extensiones Flask
│   ├── migrations/         # Migraciones de base de datos
│   ├── run.py              # Entry point
│   ├── seed_users.py       # Datos de prueba
│   └── requirements.txt    # Dependencias Python
│
├── frontend/               # SPA (React + Vite)
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── features/       # Módulos por funcionalidad
│   │   ├── lib/            # Configuraciones (axios)
│   │   ├── App.jsx         # Componente principal
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Estilos globales
│   ├── package.json        # Dependencias Node
│   └── vite.config.js      # Configuración Vite
│
└── README.md               # Documentación
```

---

## Tecnologías Utilizadas

### Backend
- **Flask 3.0** - Framework web
- **Flask-SQLAlchemy** - ORM
- **Flask-Migrate** - Migraciones de base de datos
- **Flask-JWT-Extended** - Autenticación JWT
- **Flask-CORS** - Manejo de CORS
- **PyMySQL** - Conector MySQL
- **PyWebPush** - Notificaciones Push

### Frontend
- **React 18** - Librería UI
- **Vite 5** - Build tool
- **React Router DOM** - Navegación
- **Zustand** - Gestión de estado
- **Axios** - Cliente HTTP
- **Heroicons** - Iconos
- **React Hot Toast** - Notificaciones
- **Vite PWA** - Progressive Web App

---

## API Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/me` - Usuario actual

### Activos
- `GET /api/assets` - Listar activos
- `POST /api/assets` - Crear activo

### Reportes
- `GET /api/reports` - Listar reportes
- `POST /api/reports` - Crear reporte

### Notificaciones
- `GET /api/push/vapid-public-key` - Obtener clave pública
- `POST /api/push/subscribe` - Suscribir dispositivo

---

## Licencia

Este proyecto es parte del material educativo del SENA.

---

**Versión:** 2.0
**Última actualización:** Noviembre 2025
