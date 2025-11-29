"""
Email notification service for MAFIS MVP
Handles sending emails for various events in the system
"""
from flask import current_app, render_template_string
from flask_mail import Message
from app.extensions import mail
from threading import Thread


def send_async_email(app, msg):
    """Send email asynchronously to avoid blocking the request"""
    with app.app_context():
        try:
            mail.send(msg)
        except Exception as e:
            current_app.logger.error(f'Failed to send email: {str(e)}')


def send_email(subject, recipients, text_body, html_body):
    """
    Send email with both text and HTML versions
    
    Args:
        subject: Email subject
        recipients: List of recipient email addresses
        text_body: Plain text version
        html_body: HTML version
    """
    msg = Message(
        subject=subject,
        recipients=recipients if isinstance(recipients, list) else [recipients],
        body=text_body,
        html=html_body
    )
    
    # Send asynchronously
    app = current_app._get_current_object()
    Thread(target=send_async_email, args=(app, msg)).start()


# ============================================
# EMAIL TEMPLATES
# ============================================

def get_email_base_template(content):
    """Base HTML template for all emails"""
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }}
            .container {{
                background-color: white;
                border-radius: 8px;
                padding: 30px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }}
            .header {{
                background: linear-gradient(135deg, #0066CC 0%, #00A651 100%);
                color: white;
                padding: 20px;
                border-radius: 8px 8px 0 0;
                text-align: center;
                margin: -30px -30px 20px -30px;
            }}
            .header h1 {{
                margin: 0;
                font-size: 24px;
            }}
            .content {{
                padding: 20px 0;
            }}
            .button {{
                display: inline-block;
                padding: 12px 24px;
                background-color: #00A651;
                color: white !important;
                text-decoration: none;
                border-radius: 4px;
                margin: 20px 0;
            }}
            .footer {{
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                color: #666;
                font-size: 12px;
            }}
            .info-box {{
                background-color: #f0f9ff;
                border-left: 4px solid #0066CC;
                padding: 15px;
                margin: 15px 0;
            }}
            .warning-box {{
                background-color: #fef9c3;
                border-left: 4px solid #f59e0b;
                padding: 15px;
                margin: 15px 0;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔧 MAFIS - SENA</h1>
                <p style="margin: 5px 0 0 0; font-size: 14px;">Sistema de Gestión de Activos y Mantenimiento</p>
            </div>
            <div class="content">
                {content}
            </div>
            <div class="footer">
                <p>Este es un correo automático, por favor no responder.</p>
                <p>© 2025 SENA - Centro de Formación. Todos los derechos reservados.</p>
            </div>
        </div>
    </body>
    </html>
    """


# ============================================
# NOTIFICATION FUNCTIONS
# ============================================

def send_new_report_notification(report, requester):
    """Notify admins when a new report is created"""
    from app.modules.users.models import User
    
    # Get all admin users who have email notifications enabled
    admins = User.query.filter_by(role='admin', is_active=True).all()
    admin_emails = [admin.email for admin in admins if getattr(admin, 'notify_email', True)]
    
    if not admin_emails:
        return
    
    content = f"""
        <h2>Nuevo Reporte de Falla</h2>
        <p>Se ha creado un nuevo reporte en el sistema:</p>
        
        <div class="info-box">
            <strong>ID del Reporte:</strong> #{report.id}<br>
            <strong>Activo:</strong> {report.asset.name if report.asset else 'N/A'}<br>
            <strong>Prioridad:</strong> <span style="color: {'#dc2626' if report.priority == 'HIGH' else '#f59e0b' if report.priority == 'MEDIUM' else '#6b7280'}">{report.priority}</span><br>
            <strong>Solicitante:</strong> {requester.name} ({requester.email})<br>
            <strong>Descripción:</strong> {report.description}
        </div>
        
        <p>Por favor, revise el reporte y asigne un técnico lo antes posible.</p>
        <a href="http://localhost:5173/dashboard/reports" class="button">Ver Reporte</a>
    """
    
    send_email(
        subject=f'[MAFIS] Nuevo Reporte #{report.id} - Prioridad {report.priority}',
        recipients=admin_emails,
        text_body=f'Nuevo reporte #{report.id} creado por {requester.name}. Descripción: {report.description}',
        html_body=get_email_base_template(content)
    )


def send_work_order_assigned_notification(work_order, technician):
    """Notify technician when a work order is assigned to them"""
    if not technician or not technician.email:
        return
        
    # Check preferences
    if not getattr(technician, 'notify_email', True):
        return
    
    content = f"""
        <h2>Nueva Orden de Trabajo Asignada</h2>
        <p>Hola <strong>{technician.name}</strong>,</p>
        <p>Se te ha asignado una nueva orden de trabajo:</p>
        
        <div class="info-box">
            <strong>ID de la Orden:</strong> #{work_order.id}<br>
            <strong>Reporte Relacionado:</strong> #{work_order.report_id}<br>
            <strong>Descripción:</strong> {work_order.report.description if work_order.report else 'N/A'}<br>
            <strong>Prioridad:</strong> {work_order.report.priority if work_order.report else 'N/A'}<br>
            <strong>Estado:</strong> {work_order.status}
        </div>
        
        {f'<div class="warning-box"><strong>Notas:</strong> {work_order.notes}</div>' if work_order.notes else ''}
        
        <p>Por favor, revisa la orden y actualiza su estado según el progreso.</p>
        <a href="http://localhost:5173/dashboard/work-orders" class="button">Ver Orden de Trabajo</a>
    """
    
    send_email(
        subject=f'[MAFIS] Nueva Orden de Trabajo #{work_order.id} Asignada',
        recipients=technician.email,
        text_body=f'Se te ha asignado la orden de trabajo #{work_order.id}. Descripción: {work_order.report.description if work_order.report else "N/A"}',
        html_body=get_email_base_template(content)
    )


def send_work_order_status_update_notification(work_order, requester):
    """Notify requester when work order status changes"""
    if not requester or not requester.email:
        return
        
    # Check preferences
    if not getattr(requester, 'notify_email', True):
        return
    
    status_messages = {
        'ASIGNADO': 'ha sido asignada a un técnico',
        'EN PROGRESO': 'está en progreso',
        'COMPLETADO': 'ha sido completada',
        'CERRADO': 'ha sido cerrada'
    }
    
    status_message = status_messages.get(work_order.status, 'ha sido actualizada')
    
    content = f"""
        <h2>Actualización de Orden de Trabajo</h2>
        <p>Hola <strong>{requester.name}</strong>,</p>
        <p>Tu orden de trabajo <strong>{status_message}</strong>:</p>
        
        <div class="info-box">
            <strong>ID de la Orden:</strong> #{work_order.id}<br>
            <strong>Reporte:</strong> #{work_order.report_id}<br>
            <strong>Nuevo Estado:</strong> <span style="color: #00A651">{work_order.status}</span><br>
            {f'<strong>Técnico Asignado:</strong> {work_order.technician.name}<br>' if work_order.technician else ''}
            {f'<strong>Fecha de Completación:</strong> {work_order.completion_date.strftime("%d/%m/%Y %H:%M")}<br>' if work_order.completion_date else ''}
        </div>
        
        <p>Puedes revisar el estado completo de tu solicitud en el sistema.</p>
        <a href="http://localhost:5173/dashboard/reports" class="button">Ver Mis Reportes</a>
    """
    
    send_email(
        subject=f'[MAFIS] Actualización: Orden #{work_order.id} - {work_order.status}',
        recipients=requester.email,
        text_body=f'Tu orden de trabajo #{work_order.id} {status_message}.',
        html_body=get_email_base_template(content)
    )


def send_welcome_email(user, temp_password=None):
    """Send welcome email to new user"""
    if not user or not user.email:
        return
    
    content = f"""
        <h2>Bienvenido a MAFIS</h2>
        <p>Hola <strong>{user.name}</strong>,</p>
        <p>Tu cuenta ha sido creada exitosamente en el Sistema de Gestión de Activos y Mantenimiento (MAFIS).</p>
        
        <div class="info-box">
            <strong>Email:</strong> {user.email}<br>
            <strong>Rol:</strong> {user.role.upper()}<br>
            {f'<strong>Contraseña Temporal:</strong> {temp_password}<br>' if temp_password else ''}
        </div>
        
        {f'<div class="warning-box"><strong>Importante:</strong> Por seguridad, te recomendamos cambiar tu contraseña temporal al iniciar sesión por primera vez.</div>' if temp_password else ''}
        
        <p>Puedes acceder al sistema usando tus credenciales.</p>
        <a href="http://localhost:5173/login" class="button">Iniciar Sesión</a>
        
        <h3>¿Qué puedes hacer en MAFIS?</h3>
        <ul>
            <li>Reportar fallas en activos</li>
            <li>Dar seguimiento a tus solicitudes</li>
            <li>Ver el estado de las órdenes de trabajo</li>
            {f'<li>Gestionar activos y usuarios (Admin)</li>' if user.role == 'admin' else ''}
        </ul>
    """
    
    send_email(
        subject='[MAFIS] Bienvenido al Sistema de Gestión de Activos',
        recipients=user.email,
        text_body=f'Bienvenido a MAFIS, {user.name}. Tu cuenta ha sido creada con el rol de {user.role}.',
        html_body=get_email_base_template(content)
    )
