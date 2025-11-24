# Paso 6: Gestión de Activos (CRUD Completo)

En este paso, implementaremos la funcionalidad completa para gestionar Activos (Equipos, Ubicaciones, etc.). Esto implica conectar el Backend (que ya tiene las rutas) con nuevas pantallas en el Frontend.

## 6.1 Servicio de Frontend (`src/features/assets/service.js`)

Creamos un archivo dedicado para las llamadas a la API de activos. Esto mantiene nuestro código limpio y separado.

**Archivo:** `frontend/src/features/assets/service.js`
```javascript
import api from '../../lib/axios';

export const getAssets = async () => {
  const response = await api.get('/assets');
  return response.data;
};

export const getAsset = async (id) => {
  const response = await api.get(`/assets/${id}`);
  return response.data;
};

export const createAsset = async (assetData) => {
  const response = await api.post('/assets', assetData);
  return response.data;
};

export const updateAsset = async (id, assetData) => {
  const response = await api.put(`/assets/${id}`, assetData);
  return response.data;
};

export const deleteAsset = async (id) => {
  const response = await api.delete(`/assets/${id}`);
  return response.data;
};
```

## 6.2 Listado de Activos (`src/features/assets/AssetsList.jsx`)

Creamos un componente para mostrar una tabla con todos los activos. Usamos `useEffect` para cargar los datos al montar el componente.

**Conceptos Clave:**
- **useEffect**: Ejecuta código cuando el componente se carga.
- **useState**: Guarda la lista de activos y el estado de carga.
- **Map**: Recorremos el array de activos para crear las filas de la tabla.

**Archivo:** `frontend/src/features/assets/AssetsList.jsx`
*(Ver código fuente completo en el proyecto. Incluye tabla con Tailwind CSS y botones de editar/eliminar)*

## 6.3 Formulario de Activos (`src/features/assets/AssetForm.jsx`)

Creamos un formulario reutilizable tanto para **Crear** como para **Editar**.
- Si la URL tiene un ID (`/assets/1/edit`), cargamos los datos existentes.
- Si no (`/assets/new`), mostramos el formulario vacío.

**Archivo:** `frontend/src/features/assets/AssetForm.jsx`
*(Ver código fuente completo. Incluye manejo de formulario controlado y validación básica)*

## 6.4 Registro de Rutas (`src/App.jsx`)

Actualizamos el archivo principal para incluir las nuevas rutas.

**Archivo:** `frontend/src/App.jsx`
```javascript
// Importaciones
import AssetsList from './features/assets/AssetsList';
import AssetForm from './features/assets/AssetForm';

// Dentro de <Routes> ... <Route path="/dashboard" ... >
<Route path="assets" element={<AssetsList />} />
<Route path="assets/new" element={<AssetForm />} />
<Route path="assets/:id/edit" element={<AssetForm />} />
```

## Verificación

1. Navega a `/dashboard/assets`.
2. Haz clic en "Nuevo Activo".
3. Crea un activo de prueba (ej. "Compresor de Aire", Tipo: Equipo).
4. Verifica que aparece en la lista.
5. Intenta editarlo y eliminarlo.
