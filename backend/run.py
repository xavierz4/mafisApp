import os
from dotenv import load_dotenv

# Load .env explicitly before creating app
load_dotenv()

from app import create_app

app = create_app()

if __name__ == '__main__':
    if not os.environ.get('JWT_SECRET_KEY'):
        print("CRITICAL ERROR: JWT_SECRET_KEY not found in environment variables.")
        print("Please ensure .env file exists and contains JWT_SECRET_KEY.")
        exit(1)
    app.run(host='0.0.0.0', port=5000)
