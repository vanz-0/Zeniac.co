import zipfile
import xml.etree.ElementTree as ET
import os

def docx_to_text(path):
    try:
        with zipfile.ZipFile(path) as docx:
            xml_content = docx.read('word/document.xml')
            tree = ET.fromstring(xml_content)
            ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            p_list = []
            for p in tree.findall('.//w:p', ns):
                t_list = []
                for t in p.findall('.//w:t', ns):
                    if t.text: t_list.append(t.text)
                if t_list: p_list.append(" ".join(t_list))
            return "\n".join(p_list)
    except Exception as e:
        return f"Error: {e}"

if __name__ == "__main__":
    base_path = r"c:\Users\Admin\OneDrive\Desktop\Zeniac.Co\resources\Implimentations"
    files = ["Executive_Summary_30Day_Plan.docx", "Zeniac_Complete_Strategic_Playbook.docx"]
    for f in files:
        text = docx_to_text(os.path.join(base_path, f))
        out_name = f.replace(".docx", ".txt")
        with open(out_name, "w", encoding="utf-8") as out:
            out.write(text)
        print(f"Written to {out_name}")
