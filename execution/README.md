# Execution Scripts

This folder contains deterministic Python scripts that perform the actual work.

## Principles

1. **Deterministic**: Same input = same output
2. **Well-commented**: Explain what and why
3. **Error handling**: Graceful failures with clear messages
4. **Testable**: Can be run independently
5. **Fast**: Optimized for performance

## Script Template

```python
"""
Script Name: script_name.py
Purpose: Brief description
Inputs: What it needs
Outputs: What it produces
"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def main():
    """
    Main execution function
    """
    try:
        # Your code here
        pass
    except Exception as e:
        print(f"Error: {e}")
        raise

if __name__ == "__main__":
    main()
```

## Best Practices

- Use environment variables for secrets (load from `.env`)
- Add type hints where applicable
- Include docstrings
- Handle errors gracefully
- Log important steps
- Keep functions focused and single-purpose
