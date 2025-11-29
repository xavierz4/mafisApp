"""
Script para crear usuarios de prueba en el sistema MAFIS
Ejecutar: python seed_users.py
"""
from app import create_app
from app.extensions import db
from app.modules.users.models import User

app = create_app()

def seed_users():
    with app.app_context():
        print(" Iniciando creación de usuarios de prueba...")
        
        # Lista de usuarios a crear
        users_data = [
            {
                'name': 'Admin Principal',
                'email': 'admin@mafis.com',
                'password': 'admin123',
                'role': 'admin',
                'phone': '3001234567'
            },
            {
                'name': 'Juan Pérez',
                'email': 'juan.perez@mafis.com',
                'password': 'tecnico123',
                'role': 'technician',
                'phone': '3009876543'
            },
            {
                'name': 'María García',
                'email': 'maria.garcia@mafis.com',
                'password': 'tecnico123',
                'role': 'technician',
                'phone': '3001112222'
            },
            {
                'name': 'Carlos Rodríguez',
                'email': 'carlos.rodriguez@mafis.com',
                'password': 'tecnico123',
                'role': 'technician',
                'phone': '3003334444'
            },
            {
                'name': 'Ana Martínez',
                'email': 'ana.martinez@mafis.com',
                'password': 'tecnico123',
                'role': 'technician',
                'phone': '3005556666'
            },
            {
                'name': 'Pedro López',
                'email': 'pedro.lopez@mafis.com',
                'password': 'solicitante123',
                'role': 'requester',
                'phone': '3007778888'
            },
            {
                'name': 'Laura Sánchez',
                'email': 'laura.sanchez@mafis.com',
                'password': 'solicitante123',
                'role': 'requester',
                'phone': '3009990000'
            }
        ]
        
        created_count = 0
        skipped_count = 0
        
        for user_data in users_data:
            # Verificar si el usuario ya existe
            existing_user = User.query.filter_by(email=user_data['email']).first()
            
            if existing_user:
                print(f"Usuario ya existe: {user_data['email']}")
                skipped_count += 1
                continue
            
            # Crear nuevo usuario
            new_user = User(
                name=user_data['name'],
                email=user_data['email'],
                role=user_data['role'],
                phone=user_data['phone']
            )
            new_user.set_password(user_data['password'])
            
            db.session.add(new_user)
            created_count += 1
            
            role_emoji = {
                'admin': '',
                'technician': '',
                'requester': ''
            }
            
            print(f" Creado: {role_emoji.get(user_data['role'], '')} {user_data['name']} ({user_data['email']}) - Rol: {user_data['role']}")
        
        # Guardar todos los cambios
        db.session.commit()
        
        print(f"\n Resumen:")
        print(f"    Usuarios creados: {created_count}")
        print(f"   Usuarios existentes: {skipped_count}")
        print(f"\n Credenciales de acceso:")
        print(f"   Admin: admin@mafis.com / admin123")
        print(f"   Técnicos: [nombre]@mafis.com / tecnico123")
        print(f"   Solicitantes: [nombre]@mafis.com / solicitante123")
        print(f"\n ¡Listo! Puedes iniciar sesión con cualquiera de estos usuarios.")

if __name__ == '__main__':
    seed_users()
