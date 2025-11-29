from app.extensions import db
from datetime import datetime

class WorkOrder(db.Model):
    __tablename__ = 'work_orders'

    id = db.Column(db.Integer, primary_key=True)
    report_id = db.Column(db.Integer, db.ForeignKey('reports.id'), nullable=False)
    technician_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    
    status = db.Column(db.String(20), default='ABIERTO') # ABIERTO, ASIGNADO, EN PROGRESO, COMPLETADO, CERRADO
    scheduled_date = db.Column(db.DateTime, nullable=True)
    completion_date = db.Column(db.DateTime, nullable=True)
    notes = db.Column(db.Text, nullable=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    report = db.relationship('Report', backref=db.backref('work_order', uselist=False))
    technician = db.relationship('User', backref=db.backref('work_orders', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'report_id': self.report_id,
            'report_description': self.report.description if self.report else None,
            'technician_id': self.technician_id,
            'technician_name': self.technician.name if self.technician else None,
            'status': self.status,
            'scheduled_date': self.scheduled_date.isoformat() if self.scheduled_date else None,
            'completion_date': self.completion_date.isoformat() if self.completion_date else None,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
