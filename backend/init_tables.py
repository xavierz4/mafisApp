from app import create_app, db
from app import create_app, db
from app.modules.users.models import User
from app.modules.assets.models import Asset
from app.modules.reports.models import Report
from app.modules.work_orders.models import WorkOrder

app = create_app()

with app.app_context():
    print("Creating tables...")
    db.create_all()
    print("Tables created successfully.")
    
    # Create admin user if not exists
    if not User.query.filter_by(email='admin@mafis.com').first():
        print("Creating admin user...")
        admin = User(
            email='admin@mafis.com',
            name='Admin User',
            role='admin'
        )
        admin.set_password('admin123')
        db.session.add(admin)
        db.session.commit()
        print("Admin user created.")
