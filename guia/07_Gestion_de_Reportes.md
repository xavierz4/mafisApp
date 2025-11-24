# Paso 7: Reportes de Fallas

En este paso, permitiremos que los usuarios creen reportes de fallas asociados a los activos que creamos en el paso anterior.

## 7.1 Servicio de Reportes (`src/features/reports/service.js`)

Similar a activos, creamos el servicio para conectar con la API.

**Archivo:** `frontend/src/features/reports/service.js`
```javascript
import api from '../../lib/axios';

export const getReports = async () => {
  const response = await api.get('/reports');
  return response.data;
};

export const createReport = async (reportData) => {
  const response = await api.post('/reports', reportData);
  return response.data;
};
// ... otros métodos
```

## 7.2 Listado de Reportes (`src/features/reports/ReportsList.jsx`)

Mostramos una tabla con el historial de reportes.
- Incluimos una columna de "Estado" con colores dinámicos (Rojo para Abierto, Verde para Resuelto).
- Mostramos el nombre del activo asociado.

**Archivo:** `frontend/src/features/reports/ReportsList.jsx`
*(Ver código fuente completo)*

## 7.3 Formulario de Reporte (`src/features/reports/ReportForm.jsx`)

Este formulario tiene una particularidad: **Necesita cargar la lista de activos**.
- Al cargar el componente, llamamos a `getAssets()` para llenar un `<select>`.
- El usuario selecciona el activo, describe la falla y asigna una prioridad.

**Flujo del Componente:**
1. `useEffect` -> Carga Activos.
2. Usuario llena formulario.
3. `handleSubmit` -> Envía datos (`asset_id`, `description`, `priority`) al backend.

**Archivo:** `frontend/src/features/reports/ReportForm.jsx`
*(Ver código fuente completo)*

## 7.4 Registro de Rutas (`src/App.jsx`)

Agregamos las rutas de reportes.

**Archivo:** `frontend/src/App.jsx`
```javascript
// Importaciones
import ReportsList from './features/reports/ReportsList';
import ReportForm from './features/reports/ReportForm';

// Rutas
<Route path="reports" element={<ReportsList />} />
<Route path="reports/new" element={<ReportForm />} />
```

## Verificación

1. Ve a "Reportes" en el menú lateral.
2. Crea un nuevo reporte.
3. Verifica que el selector de activos muestre los activos que creaste en el paso 6.
4. Envía el reporte y verifica que aparece en la lista con estado "OPEN" (o el defecto que tenga tu backend).
