# Competitor Analysis Directive

## Goal
Compare a client's digital presence against 3 local competitors to identify gaps and opportunities.

## Inputs
- `client_url`: Client's website
- `competitor_urls`: Comma-separated list of competitor URLs (max 3)

## Steps
1. **Content Strategy Comparison**
   For each URL, scrape the homepage (using `scrapt` or `puppeteer`) and extract:
   - `<h1>` (Main Value Prop)
   - `<title>` (SEO Focus)
   - Meta Description (Brand Positioning)

2. **Visual & Brand Analysis**
   - Identify primary color palette (hex codes) from CSS
   - Check for presence of "Social Proof" (Review widgets, Testimonials)
   - Check for "Call to Action" clarity (e.g., "Book Now" vs "Contact")

3. **Tech Stack Comparison**
   - Detect: Wordpress vs Custom/React (check for `/wp-content` or `_next`)
   - Detect: Analytics (GA4, GTM)

## Output Format
```markdown
# Competitive Landscape
| Feature | Client | Competitor A | Competitor B |
|---------|--------|--------------|--------------|
| Platform| React  | Wordpress    | Wix          |
| Speed   | Fast   | Slow         | Medium       |
| CTA     | Weak   | Strong       | Strong       |

## Strategic Gaps
- Competitors are using [Strategy X] which Client is missing.
- Client has better [Tech] but poor [Messaging].
```
