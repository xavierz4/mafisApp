from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.modules.users import services
from app.common.decorators import admin_required

users_bp = Blueprint('users', __name__)

@users_bp.route('/', methods=['GET'])
@jwt_required()
def get_users():
    role_filter = request.args.get('role')
    
    # Check permissions
    current_user_id = int(get_jwt_identity())
    current_user = services.get_user_by_id(current_user_id)
    
    if current_user.role != 'admin':
        # Non-admins can only list technicians
        if role_filter != 'technician':
            return jsonify({'message': 'Access denied'}), 403
            
    users = services.get_all_users(role_filter)
    return jsonify([user.to_dict() for user in users]), 200

@users_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_user(id):
    # Allow users to view their own profile or admins to view any
    current_user_id = int(get_jwt_identity())
    user = services.get_user_by_id(id)
    
    # Check if user is viewing their own profile or is admin
    if current_user_id != id:
        current_user = services.get_user_by_id(current_user_id)
        if current_user.role != 'admin':
            return jsonify({'message': 'Access denied'}), 403
    
    return jsonify(user.to_dict()), 200

@users_bp.route('/', methods=['POST'])
@jwt_required()
@admin_required
def create_user():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['email', 'password', 'name']
        missing = [f for f in required_fields if not data.get(f)]
        if missing:
            return jsonify({'message': f'Missing required fields: {", ".join(missing)}'}), 400
        
        new_user = services.create_user(data)
        return jsonify(new_user.to_dict()), 201
    except ValueError as e:
        return jsonify({'message': str(e)}), 400

@users_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_user(id):
    # Allow users to update their own profile or admins to update any
    current_user_id = int(get_jwt_identity())
    current_user = services.get_user_by_id(current_user_id)
    
    # Non-admins can only update their own profile
    if current_user.role != 'admin' and current_user_id != id:
        return jsonify({'message': 'Access denied'}), 403
    
    data = request.get_json()
    
    # Non-admins cannot change their own role
    if current_user.role != 'admin' and 'role' in data:
        return jsonify({'message': 'Cannot change your own role'}), 403
    
    user = services.update_user(id, data)
    return jsonify(user.to_dict()), 200

@users_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_user(id):
    # Prevent self-deletion
    current_user_id = int(get_jwt_identity())
    if current_user_id == id:
        return jsonify({'message': 'Cannot delete your own account'}), 400
    
    services.delete_user(id)
    return jsonify({'message': 'User deleted'}), 200

@users_bp.route('/me/preferences', methods=['PUT'])
@jwt_required()
def update_my_preferences():
    current_user_id = int(get_jwt_identity())
    data = request.get_json()
    
    # Wrap preferences in a dict if sent directly
    update_data = {'preferences': data}
    
    user = services.update_user(current_user_id, update_data)
    return jsonify(user.to_dict()), 200
