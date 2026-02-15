
import subprocess
import os
import sys

def main():
    print("[INFO] Deploying Backend...")

    # 1. Read Service Account JSON
    try:
        with open("service-account.json", "r", encoding="utf-8") as f:
            sa_json = f.read().strip()
    except FileNotFoundError:
        print("[ERROR] service-account.json not found!")
        sys.exit(1)
    except Exception as e:
        print(f"[ERROR] Failed to read JSON: {e}")
        sys.exit(1)

    # Prepare environment with UTF-8 encoding
    env = os.environ.copy()
    env["PYTHONIOENCODING"] = "utf-8"

    # 2. Create Modal Secret
    print("[INFO] Creating Modal Secret: google-service-account...")
    try:
        result = subprocess.run(
            [sys.executable, "-m", "modal", "secret", "create", "google-service-account", f"GOOGLE_SERVICE_ACCOUNT_JSON={sa_json}"],
            capture_output=True, # Capture to avoid direct print encoding issues
            env=env
        )
        # Decode safely
        stdout = result.stdout.decode('utf-8', errors='replace')
        stderr = result.stderr.decode('utf-8', errors='replace')
        
        if result.returncode == 0:
            print("[SUCCESS] Secret created/updated.")
        else:
            print(f"[WARNING] Secret creation output: {stderr}")
            if "already exists" in stderr:
                 print("[INFO] Secret already exists.")

    except Exception as e:
        print(f"[ERROR] Failed to create secret: {e}")

    # 3. Deploy Webhook
    print("[INFO] Deploying modal_webhook.py...")
    try:
        result = subprocess.run(
            [sys.executable, "-m", "modal", "deploy", "execution/modal_webhook.py"],
            capture_output=True,
            env=env
        )
        stdout = result.stdout.decode('utf-8', errors='replace')
        stderr = result.stderr.decode('utf-8', errors='replace')

        if result.returncode == 0:
            print("[SUCCESS] Backend Deployed!")
            # print("Output:") <--- avoiding print of full output which may contain emojis
            # print(stdout)    <--- avoiding print of full output which may contain emojis
            # Try to find URL in output
            import re
            url_match = re.search(r'https://[a-zA-Z0-9-]+\.modal\.run', stdout)
            if url_match:
                print(f"[URL] {url_match.group(0)}")
            else:
                print("[WARNING] Could not find URL in output. Check logs manually if needed.")
        else:
            print(f"[ERROR] Deployment failed with return code {result.returncode}")
            print(f"Stderr: {stderr}")
            sys.exit(1)

    except Exception as e:
        print(f"[ERROR] Deployment execution failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
