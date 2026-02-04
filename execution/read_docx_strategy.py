import zipfile
import xml.etree.ElementTree as ET
import os

def docx_to_text(path):
    try:
        with zipfile.ZipFile(path) as docx:
            xml_content = docx.read('word/document.xml')
            tree = ET.fromstring(xml_content)
            
            # The XML structure for paragraphs in Word is usually <w:p> and text in <w:t>
            # We need to handle namespaces
            ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            
            p_list = []
            for p in tree.findall('.//w:p', ns):
                t_list = []
                for t in p.findall('.//w:t', ns):
                    if t.text:
                        t_list.append(t.text)
                if t_list:
                    p_list.append(" ".join(t_list))
            
            return "\n".join(p_list)
    except Exception as e:
        return f"Error reading {path}: {e}"

if __name__ == "__main__":
    base_path = r"c:\Users\Admin\OneDrive\Desktop\Zeniac.Co\resources\Implimentations"
    files = [
        "Executive_Summary_30Day_Plan.docx",
        "Zeniac_Complete_Strategic_Playbook.docx"
    ]
    
    for f in files:
        full_path = os.path.join(base_path, f)
        print(f"--- {f} ---")
        text = docx_to_text(full_path)
        # Handle encoding for terminal
        try:
            print(text[:2000].encode('utf-8', errors='ignore').decode('utf-8') + "...")
        except:
            print(text[:2000] + "...")
        print("\n")
