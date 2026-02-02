# Web Audit Directive

## Goal
Perform a comprehensive technical audit of a website to identify performance, SEO, and accessibility issues.

## Tools
- `npx` (to run lighthouse)
- `curl` (to check headers)

## Inputs
- `url`: The target website URL

## Steps
1. **Analyze Security Headers**
   Run: `curl -I <url>`
   Check for:
   - `Strict-Transport-Security`
   - `Content-Security-Policy`
   - `X-Frame-Options`

2. **Run Lighthouse Audit**
   Run: `npx lighthouse <url> --output=json --output-path=./report.json --chrome-flags="--headless"`
   
   *Note: Ensure Chrome is installed in the environment or use a compatible runner.*

3. **Interpret Results**
   - **Performance Score < 50**: Critical Issue (Load time)
   - **SEO Score < 70**: Missing Meta tags, alt tags
   - **Accessibility < 70**: Color contrast, aria labels

## Output Format
Generate a summary report:
```markdown
# Audit for [URL]
## Scores
- Performance: [Score]
- SEO: [Score]
- Accessibility: [Score]

## Critical Issues
1. [Issue 1]
2. [Issue 2]

## Recommendations
- [Actionable Step 1]
```
