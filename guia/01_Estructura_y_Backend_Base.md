# Paso 1: Estructura del Backend y Configuración Base

En este paso, configuraremos el entorno de Python y la estructura básica de la aplicación Flask usando el patrón "Application Factory".

## 1.1 Estructura de Carpetas

Primero, creamos la estructura de directorios para organizar nuestro código de manera modular.

```bash
mkdir backend
cd backend
mkdir app
mkdir app/common
mkdir app/modules
```

## 1.2 Dependencias (`requirements.txt`)

Creamos el archivo `requirements.txt` en la carpeta `backend/` con las librerías necesarias.

**Archivo:** `backend/requirements.txt`
```text
Flask
Flask-SQLAlchemy
Flask-Migrate
Flask-Cors
Flask-JWT-Extended
python-dotenv
PyMySQL
cryptography
pydantic
email-validator
gunicorn
```

**Instalación:**
```bash
python -m venv venv
.\venv\Scripts\activate  # En Windows
pip install -r requirements.txt
```

## 1.3 Variables de Entorno (`.env`)

Creamos un archivo `.env` en `backend/` para guardar configuraciones sensibles.

**Archivo:** `backend/.env`
```properties
FLASK_APP=run.py
FLASK_ENV=development
SECRET_KEY=dev-secret-key-change-in-production
SQLALCHEMY_DATABASE_URI=mysql+pymysql://root:@localhost/mafis_mvp_db
JWT_SECRET_KEY=jwt-secret-key-change-in-production
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```
*Nota: Asegúrate de ajustar `SQLALCHEMY_DATABASE_URI` con tu usuario y contraseña de MySQL.*

## 1.4 Configuración de la App (`app/config.py`)

Creamos una clase de configuración para cargar las variables de entorno.

**Archivo:** `backend/app/config.py`
```python
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'hard-to-guess-string'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('SQLALCHEMY_DATABASE_URI')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
    
    # CORS
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', '*').split(',')

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
```

## 1.5 Extensiones (`app/extensions.py`)

Inicializamos las extensiones de Flask (DB, JWT, CORS) en un archivo separado.

**Archivo:** `backend/app/extensions.py`
```python
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate

db = SQLAlchemy()
jwt = JWTManager()
cors = CORS()
migrate = Migrate()
```

## 1.6 Fábrica de Aplicación (`app/__init__.py`)

Creamos la función `create_app` que ensambla todo.

**Archivo:** `backend/app/__init__.py`
```python
import os
from flask import Flask, jsonify
from .config import config
from .extensions import db, jwt, cors, migrate

def create_app(config_name=None):
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'default')
    
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Initialize Extensions
    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": app.config['CORS_ORIGINS']}})
    migrate.init_app(app, db)
    
    # Register Blueprints (Se agregarán en pasos futuros)
    # from .modules.auth.routes import auth_bp
    # app.register_blueprint(auth_bp, url_prefix='/api/auth')
    
    @app.route('/api/health')
    def health():
        return jsonify({"status": "healthy", "app": "MAFIS_MVP"})
        
    return app
```

## 1.7 Punto de Entrada (`run.py`)

Finalmente, el script para ejecutar el servidor.

**Archivo:** `backend/run.py`
```python
from app import create_app

app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

## Verificación

Ejecuta el servidor:
```bash
python run.py
```
Deberías ver que inicia en el puerto 5000. Puedes probar en tu navegador: `http://localhost:5000/api/health`.
