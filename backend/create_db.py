import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

# Parse URI: mysql+pymysql://root:root@localhost/mafis_mvp_db
uri = os.environ.get('SQLALCHEMY_DATABASE_URI')
if not uri:
    print("No SQLALCHEMY_DATABASE_URI found")
    exit(1)

# Extract connection details (very basic parsing for this specific format)
# Assuming format: mysql+pymysql://user:pass@host/dbname
try:
    auth_part, db_part = uri.split('@')
    user_pass = auth_part.split('//')[1]
    user, password = user_pass.split(':')
    host_db = db_part.split('/')
    host = host_db[0]
    dbname = host_db[1]
except Exception as e:
    print(f"Error parsing URI: {e}")
    exit(1)

print(f"Connecting to {host} as {user} to create {dbname}...")

try:
    # Parse host and port
    if ':' in host:
        host, port = host.split(':')
        port = int(port)
    else:
        port = 3306

    conn = pymysql.connect(host=host, port=port, user=user, password=password)
    cursor = conn.cursor()
    cursor.execute(f"CREATE DATABASE IF NOT EXISTS {dbname}")
    print(f"Database {dbname} created successfully (or already exists).")
    cursor.close()
    conn.close()
except Exception as e:
    print(f"Error creating database: {e}")
