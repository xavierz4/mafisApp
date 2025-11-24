# Paso 2: Base de Datos y Modelos

En este paso, configuraremos la conexión a MySQL y crearemos nuestro primer modelo: el Usuario.

## 2.1 Script de Creación de Base de Datos (`create_db.py`)

Creamos un script auxiliar para crear la base de datos si no existe. Esto es útil para inicializar el proyecto en una máquina nueva.

**Archivo:** `backend/create_db.py`
```python
import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

# Parse URI: mysql+pymysql://root:root@localhost/mafis_mvp_db
uri = os.environ.get('SQLALCHEMY_DATABASE_URI')
if not uri:
    print("No SQLALCHEMY_DATABASE_URI found")
    exit(1)

# Extract connection details
try:
    auth_part, db_part = uri.split('@')
    user_pass = auth_part.split('//')[1]
    user, password = user_pass.split(':')
    host_db = db_part.split('/')
    host = host_db[0]
    dbname = host_db[1]
except Exception as e:
    print(f"Error parsing URI: {e}")
    exit(1)

print(f"Connecting to {host} as {user} to create {dbname}...")

try:
    # Parse host and port
    if ':' in host:
        host, port = host.split(':')
        port = int(port)
    else:
        port = 3306

    conn = pymysql.connect(host=host, port=port, user=user, password=password)
    cursor = conn.cursor()
    cursor.execute(f"CREATE DATABASE IF NOT EXISTS {dbname}")
    print(f"Database {dbname} created successfully (or already exists).")
    cursor.close()
    conn.close()
except Exception as e:
    print(f"Error creating database: {e}")
```

**Ejecución:**
```bash
python create_db.py
```

## 2.2 Modelo de Usuario (`app/modules/users/models.py`)

Definimos la estructura de la tabla de usuarios usando SQLAlchemy. Incluimos métodos para encriptar contraseñas.

**Archivo:** `backend/app/modules/users/models.py`
```python
from app.extensions import db
from datetime import datetime
import bcrypt

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), default='requester') # admin, technician, requester
    phone = db.Column(db.String(20), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)

    def set_password(self, password):
        salt = bcrypt.gensalt()
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'role': self.role,
            'phone': self.phone,
            'is_active': self.is_active
        }
```

## 2.3 Inicialización de Tablas (`init_tables.py`)

Creamos un script para crear las tablas en la base de datos y un usuario administrador por defecto.

**Archivo:** `backend/init_tables.py`
```python
from app import create_app, db
from app.modules.users.models import User
# Importaremos otros modelos aquí a medida que los creemos (Assets, Reports, etc.)

app = create_app()

with app.app_context():
    print("Creating tables...")
    db.create_all()
    print("Tables created successfully.")
    
    # Create admin user if not exists
    if not User.query.filter_by(email='admin@mafis.com').first():
        print("Creating admin user...")
        admin = User(
            email='admin@mafis.com',
            name='Admin User',
            role='admin'
        )
        admin.set_password('admin123')
        db.session.add(admin)
        db.session.commit()
        print("Admin user created.")
```

**Ejecución:**
```bash
python init_tables.py
```
Esto creará la tabla `users` y el usuario `admin@mafis.com`.
