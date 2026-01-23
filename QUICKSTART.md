# Quick Start Guide

## 🎯 You are now set up with the 3-Layer Architecture!

### What You Have

```
Zeniac.Co/
├── directives/          ← Your instruction manuals (Markdown SOPs)
├── execution/           ← Your tools (Python scripts)
├── .tmp/               ← Scratch space (auto-generated files)
├── .env.example        ← Template for secrets
├── .gitignore          ← Protects sensitive files
├── requirements.txt    ← Python dependencies
└── README.md           ← Full architecture docs
```

### Next Steps

#### 1. Set up your environment
```bash
# Copy the environment template
cp .env.example .env

# Edit .env and add your API keys
# (Use your favorite editor)

# Install Python dependencies
pip install -r requirements.txt
```

#### 2. Create your first directive
Example: `directives/scrape_website.md`

```markdown
# Scrape Website

## Goal
Extract content from a single website URL

## Inputs
- URL to scrape
- CSS selectors for target content

## Process
1. Validate URL format
2. Call `execution/scrape_single_site.py`
3. Save to `.tmp/scraped_content.json`
4. Return success/failure

## Tools/Scripts
- `execution/scrape_single_site.py` - Fetches and parses HTML

## Outputs
- `.tmp/scraped_content.json` - Raw scraped data

## Edge Cases
- Rate limiting: Wait 1 second between requests
- 404 errors: Skip and log
- Timeout: 10 second max per request
```

#### 3. Create your first execution script
Example: `execution/scrape_single_site.py`

```python
"""
Script: scrape_single_site.py
Purpose: Scrape content from a single URL
"""

import os
import sys
import json
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

load_dotenv()

def scrape_url(url, selectors):
    """Scrape content from URL using CSS selectors"""
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        results = {}
        for key, selector in selectors.items():
            elements = soup.select(selector)
            results[key] = [el.get_text(strip=True) for el in elements]
        
        return results
    except Exception as e:
        print(f"Error scraping {url}: {e}")
        raise

if __name__ == "__main__":
    # Example usage
    url = sys.argv[1] if len(sys.argv) > 1 else "https://example.com"
    selectors = {"titles": "h1", "paragraphs": "p"}
    
    result = scrape_url(url, selectors)
    
    # Save to .tmp
    with open(".tmp/scraped_content.json", "w") as f:
        json.dump(result, f, indent=2)
    
    print(f"Scraped {len(result)} sections from {url}")
```

#### 4. How to use the system

**As the AI orchestrator, I will:**
1. Read your directives to understand what tools exist
2. Route requests to the appropriate execution scripts
3. Handle errors and retry logic
4. Update directives when I learn something new
5. Keep `.tmp/` clean by regenerating files as needed

**You should:**
1. Create directives for each workflow
2. Build execution scripts for deterministic tasks
3. Update `.env` with your API keys
4. Let the system self-anneal (improve over time)

### Example Workflow

**User says:** "Scrape all blog posts from example.com"

**I do:**
1. Read `directives/scrape_website.md`
2. Call `execution/scrape_single_site.py` with the URL
3. If it fails (e.g., rate limit), I:
   - Fix the script to handle rate limits
   - Test it again
   - Update the directive with the new learning
4. Save results to `.tmp/`
5. Report back to you

### Remember

- **Directives = Instructions** (living documents)
- **Execution = Tools** (deterministic scripts)
- **AI = Orchestrator** (decision making)

This separation makes the system:
- ✅ Reliable (deterministic code doesn't hallucinate)
- ✅ Testable (scripts can run independently)
- ✅ Learnable (directives improve over time)
- ✅ Fast (no repeated LLM calls for same tasks)

---

**Ready to build something?** Just tell me what you need, and I'll either:
1. Use an existing directive + execution script
2. Create new ones if they don't exist
3. Self-anneal if something breaks
