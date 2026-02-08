
import sys
import os
import importlib.util

def check_package(name):
    if importlib.util.find_spec(name):
        print(f"[{name}] OK")
    else:
        print(f"[{name}] MISSING")

print("--- Python Environment Check ---")
check_package("requests")
check_package("bs4")
check_package("nltk")
check_package("dotenv")

print("\n--- Environment Variables Check ---")
# Try to load .env manually if dotenv is available
try:
    from dotenv import load_dotenv
    load_dotenv()
    print("Loaded .env file")
except ImportError:
    print("dotenv not installed, checking system env only")

keys = ["FIRECRAWL_API_KEY", "APIFY_API_KEY", "BREVO_API_KEY"]
for key in keys:
    val = os.getenv(key)
    status = "SET" if val and len(val) > 0 else "MISSING"
    print(f"[{key}] {status}")

print("\n--- NLTK Data Check ---")
try:
    import nltk
    try:
        nltk.data.find('sentiment/vader_lexicon.zip')
        print("[vader_lexicon] FOUND")
    except LookupError:
        print("[vader_lexicon] MISSING")
except ImportError:
    print("nltk not imported")
