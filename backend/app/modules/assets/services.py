from app.extensions import db
from app.modules.assets.models import Asset

def get_all_assets(type_filter=None):
    query = Asset.query
    if type_filter:
        query = query.filter_by(type=type_filter)
    return query.all()

def get_asset_by_id(asset_id):
    return Asset.query.get_or_404(asset_id)

def create_new_asset(data):
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
    return new_asset

def update_existing_asset(asset_id, data):
    asset = Asset.query.get_or_404(asset_id)
    
    asset.name = data.get('name', asset.name)
    asset.description = data.get('description', asset.description)
    asset.type = data.get('type', asset.type)
    asset.location = data.get('location', asset.location)
    asset.serial_number = data.get('serial_number', asset.serial_number)
    asset.status = data.get('status', asset.status)
    asset.criticality = data.get('criticality', asset.criticality)
    
    db.session.commit()
    return asset

def delete_existing_asset(asset_id):
    asset = Asset.query.get_or_404(asset_id)
    db.session.delete(asset)
    db.session.commit()
    return True
