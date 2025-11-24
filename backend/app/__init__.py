import os
from flask import Flask, jsonify, request
from .config import config
from .extensions import db, jwt, cors, migrate

def create_app(config_name=None):
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'default')
    
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Initialize Extensions
    db.init_app(app)
    jwt.init_app(app)
    
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({"message": "Token has expired", "error": "token_expired"}), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({"message": "Signature verification failed", "error": "invalid_token"}), 401

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({"message": "Request does not contain an access token", "error": "authorization_required"}), 401
    
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})
    migrate.init_app(app, db)
    
    # Register Blueprints
    from .modules.auth.routes import auth_bp
    from .modules.assets.routes import assets_bp
    from .modules.reports.routes import reports_bp
    from .modules.work_orders.routes import work_orders_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(assets_bp, url_prefix='/api/assets')
    app.register_blueprint(reports_bp, url_prefix='/api/reports')
    app.register_blueprint(work_orders_bp, url_prefix='/api/work-orders')

    @app.route('/api/health')
    def health():
        return jsonify({"status": "healthy", "app": "MAFIS_MVP"})
        
    return app
