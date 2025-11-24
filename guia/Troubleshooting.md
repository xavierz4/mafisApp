# Solución de Problemas Comunes

Esta sección documenta errores comunes encontrados durante el desarrollo y cómo resolverlos.

## 1. Error 401 Unauthorized / Redirecciones 308

**Síntoma:** Al navegar a `/dashboard/assets` o `/dashboard/reports`, la aplicación cierra sesión automáticamente o muestra error 401.
**Causa:** Flask, por defecto, es estricto con las barras al final de la URL (`strict_slashes=True`). Si la ruta está definida como `/api/assets/` y el frontend llama a `/api/assets` (sin barra), Flask devuelve una redirección 308. Durante esta redirección, el navegador puede perder la cabecera `Authorization` con el token JWT.
**Solución:** Configurar las rutas con `strict_slashes=False` y definir la ruta raíz como `/`.

```python
# backend/app/modules/assets/routes.py

# INCORRECTO (Causa redirección si falta la barra)
# @assets_bp.route('/') 

# CORRECTO (Acepta con y sin barra)
@assets_bp.route('/', methods=['GET'], strict_slashes=False)
def get_assets():
    # ...
```

## 2. Error 422 Unprocessable Entity

**Síntoma:** Al intentar crear un registro (POST), el servidor devuelve 422.
**Causa:** Generalmente indica que los datos enviados no cumplen con el esquema esperado, o que hay un problema con la validación del token JWT.
**Diagnóstico:**
1.  Verificar que el `Content-Type` sea `application/json`.
2.  Verificar que el token JWT sea válido y se esté enviando en la cabecera.
3.  Agregar logs en el backend para ver qué datos están llegando.

```python
# Debugging en backend
@assets_bp.route('/', methods=['POST'], strict_slashes=False)
def create_asset():
    data = request.get_json()
    print(f"DEBUG Payload: {data}") # Ver en consola del servidor
    # ...
```

## 3. Error 404 Not Found en API

**Síntoma:** El frontend recibe 404 al llamar a `/api/assets`.
**Causa:** La ruta no coincide. Puede ser por el problema de `strict_slashes` mencionado arriba, o porque el Blueprint no está registrado con el prefijo correcto.
**Solución:** Verificar `app/__init__.py` y la definición de rutas.

```python
# app/__init__.py
app.register_blueprint(assets_bp, url_prefix='/api/assets')
```

## 4. Error "Subject must be a string" en JWT

**Síntoma:** El login parece funcionar pero al intentar acceder a rutas protegidas se recibe 401 con el mensaje "Subject must be a string" en los logs del servidor.

**Causa:** Flask-JWT-Extended requiere que el `identity` en `create_access_token()` sea una cadena de texto (string), pero se está pasando un entero (el ID del usuario).

**Solución:** Convertir el ID del usuario a string al crear el token y convertirlo de vuelta a int al recuperarlo.

```python
# En auth/routes.py - Al crear el token
access_token = create_access_token(identity=str(user.id))  # Convertir a string

# En cualquier ruta protegida - Al recuperar el identity
current_user_id = int(get_jwt_identity())  # Convertir de vuelta a int
user = User.query.get(current_user_id)
```

**Archivos que necesitan esta corrección:**
- `app/modules/auth/routes.py` (login y /me endpoints)
- `app/modules/reports/routes.py` (create_report)
- Cualquier otro endpoint que use `get_jwt_identity()`

## 5. Error de Login Fallido / Base de Datos no Inicializada

**Síntoma:** El login falla inmediatamente o redirige al login sin mensaje de error claro. Los logs del servidor pueden mostrar 401 en rutas protegidas.
**Causa:** La base de datos no ha sido inicializada o el usuario administrador no existe.
**Solución:** Ejecutar el script de inicialización de tablas.

```bash
cd backend
python init_tables.py
```

Este script crea las tablas necesarias y el usuario administrador por defecto (`admin@mafis.com` / `admin123`).

