import os
from flask import Flask, jsonify, request
from .config import config
from .extensions import db, jwt, cors, migrate, mail

def create_app(config_name=None):
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'default')
    
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Disable strict slashes to prevent redirects that break CORS preflight
    app.url_map.strict_slashes = False
    
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
    
    # CORS Configuration - Must be configured properly for preflight requests
    cors.init_app(app, 
        resources={
            r"/api/*": {
                "origins": "*",
                "methods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
                "allow_headers": ["Content-Type", "Authorization"],
                "expose_headers": ["Content-Type", "Authorization"],
                "supports_credentials": False,
                "max_age": 3600
            }
        }
    )
    migrate.init_app(app, db)
    mail.init_app(app)
    
    # Register Blueprints
    from .modules.auth.routes import auth_bp
    from .modules.assets.routes import assets_bp
    from .modules.reports.routes import reports_bp
    from .modules.work_orders.routes import work_orders_bp
    from .modules.users.routes import users_bp
    from .modules.push.routes import push_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(assets_bp, url_prefix='/api/assets')
    app.register_blueprint(reports_bp, url_prefix='/api/reports')
    app.register_blueprint(work_orders_bp, url_prefix='/api/work-orders')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(push_bp, url_prefix='/api/push')

    # Initialize SocketIO
    from .socket_extensions import socketio
    socketio.init_app(app)

    @app.route('/api/health')
    def health():
        return jsonify({"status": "healthy", "app": "MAFIS_MVP"})
        
    return app
