import os
from twilio.rest import Client
from flask import current_app

def send_whatsapp_message(to_number, body):
    """
    Send a WhatsApp message using Twilio API.
    
    Args:
        to_number (str): Recipient's phone number in E.164 format (e.g., +573001234567)
        body (str): Message content
    """
    account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
    auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
    from_number = os.environ.get('TWILIO_WHATSAPP_FROM', 'whatsapp:+14155238886') # Twilio Sandbox Default

    if not account_sid or not auth_token:
        current_app.logger.warning(f"[WHATSAPP MOCK] To: {to_number} | Body: {body}")
        print(f"⚠️ [WHATSAPP MOCK] Mensaje para {to_number}: {body}")
        return

    try:
        client = Client(account_sid, auth_token)
        
        # Ensure number has whatsapp: prefix
        if not to_number.startswith('whatsapp:'):
            to_number = f'whatsapp:{to_number}'

        message = client.messages.create(
            from_=from_number,
            body=body,
            to=to_number
        )
        current_app.logger.info(f"WhatsApp message sent: {message.sid}")
        
    except Exception as e:
        current_app.logger.error(f"Failed to send WhatsApp message: {str(e)}")
        print(f"❌ Error enviando WhatsApp: {str(e)}")

def notify_technician_assignment(technician, work_order):
    """Send WhatsApp notification to technician about new assignment"""
    if not technician.phone:
        return
        
    # Check preferences
    if not getattr(technician, 'notify_whatsapp', True):
        return

    message = (
        f"🔧 *Nueva Orden de Trabajo Asignada*\n\n"
        f"Hola {technician.name}, se te ha asignado la orden *#{work_order.id}*.\n"
        f"📝 *Reporte:* {work_order.report.description[:50]}...\n"
        f"🚨 *Prioridad:* {work_order.report.priority}\n"
        f"📅 *Fecha:* {work_order.created_at.strftime('%d/%m/%Y')}\n\n"
        f"Ingresa a la app para ver más detalles."
    )
    
    send_whatsapp_message(technician.phone, message)

def notify_status_update(requester, work_order):
    """Send WhatsApp notification to requester about status update"""
    if not requester.phone:
        return
        
    # Check preferences
    if not getattr(requester, 'notify_whatsapp', True):
        return

    status_emojis = {
        'ASIGNADO': '👨‍🔧',
        'EN PROGRESO': '⚙️',
        'COMPLETADO': '✅',
        'CERRADO': '🔒'
    }
    emoji = status_emojis.get(work_order.status, 'ℹ️')
    
    message = (
        f"{emoji} *Actualización de Orden #{work_order.id}*\n\n"
        f"Hola {requester.name}, tu solicitud ha cambiado a estado: *{work_order.status}*.\n\n"
        f"Gracias por usar MAFIS."
    )
    
    send_whatsapp_message(requester.phone, message)

def notify_new_report_to_admin(admin, report, requester):
    """Notify admin about a new report"""
    if not admin.phone:
        return
        
    # Check preferences
    if not getattr(admin, 'notify_whatsapp', True):
        return

    message = (
        f"📢 *Nuevo Reporte Registrado*\n\n"
        f"Hola {admin.name}, se ha creado el reporte *#{report.id}*.\n"
        f"👤 *Solicitante:* {requester.name}\n"
        f"🏢 *Activo:* {report.asset.name if report.asset else 'N/A'}\n"
        f"📝 *Descripción:* {report.description[:50]}...\n"
        f"🚨 *Prioridad:* {report.priority}\n\n"
        f"Por favor asigna un técnico."
    )
    
    send_whatsapp_message(admin.phone, message)

def notify_report_creation_confirmation(requester, report):
    """Confirm report creation to requester"""
    if not requester.phone:
        return
        
    # Check preferences
    if not getattr(requester, 'notify_whatsapp', True):
        return

    message = (
        f"✅ *Reporte Recibido*\n\n"
        f"Hola {requester.name}, hemos recibido tu reporte *#{report.id}*.\n"
        f"Estaremos atendiéndolo pronto.\n\n"
        f"Te notificaremos cuando un técnico sea asignado."
    )
    
    send_whatsapp_message(requester.phone, message)
