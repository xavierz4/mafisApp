from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.modules.assets import services

assets_bp = Blueprint('assets', __name__)

@assets_bp.route('/', methods=['GET'], strict_slashes=False)
@jwt_required()
def get_assets():
    print("DEBUG: get_assets called")
    type_filter = request.args.get('type')
    assets = services.get_all_assets(type_filter)
    return jsonify([asset.to_dict() for asset in assets]), 200

@assets_bp.route('/', methods=['POST'], strict_slashes=False)
@jwt_required()
def create_asset():
    try:
        data = request.get_json()
        # current_app.logger.info(f"Creating asset with data: {data}") 
        
        if not data:
             return jsonify({'message': 'No input data provided'}), 400

        # Basic Validation
        required_fields = ['name', 'type', 'location']
        missing_fields = [field for field in required_fields if not data.get(field)]
        
        if missing_fields:
            return jsonify({'message': f'Missing required fields: {", ".join(missing_fields)}'}), 400

        new_asset = services.create_new_asset(data)
        return jsonify(new_asset.to_dict()), 201
        
    except ValueError as e:
        # Capture business logic errors (e.g. invalid status)
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        # current_app.logger.error(f"Error creating asset: {str(e)}")
        return jsonify({'message': 'Internal Server Error'}), 500

@assets_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_asset(id):
    asset = services.get_asset_by_id(id)
    return jsonify(asset.to_dict()), 200

@assets_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_asset(id):
    data = request.get_json()
    asset = services.update_existing_asset(id, data)
    return jsonify(asset.to_dict()), 200

@assets_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_asset(id):
    services.delete_existing_asset(id)
    return jsonify({'message': 'Asset deleted'}), 200
