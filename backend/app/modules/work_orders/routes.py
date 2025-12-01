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

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.socket_extensions import socketio
from app.modules.work_orders.models import WorkOrder
from app.modules.reports.models import Report
from app.modules.users.models import User
from app.common.validators import validate_work_order_status
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
        status='ABIERTO'
    )
    
    # Auto-assign logic
    if data.get('auto_assign'):
        technician = User.query.filter_by(role='technician').first()
        if technician:
            new_order.technician_id = technician.id
            new_order.status = 'ASIGNADO'
    elif data.get('technician_id'):
        new_order.technician_id = data.get('technician_id')
        new_order.status = 'ASIGNADO'
    
    db.session.add(new_order)
    
    # Update Report status
    report.status = 'EN PROGRESO'
    
    db.session.commit()
    
    # Notify Technician
    if new_order.technician_id:
        technician = User.query.get(new_order.technician_id)
        
        # SocketIO
        socketio.emit('notification', {
            'userId': new_order.technician_id,
            'message': f'Nueva orden de trabajo asignada: #{new_order.id}',
            'type': 'info'
        })
        
        # Email & WhatsApp & Web Push
        try:
            from app.common.email_service import send_work_order_assigned_notification
            from app.common.whatsapp_service import notify_technician_assignment
            from app.modules.push.service import send_push_to_user
            
            send_work_order_assigned_notification(new_order, technician)
            notify_technician_assignment(technician, new_order)
            send_push_to_user(technician, f'Nueva orden #{new_order.id} asignada', 'Orden Asignada')
        except Exception as e:
            print(f"Failed to send notifications: {e}")

    # Notify Requester (Report Assigned)
    if report.requester_id:
        try:
            from app.common.whatsapp_service import notify_status_update
            from app.common.email_service import send_work_order_status_update_notification
            from app.modules.push.service import send_push_to_user
            
            requester = User.query.get(report.requester_id)
            
            # SocketIO
            socketio.emit('notification', {
                'userId': requester.id,
                'message': f'Tu reporte #{report.id} ha sido asignado a un técnico.',
                'type': 'success'
            })
            
            # WhatsApp & Email & Web Push
            notify_status_update(requester, new_order)
            send_work_order_status_update_notification(new_order, requester)
            send_push_to_user(requester, f'Tu reporte #{report.id} ha sido asignado', 'Reporte Asignado')
            
        except Exception as e:
            print(f"Failed to notify requester: {e}")

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
    order.status = 'ASIGNADO'
    db.session.commit()
    
    # Notify Technician
    try:
        from app.common.email_service import send_work_order_assigned_notification
        from app.common.whatsapp_service import notify_technician_assignment
        from app.modules.push.service import send_push_to_user
        
        send_work_order_assigned_notification(order, technician)
        notify_technician_assignment(technician, order)
        send_push_to_user(technician, f'Orden #{order.id} reasignada', 'Orden Asignada')
    except Exception as e:
        print(f"Failed to send notifications: {e}")
        
    # Notify Requester (Report Assigned)
    if order.report and order.report.requester_id:
        try:
            from app.common.whatsapp_service import notify_status_update
            from app.common.email_service import send_work_order_status_update_notification
            from app.modules.push.service import send_push_to_user
            
            requester = User.query.get(order.report.requester_id)
            
            # SocketIO
            socketio.emit('notification', {
                'userId': requester.id,
                'message': f'Tu reporte #{order.report.id} ha sido asignado a un técnico.',
                'type': 'success'
            })
            
            # WhatsApp & Email & Web Push
            notify_status_update(requester, order)
            send_work_order_status_update_notification(order, requester)
            send_push_to_user(requester, f'Tu reporte #{order.report.id} ha sido asignado', 'Reporte Asignado')
            
        except Exception as e:
            print(f"Failed to notify requester: {e}")
    
    return jsonify(order.to_dict()), 200

@work_orders_bp.route('/<int:id>/status', methods=['PATCH'])
@jwt_required()
def update_status(id):
    order = WorkOrder.query.get_or_404(id)
    data = request.get_json()
    print(f"DEBUG: update_status called for id {id} with data {data}")
    
    # Get current user
    current_user_id = int(get_jwt_identity())
    current_user = User.query.get(current_user_id)
    
    # Only assigned technician or admin can update status
    if current_user.role != 'admin' and order.technician_id != current_user_id:
        return jsonify({'message': 'Only the assigned technician or admin can update this order'}), 403
    
    new_status = data.get('status')
    if not new_status:
        return jsonify({'message': 'Status is required'}), 400
    
    # Validate status
    try:
        new_status = validate_work_order_status(new_status)
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    
    order.status = new_status
    if new_status == 'COMPLETADO':
        order.completion_date = datetime.utcnow()
        # Also update report status
        if order.report:
            order.report.status = 'RESUELTO'
    
    print(f"DEBUG: Committing status change to {new_status}")
    db.session.commit()
        
    return jsonify(order.to_dict()), 200
