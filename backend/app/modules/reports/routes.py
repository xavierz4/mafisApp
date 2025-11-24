from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.modules.reports.models import Report
from app.modules.assets.models import Asset

reports_bp = Blueprint('reports', __name__)

@reports_bp.route('/', methods=['GET'], strict_slashes=False)
@jwt_required()
def get_reports():
    status_filter = request.args.get('status')
    query = Report.query
    
    if status_filter:
        query = query.filter_by(status=status_filter)
        
    reports = query.order_by(Report.created_at.desc()).all()
    return jsonify([report.to_dict() for report in reports]), 200

@reports_bp.route('/', methods=['POST'], strict_slashes=False)
@jwt_required()
def create_report():
    current_user_id = int(get_jwt_identity())  # Convert string to int
    data = request.get_json()
    
    # Validate Asset exists
    asset = Asset.query.get(data.get('asset_id'))
    if not asset:
        return jsonify({'message': 'Asset not found'}), 404
        
    new_report = Report(
        asset_id=data.get('asset_id'),
        requester_id=current_user_id,
        description=data.get('description'),
        priority=data.get('priority', 'MEDIUM'),
        evidence_url=data.get('evidence_url')
    )
    
    db.session.add(new_report)
    db.session.commit()
    
    return jsonify(new_report.to_dict()), 201

@reports_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_report(id):
    report = Report.query.get_or_404(id)
    return jsonify(report.to_dict()), 200

@reports_bp.route('/<int:id>/status', methods=['PATCH'])
@jwt_required()
def update_report_status(id):
    report = Report.query.get_or_404(id)
    data = request.get_json()
    
    new_status = data.get('status')
    if new_status:
        report.status = new_status
        db.session.commit()
        
    return jsonify(report.to_dict()), 200
