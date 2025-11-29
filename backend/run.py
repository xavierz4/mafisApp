import os
from dotenv import load_dotenv

# Load .env explicitly before creating app
load_dotenv()

from app import create_app
from app.socket_extensions import socketio

app = create_app()

if __name__ == '__main__':
    if not os.environ.get('JWT_SECRET_KEY'):
        print("CRITICAL ERROR: JWT_SECRET_KEY not found in environment variables.")
        print("Please ensure .env file exists and contains JWT_SECRET_KEY.")
        exit(1)
    
    # Use environment variable for debug mode, default to False in production
    debug_mode = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    socketio.run(app, host='0.0.0.0', port=5000, debug=debug_mode)
