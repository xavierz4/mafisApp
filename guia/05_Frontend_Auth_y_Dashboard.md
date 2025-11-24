# Paso 5: Autenticación Frontend y Dashboard

En este paso, implementaremos el flujo de login/registro y crearemos el layout principal del Dashboard protegido por autenticación.

## 5.1 Servicio de Autenticación (`src/features/auth/service.js`)

Creamos funciones para llamar a nuestra API.

**Archivo:** `frontend/src/features/auth/service.js`
```javascript
import api from '../../lib/axios';

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};
```

## 5.2 Store de Autenticación (`src/features/auth/store.js`)

Usamos **Zustand** para manejar el estado global del usuario.

**Archivo:** `frontend/src/features/auth/store.js`
```javascript
import { create } from 'zustand';
import { login as loginApi, register as registerApi } from './service';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await loginApi(email, password);
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      set({ 
        user: data.user, 
        token: data.access_token, 
        isAuthenticated: true, 
        isLoading: false 
      });
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Error al iniciar sesión', 
        isLoading: false 
      });
      return false;
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      await registerApi(userData);
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Error al registrarse', 
        isLoading: false 
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
```

## 5.3 Páginas de Login y Registro

Implementamos los formularios usando React Hook Form o estados simples.

**Archivo:** `frontend/src/features/auth/LoginPage.jsx`
*(Ver archivo completo en el código fuente del proyecto)*

**Archivo:** `frontend/src/features/auth/RegisterPage.jsx`
*(Ver archivo completo en el código fuente del proyecto)*

## 5.4 Layout del Dashboard (`src/components/layout/DashboardLayout.jsx`)

Creamos un layout con barra lateral y cabecera. Usamos `Outlet` para renderizar el contenido hijo.

**Archivo:** `frontend/src/components/layout/DashboardLayout.jsx`
*(Este archivo contiene la lógica de la barra lateral responsive y la navegación. Ver código fuente para detalles completos de implementación UI)*

## 5.5 Configuración de Rutas (`src/App.jsx`)

Finalmente, configuramos las rutas y protegemos el acceso al Dashboard.

**Archivo:** `frontend/src/App.jsx`
```javascript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardHome from './features/dashboard/DashboardHome';
import useAuthStore from './features/auth/store';

// Componente de Ruta Protegida
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardHome />} />
          <Route path="assets" element={<div>Activos (Próximamente)</div>} />
          <Route path="reports" element={<div>Reportes (Próximamente)</div>} />
          <Route path="work-orders" element={<div>Órdenes (Próximamente)</div>} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;
```

## Verificación

1. Abre `http://localhost:5173`.
2. Deberías ser redirigido a `/login`.
3. Regístrate o inicia sesión.
4. Deberías ver el Dashboard.
