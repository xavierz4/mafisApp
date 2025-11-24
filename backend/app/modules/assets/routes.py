from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.modules.assets.models import Asset

assets_bp = Blueprint('assets', __name__)

@assets_bp.route('/', methods=['GET'], strict_slashes=False)
@jwt_required()
def get_assets():
    print("DEBUG: get_assets called")
    type_filter = request.args.get('type')
    query = Asset.query
    
    if type_filter:
        query = query.filter_by(type=type_filter)
        
    assets = query.all()
    return jsonify([asset.to_dict() for asset in assets]), 200

@assets_bp.route('/', methods=['POST'], strict_slashes=False)
@jwt_required()
def create_asset():
    try:
        data = request.get_json()
        print(f"DEBUG: create_asset payload: {data}") # Debug print
        
        if not data:
             return jsonify({'message': 'No input data provided'}), 400

        new_asset = Asset(
            name=data.get('name'),
            description=data.get('description'),
            type=data.get('type'),
            location=data.get('location'),
            serial_number=data.get('serial_number'),
            status=data.get('status', 'OPERATIONAL'),
            criticality=data.get('criticality', 'MEDIUM')
        )
        
        db.session.add(new_asset)
        db.session.commit()
        
        return jsonify(new_asset.to_dict()), 201
    except Exception as e:
        print(f"ERROR: create_asset failed: {str(e)}")
        db.session.rollback()
        return jsonify({'message': f'Error creating asset: {str(e)}'}), 500

@assets_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_asset(id):
    asset = Asset.query.get_or_404(id)
    return jsonify(asset.to_dict()), 200

@assets_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_asset(id):
    asset = Asset.query.get_or_404(id)
    data = request.get_json()
    
    asset.name = data.get('name', asset.name)
    asset.description = data.get('description', asset.description)
    asset.type = data.get('type', asset.type)
    asset.location = data.get('location', asset.location)
    asset.serial_number = data.get('serial_number', asset.serial_number)
    asset.status = data.get('status', asset.status)
    asset.criticality = data.get('criticality', asset.criticality)
    
    db.session.commit()
    return jsonify(asset.to_dict()), 200

@assets_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_asset(id):
    asset = Asset.query.get_or_404(id)
    db.session.delete(asset)
    db.session.commit()
    return jsonify({'message': 'Asset deleted'}), 200
