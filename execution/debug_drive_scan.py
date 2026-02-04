import os
import json
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

SCOPES = ["https://www.googleapis.com/auth/drive"]
VISUAL_IDENTITY_ID = "1imRV5zug3IlVkkKNhOm8K6pZYbpvaY2A"

def debug_scan(folder_id):
    if not os.path.exists('token.json'):
        return
    with open('token.json', 'r') as token:
        creds = Credentials.from_authorized_user_info(json.load(token), SCOPES)
    service = build('drive', 'v3', credentials=creds)
    
    print(f"Scanning folder {folder_id}...")
    results = service.files().list(
        q=f"'{folder_id}' in parents and trashed = false",
        fields="files(id, name, mimeType)"
    ).execute()
    
    files = results.get('files', [])
    for f in files:
        print(f"- {f['name']} ({f['mimeType']})")

if __name__ == "__main__":
    debug_scan(VISUAL_IDENTITY_ID)
