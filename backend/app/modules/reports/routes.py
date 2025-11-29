from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.modules.reports import services

reports_bp = Blueprint('reports', __name__)

@reports_bp.route('/', methods=['GET'], strict_slashes=False)
@jwt_required()
def get_reports():
    status_filter = request.args.get('status')
    reports = services.get_all_reports(status_filter)
    return jsonify([report.to_dict() for report in reports]), 200

@reports_bp.route('/', methods=['POST'], strict_slashes=False)
@jwt_required()
def create_report():
    try:
        current_user_id = int(get_jwt_identity())  # Convert string to int
        data = request.get_json()
        
        new_report = services.create_report(data, current_user_id)
        return jsonify(new_report.to_dict()), 201
    except ValueError as e:
        return jsonify({'message': str(e)}), 404
    except Exception as e:
        return jsonify({'message': f'Error creating report: {str(e)}'}), 500
    
    # Notifications Logic
    try:
        from app.modules.users.models import User
        from app.socket_extensions import socketio
        from app.common.email_service import send_new_report_notification
        from app.common.whatsapp_service import notify_new_report_to_admin, notify_report_creation_confirmation
        from app.modules.push.service import send_push_to_users, send_push_to_user
        
        requester = User.query.get(current_user_id)
        admins = User.query.filter_by(role='admin').all()
        
        # 1. Notify Requester (Confirmation)
        notify_report_creation_confirmation(requester, new_report)
        send_push_to_user(requester, f'Reporte #{new_report.id} recibido. Te notificaremos cuando sea asignado.', 'Reporte Creado')
        
        # 2. Notify Admins
        for admin in admins:
            # SocketIO (Push In-App)
            socketio.emit('notification', {
                'userId': admin.id,
                'message': f'Nuevo reporte #{new_report.id} creado por {requester.name}',
                'type': 'warning'
            })
            
            # WhatsApp
            notify_new_report_to_admin(admin, new_report, requester)
            
        # Email (Already handles multiple admins inside)
        send_new_report_notification(new_report, requester)
        
        # Web Push to all admins
        send_push_to_users(admins, f'Nuevo reporte #{new_report.id} - Prioridad {new_report.priority}', 'Nuevo Reporte')
            
    except Exception as e:
        print(f"Failed to send notifications: {e}")

    return jsonify(new_report.to_dict()), 201

@reports_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_report(id):
    report = services.get_report_by_id(id)
    return jsonify(report.to_dict()), 200

@reports_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_report(id):
    data = request.get_json()
    report = services.update_report(id, data)
    return jsonify(report.to_dict()), 200

@reports_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_report(id):
    services.delete_report(id)
    return jsonify({'message': 'Report deleted'}), 200

@reports_bp.route('/<int:id>/status', methods=['PATCH'])
@jwt_required()
def update_report_status(id):
    data = request.get_json()
    new_status = data.get('status')
    
    if new_status:
        report = services.update_report(id, {'status': new_status})
        return jsonify(report.to_dict()), 200
    
    return jsonify({'message': 'Status is required'}), 400
