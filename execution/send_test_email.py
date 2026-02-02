import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("BREVO_API_KEY")
sender_email = os.getenv("BREVO_SENDER_EMAIL")
# The user's email from the prompt/history seems to be evansmakaz@gmail.com
recipient_email = "evansmakaz@gmail.com" 

if not api_key:
    print("ERROR: BREVO_API_KEY not found in .env")
    exit(1)

headers = {
    "accept": "application/json",
    "api-key": api_key,
    "content-type": "application/json"
}

payload = {
    "sender": {"name": "Zeniac Test", "email": sender_email},
    "to": [{"email": recipient_email, "name": "User"}],
    "subject": "Zeniac Verification: Email Delivery Test",
    "htmlContent":f"""
    <html>
      <body>
        <h1>Email Delivery Verification</h1>
        <p>This is a direct test from the Zeniac system using <b>{sender_email}</b> as the verified sender.</p>
        <p>If you receive this, the SMTP relay is working correctly.</p>
        <p>Time sent: 2026-02-02 19:40</p>
      </body>
    </html>
    """
}

print(f"Sending test email from {sender_email} to {recipient_email}...")

try:
    response = requests.post("https://api.brevo.com/v3/smtp/email", headers=headers, json=payload)
    if response.status_code == 201 or response.status_code == 200:
        print(f"SUCCESS! Email sent. ID: {response.json().get('messageId')}")
    else:
        print(f"FAILED: {response.status_code} - {response.text}")
except Exception as e:
    print(f"ERROR: {e}")
