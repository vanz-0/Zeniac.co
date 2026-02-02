import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("BREVO_API_KEY")
sender_email = os.getenv("BREVO_SENDER_EMAIL")

if not api_key:
    print("ERROR: BREVO_API_KEY not found in .env")
    exit(1)

headers = {
    "accept": "application/json",
    "api-key": api_key
}

print(f"Checking Brevo Account for key: {api_key[:10]}...")

# 1. Check Account Info
try:
    response = requests.get("https://api.brevo.com/v3/account", headers=headers)
    if response.status_code == 200:
        account = response.json()
        print(f"Account: {account.get('email')} ({account.get('companyName')})")
        print(f"Plan: {account.get('plan')}")
    else:
        print(f"Failed to get account info: {response.status_code} - {response.text}")
except Exception as e:
    print(f"Error during account check: {e}")

# 2. Check Senders
print("\nChecking Verified Senders...")
try:
    response = requests.get("https://api.brevo.com/v3/senders", headers=headers)
    if response.status_code == 200:
        senders = response.json().get('senders', [])
        found_verified = False
        for s in senders:
            status = "Verified" if s.get('active') else "NOT Verified"
            print(f"- {s.get('email')} [{s.get('name')}] : {status}")
            if s.get('email') == sender_email and s.get('active'):
                found_verified = True
        
        if not found_verified:
            print(f"\nWARNING: The configured sender '{sender_email}' is NOT in the verified list or not active.")
    else:
        print(f"Failed to get senders: {response.status_code} - {response.text}")
except Exception as e:
    print(f"Error during senders check: {e}")
