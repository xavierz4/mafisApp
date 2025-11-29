"""
Web Push Notification Service
Handles sending push notifications using VAPID
"""
import os
import json
from pywebpush import webpush, WebPushException
from flask import current_app

def send_web_push(subscription_info, message_body, title="MAFIS"):
    """
    Send a web push notification
    
    Args:
        subscription_info: Dict with endpoint, p256dh, and auth keys
        message_body: String message to send
        title: Notification title
    """
    vapid_private_key = os.environ.get('VAPID_PRIVATE_KEY')
    vapid_claim_email = os.environ.get('VAPID_CLAIM_EMAIL', 'mailto:admin@mafis.sena.edu.co')
    
    if not vapid_private_key:
        current_app.logger.warning("[WEB PUSH MOCK] No VAPID keys configured")
        print(f"⚠️ [WEB PUSH MOCK] Would send: {title} - {message_body}")
        return
    
    try:
        # Prepare notification payload
        payload = json.dumps({
            'title': title,
            'body': message_body,
            'icon': '/pwa-192x192.png',
            'badge': '/pwa-192x192.png',
            'vibrate': [200, 100, 200],
            'data': {
                'url': '/'
            }
        })
        
        # Send push notification
        webpush(
            subscription_info=subscription_info,
            data=payload,
            vapid_private_key=vapid_private_key,
            vapid_claims={"sub": vapid_claim_email}
        )
        
        current_app.logger.info(f"Web Push sent successfully to {subscription_info.get('endpoint', 'unknown')[:50]}...")
        
    except WebPushException as e:
        current_app.logger.error(f"Web Push failed: {e}")
        # If subscription is expired/invalid, we should remove it from DB
        if e.response and e.response.status_code in [404, 410]:
            current_app.logger.warning(f"Subscription expired/invalid: {subscription_info.get('endpoint', 'unknown')[:50]}...")
    except Exception as e:
        current_app.logger.error(f"Unexpected error sending Web Push: {e}")

def send_push_to_user(user, message, title="MAFIS"):
    """
    Send push notification to all subscriptions of a user
    
    Args:
        user: User model instance
        message: Message body
        title: Notification title
    """
    from app.modules.push.models import PushSubscription
    
    subscriptions = PushSubscription.query.filter_by(user_id=user.id).all()
    
    if not subscriptions:
        current_app.logger.info(f"No push subscriptions for user {user.id}")
        return
        
    # Check preferences
    if not getattr(user, 'notify_push', True):
        current_app.logger.info(f"User {user.id} has disabled push notifications")
        return
    
    for subscription in subscriptions:
        send_web_push(subscription.to_dict(), message, title)

def send_push_to_users(users, message, title="MAFIS"):
    """
    Send push notification to multiple users
    
    Args:
        users: List of User model instances
        message: Message body
        title: Notification title
    """
    for user in users:
        send_push_to_user(user, message, title)
