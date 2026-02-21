import modal
import os
import json
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("debug-docs")

# Define Modal Stub
app = modal.App("debug-docs")

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
def check_permissions():
    from google.oauth2 import service_account
    from googleapiclient.discovery import build
    from googleapiclient.errors import HttpError

    print("🔍 Checking Google Docs/Drive Permissions...")

    # 1. Load Service Account
    creds_json = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON")
    if not creds_json:
        print("❌ GOOGLE_SERVICE_ACCOUNT_JSON not found in environment")
        return

    try:
        creds_dict = json.loads(creds_json)
        print(f"✅ Loaded Service Account: {creds_dict.get('client_email', 'Unknown')}")
        
        creds = service_account.Credentials.from_service_account_info(
            creds_dict,
            scopes=['https://www.googleapis.com/auth/documents', 'https://www.googleapis.com/auth/drive']
        )
        
        # 2. Check Drive List Access
        print("\n📂 Testing Drive API (List Files)...")
        try:
            drive_service = build('drive', 'v3', credentials=creds)
            results = drive_service.files().list(pageSize=5, fields="nextPageToken, files(id, name)").execute()
            items = results.get('files', [])
            print(f"✅ Drive List Success! Found {len(items)} files.")
            for item in items:
                print(f"   - {item['name']} ({item['id']})")
        except HttpError as e:
            print(f"❌ Drive API Error: {e}")

        # 2.5 Check Drive Create Access (Text File)
        print("\n📂 Testing Drive API (Create Text File)...")
        try:
            file_metadata = {'name': 'Debug Drive Permission Test.txt'}
            media = build('drive', 'v3', credentials=creds).files().create(
                body=file_metadata,
                media_body=None,
                fields='id'
            ).execute()
            print(f"✅ Drive Create Success! File ID: {media.get('id')}")
            
            # Cleanup
            print("Cleaning up (deleting test file)...")
            drive_service.files().delete(fileId=media.get('id')).execute()
            print("✅ Cleanup complete.")
        except HttpError as e:
            print(f"❌ Drive Create Error: {e}")
            print("👉 DIAGNOSIS: Service account cannot create ANY files. Check IAM roles (needs Editor).")

        # 3. Check Docs Create Access
        print("\n📝 Testing Docs API (Create Document)...")
        try:
            docs_service = build('docs', 'v1', credentials=creds)
            title = "Debug Docs Permission Test"
            doc = docs_service.documents().create(body={'title': title}).execute()
            print(f"✅ Docs Create Success! Doc ID: {doc.get('documentId')}")
            
            # Cleanup
            print("Cleaning up (deleting test doc)...")
            drive_service.files().delete(fileId=doc.get('documentId')).execute()
            print("✅ Cleanup complete.")
            
        except HttpError as e:
            print(f"❌ Docs API Error: {e}")
            if "The caller does not have permission" in str(e):
                print("👉 DIAGNOSIS: The Google Docs API is likely NOT ENABLED for this project.")
                print(f"   Go to: https://console.cloud.google.com/apis/library/docs.googleapis.com?project={creds_dict.get('project_id')}")

    except Exception as e:
        print(f"❌ Unexpected Error: {e}")

if __name__ == "__main__":
    with app.run():
        check_permissions.remote()
