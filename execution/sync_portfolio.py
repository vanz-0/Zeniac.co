import os
import json
import io
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
from PIL import Image

# Configuration
SCOPES = ["https://www.googleapis.com/auth/drive"]
ROOT_FOLDER_ID = "1GJr4Nfd8oovaEvmo_bSkYznRaY9GAQUn"
PORTFOLIO_JSON_PATH = os.path.join("src", "data", "portfolio.json")
PUBLIC_IMAGES_DIR = os.path.join("public", "images", "portfolio")

def get_drive_service():
    if not os.path.exists('token.json'):
        raise FileNotFoundError("token.json not found. Run setup_google_auth.py")
    with open('token.json', 'r') as token:
        creds = Credentials.from_authorized_user_info(json.load(token), SCOPES)
    return build('drive', 'v3', credentials=creds)

def download_file(service, file_id, file_name, destination_path):
    print(f"Downloading {file_name}...")
    request = service.files().get_media(fileId=file_id)
    fh = io.BytesIO()
    downloader = MediaIoBaseDownload(fh, request)
    done = False
    while done is False:
        status, done = downloader.next_chunk()
    fh.seek(0)
    with open(destination_path, 'wb') as f:
        f.write(fh.read())

def sync():
    service = get_drive_service()
    
    # Ensure images dir exists
    os.makedirs(PUBLIC_IMAGES_DIR, exist_ok=True)
    
    # 1. List all Service Folders
    results = service.files().list(
        q=f"'{ROOT_FOLDER_ID}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false",
        fields="files(id, name)"
    ).execute()
    
    service_folders = results.get('files', [])
    all_projects = []
    
    for sf in service_folders:
        print(f"Checking Service: {sf['name']}...")
        
        # Determine if this folder should be treated as a Project itself or a container of Projects
        # 1. Check for immediate project.json or images in sf
        immediate_results = service.files().list(
            q=f"'{sf['id']}' in parents and trashed = false",
            fields="files(id, name, mimeType)"
        ).execute()
        
        immediate_files = immediate_results.get('files', [])
        has_subfolders = any(f['mimeType'] == 'application/vnd.google-apps.folder' for f in immediate_files)
        has_assets = any(f['mimeType'].startswith('image/') or f['name'] == 'project.json' for f in immediate_files)
        
        # List of folder-data pairs to process [(folder_id, folder_name, parent_name)]
        to_process = []
        
        if has_subfolders:
            # Process subfolders as separate projects
            proj_results = service.files().list(
                q=f"'{sf['id']}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false",
                fields="files(id, name)"
            ).execute()
            for pf in proj_results.get('files', []):
                to_process.append((pf['id'], pf['name'], sf['name']))
        elif has_assets:
            # Treat the service folder itself as a single project for now
            to_process.append((sf['id'], sf['name'], sf['name']))
            
        for p_id, p_name, s_name in to_process:
            print(f"  Processing Project: {p_name} in {s_name}")
            
            # 2. Look for project.json
            json_results = service.files().list(
                q=f"'{p_id}' in parents and name = 'project.json' and trashed = false",
                fields="files(id, name)"
            ).execute()
            
            json_files = json_results.get('files', [])
            project_data = {}
            
            if json_files:
                request = service.files().get_media(fileId=json_files[0]['id'])
                fh = io.BytesIO()
                downloader = MediaIoBaseDownload(fh, request)
                done = False
                while done is False:
                    status, done = downloader.next_chunk()
                project_data = json.loads(fh.getvalue().decode())
            else:
                project_data = {
                    "title": p_name,
                    "category": s_name,
                    "description": f"Strategic {s_name} work.",
                    "result": "Dominance Engineered",
                    "tags": [s_name]
                }
            
            # 3. Find image
            image_name = project_data.get('featured_image')
            target_img_id = None
            
            if image_name:
                img_results = service.files().list(
                    q=f"'{p_id}' in parents and name = '{image_name}' and trashed = false",
                    fields="files(id, name)"
                ).execute()
                if img_results.get('files'):
                    target_img_id = img_results['files'][0]['id']
            else:
                img_results = service.files().list(
                    q=f"'{p_id}' in parents and (mimeType = 'image/jpeg' or mimeType = 'image/png') and trashed = false",
                    pageSize=1,
                    fields="files(id, name)"
                ).execute()
                if img_results.get('files'):
                    target_img_id = img_results['files'][0]['id']
                    image_name = img_results['files'][0]['name']

            if target_img_id:
                local_img_filename = f"{p_id}_{image_name.replace(' ', '_')}"
                local_img_path = os.path.join(PUBLIC_IMAGES_DIR, local_img_filename)
                download_file(service, target_img_id, image_name, local_img_path)
                project_data['image'] = f"/images/portfolio/{local_img_filename}"
            
            project_data['id'] = p_id
            all_projects.append(project_data)

    # 5. Save updated portfolio.json
    if all_projects:
        with open(PORTFOLIO_JSON_PATH, 'w') as f:
            json.dump(all_projects, f, indent=2)
        print(f"Sync Complete. {len(all_projects)} projects synced.")
    else:
        print("No dynamic projects found in Drive. Site will retain existing data if any.")

if __name__ == "__main__":
    try:
        sync()
    except Exception as e:
        print(f"Sync Error: {e}")
