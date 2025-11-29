"""
Common decorators for authorization and access control
"""
from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from app.modules.users.models import User

def admin_required(fn):
    """
    Decorator to restrict access to admin users only.
    Must be used after @jwt_required()
    """
    @wraps(fn)
    def wrapper(*args, **kwargs):
        current_user_id = int(get_jwt_identity())
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
            
        if user.role != 'admin':
            return jsonify({'message': 'Admin access required'}), 403
            
        return fn(*args, **kwargs)
    return wrapper

def role_required(*allowed_roles):
    """
    Decorator to restrict access to specific roles.
    Usage: @role_required('admin', 'technician')
    Must be used after @jwt_required()
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            current_user_id = int(get_jwt_identity())
            user = User.query.get(current_user_id)
            
            if not user:
                return jsonify({'message': 'User not found'}), 404
                
            if user.role not in allowed_roles:
                return jsonify({'message': f'Access denied. Required roles: {", ".join(allowed_roles)}'}), 403
                
            return fn(*args, **kwargs)
        return wrapper
    return decorator
