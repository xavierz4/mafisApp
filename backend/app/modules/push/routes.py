from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.modules.push.models import PushSubscription
import os

push_bp = Blueprint('push', __name__)

@push_bp.route('/vapid-public-key', methods=['GET'])
def get_vapid_public_key():
    """Get VAPID public key for frontend"""
    public_key = os.environ.get('VAPID_PUBLIC_KEY')
    if not public_key:
        return jsonify({'message': 'VAPID not configured'}), 503
    return jsonify({'publicKey': public_key}), 200

@push_bp.route('/subscribe', methods=['POST'])
@jwt_required()
def subscribe():
    """Subscribe user to push notifications"""
    user_id = int(get_jwt_identity())
    data = request.get_json()
    
    endpoint = data.get('endpoint')
    p256dh = data.get('keys', {}).get('p256dh')
    auth = data.get('keys', {}).get('auth')
    
    if not all([endpoint, p256dh, auth]):
        return jsonify({'message': 'Invalid subscription data'}), 400
    
    # Check if subscription already exists
    existing = PushSubscription.query.filter_by(endpoint=endpoint).first()
    if existing:
        # Update user_id if changed
        if existing.user_id != user_id:
            existing.user_id = user_id
            db.session.commit()
        return jsonify({'message': 'Subscription updated'}), 200
    
    # Create new subscription
    subscription = PushSubscription(
        user_id=user_id,
        endpoint=endpoint,
        p256dh=p256dh,
        auth=auth
    )
    
    db.session.add(subscription)
    db.session.commit()
    
    return jsonify({'message': 'Subscribed successfully'}), 201

@push_bp.route('/unsubscribe', methods=['POST'])
@jwt_required()
def unsubscribe():
    """Unsubscribe from push notifications"""
    user_id = int(get_jwt_identity())
    data = request.get_json()
    
    endpoint = data.get('endpoint')
    if not endpoint:
        return jsonify({'message': 'Endpoint required'}), 400
    
    subscription = PushSubscription.query.filter_by(
        endpoint=endpoint,
        user_id=user_id
    ).first()
    
    if subscription:
        db.session.delete(subscription)
        db.session.commit()
        return jsonify({'message': 'Unsubscribed successfully'}), 200
    
    return jsonify({'message': 'Subscription not found'}), 404
