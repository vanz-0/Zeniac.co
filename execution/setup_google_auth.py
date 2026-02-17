from google_auth_oauthlib.flow import InstalledAppFlow
import json
import os

# Scopes needed for the application
SCOPES = [
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/documents',
    'https://www.googleapis.com/auth/drive'
]

def main():
    print("🔐 Starting Google OAuth Setup...")
    
    if not os.path.exists('credentials.json'):
        print("❌ Error: credentials.json not found in current directory!")
        print("   Please download it from Google Cloud Console (OAuth 2.0 Client IDs)")
        return

    flow = InstalledAppFlow.from_client_secrets_file(
        'credentials.json', SCOPES)
    
    print("\n🌐 Opening browser for authentication...")
    creds = flow.run_local_server(port=0)

    # Save the full token data as JSON
    token_data = {
        "token": creds.token,
        "refresh_token": creds.refresh_token,
        "token_uri": creds.token_uri,
        "client_id": creds.client_id,
        "client_secret": creds.client_secret,
        "scopes": creds.scopes
    }

    with open('token.json', 'w') as token_file:
        json.dump(token_data, token_file)

    print("\n✅ Success! token.json generated.")
    print("👉 Now upload this to Modal as secret 'google-oauth-token'")
    print(f"   Contents sample: {json.dumps(token_data)[:50]}...")

if __name__ == '__main__':
    main()
