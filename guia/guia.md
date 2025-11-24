# Guía de Construcción: MAFIS MVP

Esta guía documenta paso a paso el proceso de construcción de la aplicación **MAFIS MVP**. Está diseñada para ser un recurso educativo, explicando no solo el "cómo" sino también el "por qué" de las decisiones técnicas y la estructura del código.

---

## 0. Configuración Inicial y Git

Antes de empezar, configuramos el entorno y el control de versiones.

### Paso 0: Estructura y Git (`guia/00_Configuracion_Inicial.md`)
- **Estructura**: Monolito Modular (Backend) + SPA (Frontend).
- **Git**: Ramas `main` (estable) y `develop` (trabajo).
- **Configuración**: `requirements.txt` (Flask) y `package.json` (React/Vite).

---

## 1. Arquitectura y Diseño

Antes de escribir código, definimos la estructura. Para este proyecto, elegimos arquitecturas que favorecen la organización y el mantenimiento a largo plazo.

### Backend: Modular Monolith
En lugar de mezclar todo, dividimos el backend en **Módulos** basados en funcionalidades (Usuarios, Activos, Reportes).
- **Ventaja**: Mantiene el código relacionado junto. Si quieres cambiar algo de "Usuarios", vas a la carpeta `users`.
- **Estructura**:
  ```
  backend/app/
  ├── common/       # Utilidades compartidas
  ├── modules/      # Aquí viven las funcionalidades
  │   ├── auth/     # Login, Registro
  │   ├── users/    # Gestión de usuarios
  │   └── assets/   # Gestión de activos
  ├── __init__.py   # Fábrica de la aplicación
  └── extensions.py # Plugins (Base de datos, JWT)
  ```

### Frontend: Feature-based Architecture
Similar al backend, organizamos el frontend por **Features** (Características).
- **Estructura**:
  ```
  frontend/src/
  ├── components/   # Botones, Inputs reutilizables
  ├── features/     # Módulos principales
  │   ├── auth/     # Login, Registro, Estado de Auth
  │   └── dashboard/# Pantallas del panel principal
  ├── lib/          # Configuraciones (Axios)
  └── App.jsx       # Rutas principales
  ```

---

## 2. Backend: Fundamentos (Flask)

### Paso 2.1: Configuración Inicial
Creamos el archivo `requirements.txt` con las librerías necesarias:
- `Flask`: El framework web.
- `Flask-SQLAlchemy`: Para manejar la Base de Datos (ORM).
- `Flask-JWT-Extended`: Para la seguridad (Tokens).
- `Flask-Cors`: Para permitir que el Frontend hable con el Backend.

### Paso 2.2: El Patrón "Application Factory" (`app/__init__.py`)
En lugar de crear la `app` globalmente, usamos una función `create_app()`.
**¿Por qué?** Nos permite crear múltiples instancias de la app con diferentes configuraciones (por ejemplo, una para desarrollo y otra para pruebas).

```python
# backend/app/__init__.py
def create_app(config_name=None):
    app = Flask(__name__)
    # ... configuración ...
    db.init_app(app) # Inicializamos la DB con esta app
    return app
```

### Paso 2.3: Extensiones Centralizadas (`app/extensions.py`)
Creamos las instancias de `db`, `jwt`, etc., en un archivo separado para evitar "importaciones circulares" (cuando el archivo A importa B y B importa A).

---

## 3. Backend: Módulo de Usuarios y Autenticación

### Paso 3.1: El Modelo de Datos (`modules/users/models.py`)
Definimos cómo se ve un usuario en la base de datos usando una **Clase**.
- Usamos `bcrypt` para **hashear** (encriptar) las contraseñas. **Nunca guardamos contraseñas en texto plano.**

```python
class User(db.Model):
    # ... campos ...
    def set_password(self, password):
        # Crea un hash seguro de la contraseña
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
```

### Paso 3.2: Rutas de Autenticación (`modules/auth/routes.py`)
Creamos los endpoints (URLs) que el frontend va a llamar.
- `POST /register`: Crea un usuario nuevo.
- `POST /login`: Verifica credenciales y devuelve un **Token JWT**.

**¿Qué es un JWT (JSON Web Token)?**
Es como un "carnet de identidad" digital. Cuando el usuario hace login, le damos este token. Para las siguientes peticiones (como "crear reporte"), el usuario envía este token para demostrar quién es.

---

## 4. Frontend: React + Vite

### Paso 4.1: Instalación y Limpieza
Usamos **Vite** porque es mucho más rápido que las herramientas antiguas.
- `npm create vite@latest`
- Instalamos **Tailwind CSS** para los estilos. Tailwind nos permite dar estilo directamente en el HTML (JSX) sin crear archivos CSS separados.

### Paso 4.2: Cliente HTTP (`lib/axios.js`)
Configuramos **Axios** (una librería para hacer peticiones).
**Truco Pro**: Usamos "Interceptores".
- **Request Interceptor**: Antes de enviar cualquier petición, busca el Token en el almacenamiento local y lo pega en la cabecera. Así no tenemos que hacerlo manualmente en cada llamada.

```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Paso 4.3: Gestión de Estado (`features/auth/store.js`)
Usamos **Zustand** para manejar el estado global (¿Quién está logueado?). Es más simple que Redux.
- `login()`: Llama a la API, guarda el token y actualiza el estado `user`.
- `isAuthenticated`: Una variable booleana para saber si mostramos el Dashboard o el Login.

---

## 5. Conectando las Piezas

### Paso 5.1: Rutas Protegidas (`App.jsx`)
Creamos un componente `ProtectedRoute`. Si el usuario no está autenticado, lo "patea" de vuelta al Login.

```javascript
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" />;
  return children;
};
```

### Paso 5.2: El Dashboard (`components/layout/DashboardLayout.jsx`)
Creamos un layout con una barra lateral (Sidebar) que siempre está visible. Usamos `Outlet` de React Router para mostrar el contenido cambiante (Home, Activos, Reportes) dentro del área principal.

---

## Resumen de Flujo de Datos

1. **Usuario** entra a `/login`.
2. Introduce credenciales -> **Frontend** llama a `POST /api/auth/login`.
3. **Backend** verifica hash de contraseña -> Genera **JWT** -> Lo devuelve.
4. **Frontend** guarda JWT en `localStorage` y actualiza el estado a "Autenticado".
5. **Frontend** redirige a `/dashboard`.
6. **Usuario** carga Dashboard -> Frontend pide datos a `/api/auth/me` (usando el token automáticamente).
7. **Backend** lee el token, sabe quién es el usuario y devuelve sus datos.

---

## Próximos Pasos para los Aprendices

Para continuar construyendo sobre esta base:
1. **Activos**: Replicar el patrón de `auth` para crear el CRUD de activos.
   - Crear `features/assets/service.js` (API).
   - Crear componentes para listar y crear activos.
2. **Reportes**: Crear un formulario que permita seleccionar un activo y enviar un reporte.
3. **Mejoras**: Agregar validaciones en los formularios y manejo de errores más visual.
