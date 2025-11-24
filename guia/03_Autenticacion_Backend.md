# Paso 3: Implementación de Autenticación (Backend)

En este paso, crearemos las rutas para que los usuarios puedan registrarse e iniciar sesión, obteniendo un token JWT.

## 3.1 Rutas de Autenticación (`app/modules/auth/routes.py`)

Creamos un "Blueprint" para agrupar las rutas de autenticación.

**Archivo:** `backend/app/modules/auth/routes.py`
```python
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.extensions import db
from app.modules.users.models import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if User.query.filter_by(email=data.get('email')).first():
        return jsonify({'message': 'Email already registered'}), 400
        
    new_user = User(
        email=data.get('email'),
        name=data.get('name'),
        role=data.get('role', 'requester'),
        phone=data.get('phone')
    )
    new_user.set_password(data.get('password'))
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'User registered successfully', 'user': new_user.to_dict()}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get('email')).first()
    
    if user and user.check_password(data.get('password')):
        # Creamos el token JWT usando el ID del usuario como identidad
        access_token = create_access_token(identity=user.id)
        return jsonify({
            'access_token': access_token,
            'user': user.to_dict()
        }), 200
        
    return jsonify({'message': 'Invalid credentials'}), 401

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    # Obtenemos la identidad (ID) del token actual
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    return jsonify(user.to_dict()), 200
```

## 3.2 Registro del Blueprint (`app/__init__.py`)

Recuerda que debemos registrar este Blueprint en `app/__init__.py` (esto ya lo hicimos en el paso 1, pero asegúrate de que esté descomentado).

```python
    # Register Blueprints
    from .modules.auth.routes import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
```

## Verificación con Postman/Curl

1. **Login**:
   - URL: `POST http://localhost:5000/api/auth/login`
   - Body (JSON): `{"email": "admin@mafis.com", "password": "admin123"}`
   - Respuesta esperada: Un JSON con `access_token` y datos del usuario.
