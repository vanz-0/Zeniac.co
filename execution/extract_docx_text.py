import sys
import docx
import os

def extract_text(file_path):
    doc = docx.Document(file_path)
    full_text = []
    for para in doc.paragraphs:
        full_text.append(para.text)
    return '\n'.join(full_text)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python extract_docx_text.py <path_to_docx>")
        sys.exit(1)
    
    file_path = sys.argv[1]
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        sys.exit(1)
        
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        text = extract_text(file_path)
        print(text)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
