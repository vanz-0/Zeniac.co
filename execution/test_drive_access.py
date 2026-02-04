import os
import json
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

# Standard Scopes for Drive
SCOPES = ["https://www.googleapis.com/auth/drive"]

CORRECT_FOLDER_ID = "1GJr4Nfd8oovaEvmo_bSkYznRaY9GAQUn"

def list_folder_contents(folder_id):
    if not os.path.exists('token.json'):
        print("token.json not found")
        return
        
    with open('token.json', 'r') as token:
        creds = Credentials.from_authorized_user_info(json.load(token), SCOPES)
        
    service = build('drive', 'v3', credentials=creds)

    print(f"Listing subfolders of Zeniac.Co ({folder_id})...")
    try:
        results = service.files().list(
            q=f"'{folder_id}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false",
            fields="files(id, name)"
        ).execute()
        
        items = results.get('files', [])

        if not items:
            print('No subfolders found.')
        else:
            print('Subfolders found:')
            for item in items:
                print(f"- {item['name']} (ID: {item['id']})")
                
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    list_folder_contents(CORRECT_FOLDER_ID)
