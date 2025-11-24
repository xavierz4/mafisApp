from app.extensions import db
from datetime import datetime

class Asset(db.Model):
    __tablename__ = 'assets'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    type = db.Column(db.String(50), nullable=False) # EQUIPMENT, LOCATIVE, SERVICE
    location = db.Column(db.String(100), nullable=True)
    serial_number = db.Column(db.String(100), nullable=True)
    status = db.Column(db.String(20), default='OPERATIONAL') # OPERATIONAL, DOWN, MAINTENANCE
    criticality = db.Column(db.String(20), default='MEDIUM') # HIGH, MEDIUM, LOW
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'type': self.type,
            'location': self.location,
            'serial_number': self.serial_number,
            'status': self.status,
            'criticality': self.criticality,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
