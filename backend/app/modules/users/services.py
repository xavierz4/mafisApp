from app.extensions import db
from app.modules.users.models import User


def get_all_users(role=None):
    query = User.query
    if role:
        query = query.filter_by(role=role)
    return query.all()

def get_user_by_id(user_id):
    return User.query.get_or_404(user_id)

def get_user_by_email(email):
    return User.query.filter_by(email=email).first()

def create_user(data):
    # Check if user exists
    if User.query.filter_by(email=data.get('email')).first():
        raise ValueError('Email already registered')
        
    new_user = User(
        email=data.get('email'),
        name=data.get('name'),
        role=data.get('role', 'requester'),
        phone=data.get('phone')
    )
    new_user.set_password(data.get('password'))
    
    db.session.add(new_user)
    db.session.commit()
    return new_user

def update_user(user_id, data):
    user = User.query.get_or_404(user_id)
    
    if 'name' in data:
        user.name = data['name']
    if 'phone' in data:
        user.phone = data['phone']
    if 'role' in data:
        user.role = data['role']
    if 'is_active' in data:
        user.is_active = data['is_active']
        
    # Notification Preferences
    if 'preferences' in data:
        prefs = data['preferences']
        if 'email' in prefs:
            user.notify_email = prefs['email']
        if 'whatsapp' in prefs:
            user.notify_whatsapp = prefs['whatsapp']
        if 'push' in prefs:
            user.notify_push = prefs['push']
    
    # Only update password if provided
    if 'password' in data and data['password']:
        user.set_password(data['password'])
        
    db.session.commit()
    return user

def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return True
