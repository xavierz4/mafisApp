import requests

# Test complete flow
print("="*60)
print("TESTING COMPLETE AUTH FLOW")
print("="*60)

# 1. Login
print("\n1. Testing LOGIN...")
login_response = requests.post(
    "http://localhost:5000/api/auth/login",
    json={"email": "admin@mafis.com", "password": "admin123"}
)
print(f"   Status: {login_response.status_code}")

if login_response.status_code == 200:
    data = login_response.json()
    token = data.get('access_token')
    print(f"   Token received: {token[:50]}...")
    print(f"   User: {data.get('user', {}).get('email')}")
    
    # 2. Test /me endpoint
    print("\n2. Testing /ME endpoint...")
    me_response = requests.get(
        "http://localhost:5000/api/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    print(f"   Status: {me_response.status_code}")
    if me_response.status_code == 200:
        print(f"   User from /me: {me_response.json().get('email')}")
    else:
        print(f"   Error: {me_response.text}")
    
    # 3. Test /assets endpoint
    print("\n3. Testing /ASSETS endpoint...")
    assets_response = requests.get(
        "http://localhost:5000/api/assets",
        headers={"Authorization": f"Bearer {token}"}
    )
    print(f"   Status: {assets_response.status_code}")
    if assets_response.status_code != 200:
        print(f"   Error: {assets_response.text}")
    else:
        print(f"   SUCCESS! Assets: {len(assets_response.json())} items")
        
    # 4. Test /reports endpoint
    print("\n4. Testing /REPORTS endpoint...")
    reports_response = requests.get(
        "http://localhost:5000/api/reports",
        headers={"Authorization": f"Bearer {token}"}
    )
    print(f"   Status: {reports_response.status_code}")
    if reports_response.status_code != 200:
        print(f"   Error: {reports_response.text}")
    else:
        print(f"   SUCCESS! Reports: {len(reports_response.json())} items")
else:
    print(f"   Login failed: {login_response.text}")

print("\n" + "="*60)
