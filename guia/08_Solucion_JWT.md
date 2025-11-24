# Paso 8: Solución de Problemas JWT y Finalización

En este paso documentamos un problema crítico que encontramos durante el desarrollo y su solución.

## 8.1 El Problema: "Subject must be a string"

**Síntoma:** 
- El login funcionaba correctamente
- El usuario recibía un token
- Pero al intentar acceder a rutas protegidas (como `/api/assets`), recibía error 401
- En los logs del servidor aparecía: `"Subject must be a string"`

**Causa Raíz:**
Flask-JWT-Extended requiere que el parámetro `identity` en `create_access_token()` sea una **cadena de texto (string)**, no un número entero. Estábamos pasando directamente `user.id` (que es un `int`).

## 8.2 La Solución

### Backend: Convertir ID a String al Crear Token

**Archivo:** `backend/app/modules/auth/routes.py`

```python
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get('email')).first()
    
    if user and user.check_password(data.get('password')):
        # IMPORTANTE: Convertir user.id a string
        access_token = create_access_token(identity=str(user.id))
        return jsonify({
            'access_token': access_token,
            'user': user.to_dict()
        }), 200
        
    return jsonify({'message': 'Invalid credentials'}), 401
```

### Backend: Convertir de Vuelta a Int al Leer Token

En **todas** las rutas protegidas que usen `get_jwt_identity()`:

```python
@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    # Convertir el identity (string) de vuelta a int
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)
    return jsonify(user.to_dict()), 200
```

**Archivos que requieren este cambio:**
- `app/modules/auth/routes.py` (endpoint `/me`)
- `app/modules/reports/routes.py` (función `create_report`)
- Cualquier otro endpoint futuro que use `get_jwt_identity()`

## 8.3 Configuración JWT Mejorada

**Archivo:** `backend/app/config.py`

```python
class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'hard-to-guess-string'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('SQLALCHEMY_DATABASE_URI')
    
    # JWT Configuration - Explicit to avoid fallback issues
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or os.environ.get('SECRET_KEY') or 'jwt-secret-key-change-in-production'
    JWT_ACCESS_TOKEN_EXPIRES = 86400  # 24 hours
    JWT_ALGORITHM = 'HS256'  # Explicitly set algorithm
```

**Mejoras:**
1. **Fallback en cascada**: Si `JWT_SECRET_KEY` no está en `.env`, usa `SECRET_KEY`, y si tampoco existe, usa un valor por defecto.
2. **Expiración extendida**: 24 horas para desarrollo (ajustar en producción).
3. **Algoritmo explícito**: HS256 definido claramente.

## 8.4 Carga Explícita de Variables de Entorno

**Archivo:** `backend/run.py`

```python
import os
from dotenv import load_dotenv

# Load .env explicitly before creating app
load_dotenv()

from app import create_app

app = create_app()

if __name__ == '__main__':
    if not os.environ.get('JWT_SECRET_KEY'):
        print("CRITICAL ERROR: JWT_SECRET_KEY not found in environment variables.")
        print("Please ensure .env file exists and contains JWT_SECRET_KEY.")
        exit(1)
    app.run(host='0.0.0.0', port=5000)
```

**Beneficios:**
- Carga `.env` **antes** de crear la app
- Valida que `JWT_SECRET_KEY` exista antes de arrancar
- Previene errores silenciosos de configuración

## 8.5 Verificación Final

Para verificar que todo funciona correctamente:

1. **Reinicia el servidor backend**:
   ```bash
   cd backend
   python run.py
   ```

2. **Prueba el login desde el frontend**:
   - Ve a `http://localhost:5173`
   - Inicia sesión con `admin@mafis.com` / `admin123`
   - Navega a **Activos** o **Reportes**
   - Deberías poder ver las listas sin errores 401

3. **Verifica en la consola del navegador**:
   - No deberían aparecer errores de autenticación
   - Las peticiones a `/api/assets` y `/api/reports` deberían retornar 200

## 8.6 Lecciones Aprendidas

1. **Tipos de datos importan**: Aunque Python es dinámico, las librerías pueden tener requisitos estrictos sobre tipos.

2. **Lee los logs del servidor**: El mensaje "Subject must be a string" fue la clave para identificar el problema.

3. **Prueba end-to-end**: No basta con que el login funcione; hay que probar el flujo completo de autenticación.

4. **Documentación**: Siempre documenta problemas y soluciones para referencia futura (ver `Troubleshooting.md`).

## Próximos Pasos

Con la autenticación funcionando correctamente, estás listo para:
- Implementar la gestión de Órdenes de Trabajo
- Agregar pruebas automatizadas
- Implementar notificaciones
- Desplegar a producción
