from app.extensions import db
from datetime import datetime


class Report(db.Model):
    __tablename__ = 'reports'

    id = db.Column(db.Integer, primary_key=True)
    asset_id = db.Column(db.Integer, db.ForeignKey('assets.id'), nullable=False)
    requester_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    description = db.Column(db.Text, nullable=False)
    priority = db.Column(db.String(20), default='MEDIA') # ALTA, MEDIA, BAJA
    status = db.Column(db.String(20), default='ABIERTO') # ABIERTO, EN PROGRESO, RESUELTO, CERRADO
    evidence_url = db.Column(db.String(255), nullable=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    asset = db.relationship('Asset', backref=db.backref('reports', lazy=True))
    requester = db.relationship('User', backref=db.backref('reports', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'asset_id': self.asset_id,
            'asset_name': self.asset.name if self.asset else None,
            'requester_id': self.requester_id,
            'requester_name': self.requester.name if self.requester else None,
            'description': self.description,
            'priority': self.priority,
            'status': self.status,
            'evidence_url': self.evidence_url,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
