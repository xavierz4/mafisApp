from app.extensions import db
from app.modules.reports.models import Report
from app.modules.assets.models import Asset
from app.common.validators import validate_priority, validate_report_status


def get_all_reports(status=None):
    query = Report.query
    if status:
        query = query.filter_by(status=status)
    return query.order_by(Report.created_at.desc()).all()


def get_report_by_id(report_id):
    return Report.query.get_or_404(report_id)


def create_report(data, user_id):
    # Validate required fields
    required_fields = ['asset_id', 'description']
    missing = [f for f in required_fields if not data.get(f)]
    if missing:
        raise ValueError(f'Missing required fields: {", ".join(missing)}')
    
    # Validate Asset exists
    asset = Asset.query.get(data.get('asset_id'))
    if not asset:
        raise ValueError('Asset not found')
    
    # Validate priority if provided
    priority = data.get('priority', 'MEDIUM')
    try:
        priority = validate_priority(priority)
    except ValueError as e:
        raise ValueError(str(e))
    
    new_report = Report(
        asset_id=data.get('asset_id'),
        requester_id=user_id,
        description=data.get('description'),
        priority=priority,
        evidence_url=data.get('evidence_url')
    )
    
    db.session.add(new_report)
    db.session.commit()
    
    # Send email notification to admins
    try:
        from app.common.email_service import send_new_report_notification
        from app.modules.users.models import User
        requester = User.query.get(user_id)
        send_new_report_notification(new_report, requester)
    except Exception as e:
        # Don't block if email fails
        print(f"Failed to send email notification: {e}")
        
    return new_report


def update_report(report_id, data):
    report = Report.query.get_or_404(report_id)
    
    if 'description' in data:
        report.description = data['description']
    if 'priority' in data:
        report.priority = validate_priority(data['priority'])
    if 'status' in data:
        report.status = validate_report_status(data['status'])
        
    db.session.commit()
    return report


def delete_report(report_id):
    report = Report.query.get_or_404(report_id)
    
    # Check if report has an associated work order explicitly
    from app.modules.work_orders.models import WorkOrder
    existing_wo = WorkOrder.query.filter_by(report_id=report_id).first()
    
    if existing_wo:
        raise ValueError("No se puede eliminar el reporte porque tiene una Orden de Trabajo asociada.")
        
    db.session.delete(report)
    db.session.commit()
    return True
