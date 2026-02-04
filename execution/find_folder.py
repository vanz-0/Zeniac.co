import os
import json
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

SCOPES = ["https://www.googleapis.com/auth/drive"]

def find_folder():
    if not os.path.exists('token.json'):
        print("token.json not found")
        return
        
    with open('token.json', 'r') as token:
        creds = Credentials.from_authorized_user_info(json.load(token), SCOPES)
        
    service = build('drive', 'v3', credentials=creds)
    
    print("Searching for folders named 'Zeniac.Co'...")
    results = service.files().list(
        q="mimeType = 'application/vnd.google-apps.folder' and name = 'Zeniac.Co' and trashed = false",
        fields="files(id, name)"
    ).execute()
    
    folders = results.get('files', [])
    if not folders:
        print("No folder named 'Zeniac.Co' found.")
        # Try listing ANY folders to see what's visible
        print("\nListing first 5 available folders:")
        results = service.files().list(
            q="mimeType = 'application/vnd.google-apps.folder' and trashed = false",
            pageSize=5,
            fields="files(id, name)"
        ).execute()
        for f in results.get('files', []):
            print(f"- {f['name']} ({f['id']})")
    else:
        for f in folders:
            print(f"Found: {f['name']} ({f['id']})")

if __name__ == "__main__":
    find_folder()
