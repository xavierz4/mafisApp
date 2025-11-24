from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.modules.work_orders.models import WorkOrder
from app.modules.reports.models import Report
from app.modules.users.models import User
from datetime import datetime

work_orders_bp = Blueprint('work_orders', __name__)

@work_orders_bp.route('/', methods=['GET'], strict_slashes=False)
@jwt_required()
def get_work_orders():
    status_filter = request.args.get('status')
    query = WorkOrder.query
    
    if status_filter:
        query = query.filter_by(status=status_filter)
        
    orders = query.order_by(WorkOrder.created_at.desc()).all()
    return jsonify([order.to_dict() for order in orders]), 200

@work_orders_bp.route('/', methods=['POST'], strict_slashes=False)
@jwt_required()
def create_work_order():
    data = request.get_json()
    
    # Validate Report exists
    report = Report.query.get(data.get('report_id'))
    if not report:
        return jsonify({'message': 'Report not found'}), 404
        
    # Check if WO already exists for this report
    if WorkOrder.query.filter_by(report_id=report.id).first():
        return jsonify({'message': 'Work Order already exists for this report'}), 400

    new_order = WorkOrder(
        report_id=data.get('report_id'),
        notes=data.get('notes'),
        status='OPEN'
    )
    
    # Auto-assign logic (Simple: Assign to first available technician if requested)
    if data.get('auto_assign'):
        technician = User.query.filter_by(role='technician').first()
        if technician:
            new_order.technician_id = technician.id
            new_order.status = 'ASSIGNED'
    elif data.get('technician_id'):
        new_order.technician_id = data.get('technician_id')
        new_order.status = 'ASSIGNED'
    
    db.session.add(new_order)
    
    # Update Report status
    report.status = 'IN_PROGRESS'
    
    db.session.commit()
    
    return jsonify(new_order.to_dict()), 201

@work_orders_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_work_order(id):
    order = WorkOrder.query.get_or_404(id)
    return jsonify(order.to_dict()), 200

@work_orders_bp.route('/<int:id>/assign', methods=['PATCH'])
@jwt_required()
def assign_technician(id):
    order = WorkOrder.query.get_or_404(id)
    data = request.get_json()
    
    technician_id = data.get('technician_id')
    technician = User.query.get(technician_id)
    
    if not technician or technician.role != 'technician':
        return jsonify({'message': 'Invalid technician'}), 400
        
    order.technician_id = technician_id
    order.status = 'ASSIGNED'
    db.session.commit()
    
    return jsonify(order.to_dict()), 200

@work_orders_bp.route('/<int:id>/status', methods=['PATCH'])
@jwt_required()
def update_status(id):
    order = WorkOrder.query.get_or_404(id)
    data = request.get_json()
    
    new_status = data.get('status')
    if new_status:
        order.status = new_status
        if new_status == 'COMPLETED':
            order.completion_date = datetime.utcnow()
            # Also update report status
            if order.report:
                order.report.status = 'RESOLVED'
                
        db.session.commit()
        
    return jsonify(order.to_dict()), 200
