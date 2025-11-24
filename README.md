# MAFIS MVP

Sistema de Gestión de Mantenimiento (MVP).

## Estructura
- `backend/`: API REST con Flask (Modular Monolith).
- `frontend/`: SPA/PWA con React + Vite.

## Configuración Inicial

### Backend
1. Navegar a `backend/`.
2. Crear entorno virtual: `python -m venv venv`.
3. Activar entorno: `.\venv\Scripts\activate`.
4. Instalar dependencias: `pip install -r requirements.txt`.
5. Crear base de datos `mafis_mvp_db` en MySQL.
6. Ejecutar: `python run.py`.

### Frontend
1. Navegar a `frontend/`.
2. Instalar dependencias: `npm install`.
3. Ejecutar: `npm run dev`.


## Flujo de Trabajo (Git)

- **Rama `main`**: Código estable.
- **Rama `develop`**: Desarrollo activo.

```bash
# Para trabajar
git checkout develop
git pull origin develop
# ... hacer cambios ...
git add .
git commit -m "Descripción"
git push origin develop
```

## Credenciales por defecto
- **Admin**: `admin@mafis.com` / `admin123`
