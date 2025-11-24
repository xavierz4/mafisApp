# MAFIS MVP
## Sistema de Gestión de Mantenimiento de Activos Fijos

![Version](https://img.shields.io/badge/version-2.0-blue)
![Python](https://img.shields.io/badge/python-3.8+-green)
![Node](https://img.shields.io/badge/node-18+-green)
![License](https://img.shields.io/badge/license-MIT-blue)

Sistema web progresivo (PWA) para la gestión de mantenimiento de activos fijos, desarrollado con Flask (Backend) y React (Frontend).

---

## 🚀 Características

### Backend
- ✅ API REST con Flask
- ✅ Autenticación JWT
- ✅ SQLAlchemy ORM
- ✅ MySQL como base de datos
- ✅ CORS configurado
- ✅ Rutas protegidas

### Frontend
- ✅ React 18 con Vite
- ✅ PWA (Progressive Web App)
- ✅ Diseño responsive mobile-first
- ✅ Bottom navigation para móvil
- ✅ Gestión de estado con Zustand
- ✅ CSS semántico moderno
- ✅ Búsqueda en tiempo real

### UI/UX
- ✅ Diseño moderno con branding SENA
- ✅ Tablas que se convierten en tarjetas en móvil
- ✅ Menú kebab para acciones en móvil
- ✅ FAB (Floating Action Button)
- ✅ Optimizado para touch targets
- ✅ Sin scroll horizontal en móvil

---

## 📋 Requisitos Previos

- **Python 3.8+** → [Descargar](https://www.python.org/downloads/)
- **Node.js 18+** → [Descargar](https://nodejs.org/)
- **MySQL 8.0+** → [Descargar](https://dev.mysql.com/downloads/installer/)
- **Git** → [Descargar](https://git-scm.com/downloads)

---

## 🛠️ Instalación

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
.\\venv\\Scripts\\activate
# Mac/Linux:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
# Crear archivo .env con:
FLASK_APP=run.py
FLASK_ENV=development
SECRET_KEY=tu-secret-key-aqui
JWT_SECRET_KEY=tu-jwt-secret-key-aqui
SQLALCHEMY_DATABASE_URI=mysql+pymysql://root:@localhost/mafis_mvp_db
CORS_ORIGINS=http://localhost:5173

# Crear base de datos
# En MySQL:
CREATE DATABASE mafis_mvp_db;

# Inicializar tablas
python init_tables.py
```

### 3. Configurar Frontend

```bash
cd frontend

# Instalar dependencias
npm install
```

---

## 🚀 Ejecución

### Terminal 1 - Backend:
```bash
cd backend
.\\venv\\Scripts\\activate
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

## 🔐 Credenciales por Defecto

- **Email:** admin@mafis.com
- **Password:** admin123

---

## 📁 Estructura del Proyecto

```
MAFIS_MVP/
├── backend/                # API REST (Flask)
│   ├── app/
│   │   ├── modules/        # Módulos (auth, assets, reports)
│   │   │   ├── auth/
│   │   │   ├── assets/
│   │   │   └── reports/
│   │   ├── common/         # Utilidades compartidas
│   │   ├── config.py       # Configuración
│   │   └── extensions.py   # Extensiones Flask
│   ├── run.py              # Entry point
│   ├── init_tables.py      # Inicialización DB
│   └── requirements.txt    # Dependencias Python
│
├── frontend/               # SPA (React + Vite)
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   │   └── layout/     # Layout components
│   │   ├── features/       # Módulos por funcionalidad
│   │   │   ├── auth/       # Autenticación
│   │   │   ├── assets/     # Gestión de activos
│   │   │   └── reports/    # Gestión de reportes
│   │   ├── lib/            # Configuraciones (axios)
│   │   ├── App.jsx         # Componente principal
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Estilos globales
│   ├── package.json        # Dependencias Node
│   └── vite.config.js      # Configuración Vite
│
└── README.md               # Este archivo
```

---

## 🎨 Tecnologías Utilizadas

### Backend
- **Flask 3.0** - Framework web
- **Flask-SQLAlchemy** - ORM
- **Flask-JWT-Extended** - Autenticación JWT
- **Flask-CORS** - Manejo de CORS
- **PyMySQL** - Conector MySQL
- **Python-dotenv** - Variables de entorno

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

## 📱 Características Responsive

### Desktop (>1024px)
- Sidebar de navegación
- Tablas completas
- Iconos de acción directos

### Mobile (≤1024px)
- Bottom navigation bar
- Tarjetas en lugar de tablas
- Menú kebab para acciones
- FAB para crear elementos
- Barra de búsqueda optimizada

---

## 🔧 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/me` - Usuario actual (requiere token)

### Activos
- `GET /api/assets` - Listar activos
- `GET /api/assets/:id` - Obtener activo
- `POST /api/assets` - Crear activo
- `PUT /api/assets/:id` - Actualizar activo
- `DELETE /api/assets/:id` - Eliminar activo

### Reportes
- `GET /api/reports` - Listar reportes
- `GET /api/reports/:id` - Obtener reporte
- `POST /api/reports` - Crear reporte
- `PUT /api/reports/:id` - Actualizar reporte
- `DELETE /api/reports/:id` - Eliminar reporte

---

## 🎨 Sistema de Diseño

### Colores Principales
- **Azul SENA:** `#0066CC`
- **Verde SENA:** `#00A651`
- **Texto Principal:** `#1f2937`
- **Texto Secundario:** `#6b7280`

### Componentes
- Badges de estado (success, danger, warning)
- Botones primarios y secundarios
- Inputs con validación
- Tarjetas modernas
- Menús dropdown

---

## 🐛 Troubleshooting

### Error: "Subject must be a string"
**Solución:** Asegúrate de convertir el user.id a string en JWT:
```python
access_token = create_access_token(identity=str(user.id))
```

### Error: CORS
**Solución:** Verifica el proxy en `vite.config.js`:
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true,
  }
}
```

### Error: Base de datos no existe
**Solución:**
```sql
CREATE DATABASE mafis_mvp_db;
```
Luego ejecuta: `python init_tables.py`

---

## 📝 Licencia

Este proyecto es parte del material educativo del SENA.

---

## 👥 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📧 Contacto

**SENA - Servicio Nacional de Aprendizaje**

---

**Versión:** 2.0  
**Última actualización:** 24 de Noviembre, 2025
