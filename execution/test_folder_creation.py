import modal
import os
import json
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("test-folder")

# Define Modal Stub
app = modal.App("test-folder")

# Secrets
ALL_SECRETS = [
    modal.Secret.from_name("google-service-account"),
]

image = (
    modal.Image.debian_slim(python_version="3.11")
    .pip_install(
        "google-auth",
        "google-auth-oauthlib",
        "google-api-python-client"
    )
)

@app.function(image=image, secrets=ALL_SECRETS)
def test_vault_logic():
    from google.oauth2 import service_account
    from googleapiclient.discovery import build
    
    print("📂 Testing _ZeniacVault Folder Logic...")

    # 1. Load Creds
    creds_json = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON")
    creds_dict = json.loads(creds_json)
    creds = service_account.Credentials.from_service_account_info(
        creds_dict,
        scopes=['https://www.googleapis.com/auth/drive']
    )
    drive_service = build('drive', 'v3', credentials=creds)

    # 2. Ensure _ZeniacVault exists
    folder_name = "_ZeniacVault"
    query = f"mimeType='application/vnd.google-apps.folder' and name='{folder_name}' and trashed=false"
    results = drive_service.files().list(q=query, fields="files(id, name)").execute()
    folders = results.get('files', [])
    
    if not folders:
        print(f"🔹 Folder '{folder_name}' not found. Creating...")
        folder_metadata = {
            'name': folder_name,
            'mimeType': 'application/vnd.google-apps.folder'
        }
        folder = drive_service.files().create(body=folder_metadata, fields='id').execute()
        folder_id = folder.get('id')
        print(f"✅ Created folder: {folder_id}")
    else:
        folder_id = folders[0].get('id')
        print(f"✅ Found existing folder: {folder_id}")

    # 3. Create a Test File
    print("🔹 Creating test file...")
    file_metadata = {'name': 'Vault Test File.txt'}
    file = drive_service.files().create(body=file_metadata, fields='id').execute()
    file_id = file.get('id')
    print(f"✅ Created file: {file_id}")

    # 4. Move to Folder
    print(f"🔹 Moving file {file_id} to folder {folder_id}...")
    file = drive_service.files().get(fileId=file_id, fields='parents').execute()
    previous_parents = ",".join(file.get('parents'))
    drive_service.files().update(fileId=file_id, addParents=folder_id, removeParents=previous_parents).execute()
    print("✅ Move successful!")

    # 5. Cleanup
    print("🔹 Cleaning up...")
    drive_service.files().delete(fileId=file_id).execute()
    print("✅ Deleted test file.")
    # Optional: Delete folder if created (commented out to preserve for user)
    # drive_service.files().delete(fileId=folder_id).execute()

if __name__ == "__main__":
    with app.run():
        test_vault_logic.remote()
