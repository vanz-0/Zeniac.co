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
    
    # Testimonial aggregation
    testimonials_found = []

    for sf in service_folders:
        print(f"Checking Service: {sf['name']}...")
        
        immediate_results = service.files().list(
            q=f"'{sf['id']}' in parents and trashed = false",
            fields="files(id, name, mimeType)"
        ).execute()
        
        immediate_files = immediate_results.get('files', [])
        has_subfolders = any(f['mimeType'] == 'application/vnd.google-apps.folder' for f in immediate_files)
        has_assets = any(f['mimeType'].startswith('image/') or f['name'] == 'project.json' or f['mimeType'].startswith('video/') for f in immediate_files)
        
        to_process = []
        if has_subfolders:
            proj_results = service.files().list(
                q=f"'{sf['id']}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false",
                fields="files(id, name)"
            ).execute()
            for pf in proj_results.get('files', []):
                to_process.append((pf['id'], pf['name'], sf['name']))
        elif has_assets:
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
            
            # Recursive media collection
            carousel = []
            def collect_recursive(folder_id, folder_name=""):
                print(f"    Scanning folder: {folder_name}...")
                results = service.files().list(
                    q=f"'{folder_id}' in parents and trashed = false",
                    fields="files(id, name, mimeType)"
                ).execute().get('files', [])
                
                for f in results:
                    if f['mimeType'] == 'application/vnd.google-apps.folder':
                        collect_recursive(f['id'], f['name'])
                    elif "image/" in f['mimeType'] or "video/" in f['mimeType']:
                        local_name = f"{f['id']}_{f['name'].replace(' ', '_')}"
                        local_path = os.path.join(PUBLIC_IMAGES_DIR, local_name)
                        download_file(service, f['id'], f['name'], local_path)
                        item = {
                            "path": f"/images/portfolio/{local_name}", 
                            "type": "image" if "image" in f['mimeType'] else "video",
                            "folder": folder_name or p_name
                        }
                        if item["type"] == "video":
                            item["url"] = f"https://drive.google.com/file/d/{f['id']}/view"
                        carousel.append(item)
            
            collect_recursive(p_id, p_name)
            
            if carousel:
                project_data['carousel'] = carousel
                project_data['image'] = carousel[0]['path'] # Fallback

            # 3. Special Case: Before/After (FTTT)
            if p_name == "FTTT" or "from this to this" in p_name.lower():
                project_data['description'] = "from this to this"
                project_data['title'] = "Brand Transformation"
                # Swap logic: user said "interchanged before and after"
                # If carousel has 2+ items, treat them as Before/After
                if len(carousel) >= 2:
                    # Swapping current order (assuming Drive order was reversed)
                    # Use the first two images for the comparison grid
                    project_data['before_after'] = [carousel[1]['path'], carousel[0]['path']]
                
            # 4. Special Case: Testimonials
            if s_name == "Testimonials":
                project_data['category'] = "Clients' Businesses Testimonials"
                testimonials_found.append(project_data)
                continue # Aggregate later

            project_data['id'] = p_id
            all_projects.append(project_data)

    # Aggregate Testimonials into one entry if found
    # Aggregate Testimonials into one entry if found
    if testimonials_found:
        combined_carousel = []
        for t in testimonials_found:
            for item in t.get('carousel', []):
                # Hardcode the specific TikTok link if it's a video
                if item['type'] == 'video' or 'mp4' in item['path']:
                    item['url'] = "https://www.tiktok.com/@1healthessentials/video/7582999258408717579"
                    item['type'] = 'video' # Ensure type is video
                combined_carousel.append(item)
        
        testimonial_project = {
            "id": "combined-testimonials",
            "title": "Evidence of Impact",
            "category": "Clients' Businesses Testimonials",
            "description": "Real results from our ecosystem partners.",
            "result": "Market Dominance",
            "tags": ["Testimonials", "Results"],
            "carousel": combined_carousel,
            "image": combined_carousel[0]['path'] if combined_carousel else ""
        }
        all_projects.append(testimonial_project)

    # REORDERING LOGIC
    # 1. Move "Brand Transformation" (FTTT) to the END
    
    fttt_project = None
    other_projects = []
    
    for p in all_projects:
        if p.get('title') == "Brand Transformation" or p.get('title') == "FTTT":
            fttt_project = p
        else:
            other_projects.append(p)
            
    final_projects = other_projects
    if fttt_project:
        final_projects.append(fttt_project)
        
    # 5. Save updated portfolio.json
    if final_projects:
        with open(PORTFOLIO_JSON_PATH, 'w') as f:
            json.dump(final_projects, f, indent=2)
        print(f"Sync Complete. {len(final_projects)} projects synced.")
    else:
        print("No dynamic projects found in Drive. Site will retain existing data if any.")

if __name__ == "__main__":
    try:
        sync()
    except Exception as e:
        print(f"Sync Error: {e}")
