# Antigravity IDE Configuration for Zeniac Business Intelligence System

## Executive Summary

This document provides complete setup instructions for configuring your Antigravity IDE to function as a professional business intelligence researcher that uses API tools to gather comprehensive data and generate visually-rich, professional PDF reports.

---

## 🎯 System Role Definition

**CRITICAL: Your Antigravity IDE should operate with this identity:**

```
You are a Professional Business Intelligence Researcher specializing in 
comprehensive digital audits. Your role is to:

1. USE API TOOLS (Firecrawl, Apify, etc.) to gather business intelligence
2. ANALYZE data across website, SEO, social media, and competitive positioning
3. SCORE each category on a 0-100 scale with clear justification
4. IDENTIFY strengths, weaknesses, and actionable opportunities
5. GENERATE professionally designed PDF reports with charts and visualizations
6. PROVIDE strategic recommendations with impact/effort estimates

You proactively request any additional APIs or MCP servers needed to 
complete comprehensive research.
```

---

## ⚙️ Required Fixes for Current Build Error

### Issue: JSX Syntax Error in `/src/app/api/send-audit/route.ts`

**Location:** Line 25
**Error:** `Parsing ecmascript source code failed` - Expected '>', got 'style'

**Root Cause:** Incorrect JSX syntax for inline styles in email template component.

**Fix:**

```typescript
// BEFORE (Incorrect - Line 25):
<div style={{ fontFamily: 'Helvetica, Arial, sans-serif', maxWidth: '600px', margin: '0 auto', color: '#333' }}>

// AFTER (Correct):
<div style={{ fontFamily: 'Helvetica, Arial, sans-serif', maxWidth: '600px', margin: '0 auto', color: '#333' }}>
```

**Action Required:**
1. Open `/src/app/api/send-audit/route.ts`
2. Navigate to line 25
3. Ensure proper JSX object syntax with double curly braces `{{ }}`
4. Verify no extra spaces or malformed syntax
5. Restart development server

---

## 🎹 Keyboard Shortcuts Configuration

Add these keyboard bindings to your Antigravity IDE:

```json
{
  "keyboard": {
    "shortcuts": {
      "Enter": {
        "action": "proceedToNextStep",
        "description": "Move forward in workflow",
        "contexts": ["wizard", "analysis", "report-generation"]
      },
      "Backspace": {
        "action": "undoPreviousAction", 
        "description": "Return to previous step",
        "contexts": ["wizard", "analysis", "report-generation"],
        "modifier": "none"
      }
    }
  }
}
```

**Implementation:**
- **Enter** → Proceed to next phase (Discovery → Research → Analysis → Report)
- **Backspace** → Go back to previous phase to revise

---

## 📦 Skills Installation

You have two custom skills that need to be installed:

### Skill 1: Business Intelligence APIs
**File:** `business-intelligence-apis.skill`
**Purpose:** API orchestration and research methodology
**Triggers:** Business analysis requests, competitor research, SEO audits

### Skill 2: Business Report Designer  
**File:** `business-report-designer.skill`
**Purpose:** Professional PDF generation with visualizations
**Triggers:** Report generation, PDF creation, data visualization

**Installation Steps:**
1. Upload both `.skill` files to your Antigravity IDE
2. Navigate to Settings → Skills → Upload Custom Skills
3. Verify both skills appear in your skills list
4. Test by saying: "Use the business-intelligence-apis skill to analyze [website]"

---

## 🔌 Required API Integrations

### Priority 1: Essential APIs

#### Firecrawl API
**Purpose:** Website scraping and content extraction
**Configuration:**
```bash
FIRECRAWL_API_KEY=your_key_here
FIRECRAWL_BASE_URL=https://api.firecrawl.dev/v0
```

**Capabilities Needed:**
- URL scraping with markdown/HTML output
- Meta tag extraction
- Link discovery
- Content parsing

#### Apify API
**Purpose:** Competitor analysis and automated data collection
**Configuration:**
```bash
APIFY_API_KEY=your_key_here
APIFY_BASE_URL=https://api.apify.com/v2
```

**Recommended Actors:**
- `apify/web-scraper` - General web scraping
- `apify/google-search-scraper` - SEO research
- `apify/social-media-scraper` - Social media analysis

### Priority 2: Enhanced Analysis APIs (Optional but Recommended)

#### Google PageSpeed Insights API
**Purpose:** Website performance metrics
```bash
GOOGLE_PAGESPEED_API_KEY=your_key_here
```

#### Social Media APIs
- **LinkedIn API** - Company page analytics
- **Facebook Graph API** - Page metrics
- **Twitter API** - Tweet and engagement data

#### SEO Tools
- **Ahrefs API** / **SEMrush API** - Backlink and keyword data
- **Moz API** - Domain authority metrics

### How to Request Missing APIs

When your IDE detects a missing API during analysis, it should:

```
"To complete this analysis comprehensively, I need access to:

❌ Firecrawl API - Currently unavailable
   Purpose: Website content extraction and analysis
   Action: Please add FIRECRAWL_API_KEY to environment variables

⚠️  Apify API - Currently unavailable  
   Purpose: Competitor website monitoring
   Action: Please add APIFY_API_KEY to environment variables

I can proceed with limited analysis using available tools, but results 
will lack [specific capabilities]. Would you like me to:
1. Proceed with available tools
2. Wait for you to enable missing APIs
3. Suggest alternative approaches
```

---

## 📊 Report Design Specifications

### Current Problem with Your Reports

**Issue:** Report lacks design, visualizations, and metadata
- ❌ Plain text layout
- ❌ No charts or graphs
- ❌ Missing visual score representations
- ❌ No competitor comparison matrices
- ❌ Incomplete metadata display

### Required Report Elements

#### 1. Cover Page
- Black background with gold "ZENIAC INTELLIGENCE" branding
- Large, prominent overall health score (color-coded)
- Business name and analysis date
- Professional, executive-friendly design

#### 2. Score Visualizations
**For each category, display:**
- Radial/circular progress charts
- Color-coded scores:
  - Green (80-100): Excellence
  - Gold (60-79): Good
  - Orange (40-59): Needs improvement
  - Red (0-39): Critical
- Score breakdown bars

#### 3. Data Visualizations Required
- **Competitive Positioning Matrix** (scatter plot)
- **Category Score Dashboard** (4 radial charts)
- **Strengths/Weaknesses Tables** (color-coded, icon-enhanced)
- **Recommendation Priority Matrix** (impact vs. effort)
- **Social Media Presence Chart** (bar graph)
- **SEO Checklist** (visual completion percentage)

#### 4. Metadata Display
Must show:
- APIs used in analysis
- Number of data sources
- Analysis timestamp
- Completeness percentage
- Confidence levels
- Any limitations or caveats

### Implementation Approach

**Use the business-report-designer skill** which includes:
- ReportLab PDF generation templates
- Matplotlib chart creation functions
- Pre-configured color schemes
- Professional layout templates
- Automated metadata inclusion

---

## 🔄 Complete Workflow

### Phase 1: User Input
```
User: "Analyze healthessentials.com and generate a business intelligence report"
```

### Phase 2: Skill Activation
```
IDE: [Automatically loads business-intelligence-apis skill]
     "I'll conduct a comprehensive digital audit of healthessentials.com. 
     This will include website analysis, SEO evaluation, social media 
     presence, and competitive positioning."
```

### Phase 3: API Research
```
IDE: [Uses Firecrawl API to scrape website]
     [Uses Apify API for competitor data]
     [Collects SEO metrics]
     [Analyzes social media presence]
     
     "Collecting data... [Progress bar]
     ✓ Website scraped (50 pages analyzed)
     ✓ 3 competitors identified and analyzed
     ✓ SEO metrics collected (45 data points)
     ✓ Social media presence mapped (4 platforms)"
```

### Phase 4: Scoring & Analysis
```
IDE: "Analysis complete:
     
     Overall Health Score: 40/100 ⚠️
     
     Breakdown:
     - Website Quality: 35/100 (Critical)
     - SEO Performance: 28/100 (Critical) 
     - Social Media: 52/100 (Needs improvement)
     - Competitive Position: 45/100 (Needs improvement)
     
     Critical Issues Detected:
     1. Missing H1 tags on key pages
     2. No meta descriptions (React/Next.js issue)
     3. Low mobile performance score
     
     Press ENTER to generate visual report, or BACKSPACE to revise analysis"
```

### Phase 5: Report Generation
```
IDE: [User presses ENTER]
     [Loads business-report-designer skill]
     
     "Generating professional PDF report with:
     ✓ Cover page with branding
     ✓ Executive summary
     ✓ Score dashboard with radial charts
     ✓ Detailed findings with tables
     ✓ Competitive positioning matrix
     ✓ Prioritized recommendations
     ✓ Methodology and metadata
     
     Report ready: business_intelligence_report.pdf (14 pages, 3.2MB)"
```

### Phase 6: Preview & Delivery
```
IDE: [Shows PDF preview]
     "Your report is ready. You can:
     1. Download PDF
     2. Email to: [input]
     3. Revise analysis (press BACKSPACE)
     
     Press ENTER to send via email"
```

---

## 🐛 Debugging Guide

### Common Issues and Solutions

#### 1. "Crawl Failed" Error
**Cause:** Firecrawl API key missing or invalid
**Solution:**
```bash
# Verify API key is set
echo $FIRECRAWL_API_KEY

# Test API connection
curl -X POST https://api.firecrawl.dev/v0/scrape \
  -H "Authorization: Bearer $FIRECRAWL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

#### 2. Port 3000 Locked
**Cause:** Zombie process holding port
**Solution:**
```bash
# Find process
lsof -ti:3000

# Kill process
kill -9 $(lsof -ti:3000)

# Restart dev server
npm run dev
```

#### 3. Report Lacks Visuals
**Cause:** business-report-designer skill not loaded
**Solution:**
- Verify skill is installed
- Explicitly trigger: "Use business-report-designer skill to create the PDF"
- Check matplotlib and reportlab are installed:
```bash
pip install matplotlib reportlab --break-system-packages
```

#### 4. JSX Syntax Errors
**Cause:** Improper inline style syntax
**Solution:**
- Always use double curly braces: `style={{ }}`
- Ensure proper object notation: `{ key: 'value' }`
- Remove any extra spaces or malformed syntax

---

## 📋 Quick Reference Card

### Essential Commands

```bash
# Start development server
npm run dev

# Install Python packages
pip install [package] --break-system-packages

# Kill port 3000 process
kill -9 $(lsof -ti:3000)

# Package a skill
python3 /path/to/package_skill.py skill-folder output-dir

# Validate a skill
python3 /path/to/validate_skill.py skill-folder
```

### Workflow Shortcuts

| Action | Shortcut | Context |
|--------|----------|---------|
| Next Step | Enter | Any workflow phase |
| Previous Step | Backspace | Any workflow phase |
| Skip Phase | Ctrl+Enter | Optional phases only |
| Cancel | Esc | Any time |

### Skill Triggers

| Say This | Activates |
|----------|-----------|
| "Analyze [website]" | business-intelligence-apis |
| "Generate report" | business-report-designer |
| "Create visual PDF" | business-report-designer |
| "Research competitors" | business-intelligence-apis |

---

## ✅ Implementation Checklist

Before going live, verify:

- [ ] Both skills (.skill files) are installed and visible
- [ ] Firecrawl API key is configured and tested
- [ ] Apify API key is configured and tested
- [ ] Keyboard shortcuts (Enter/Backspace) are working
- [ ] JSX syntax error in route.ts is fixed
- [ ] Development server starts without errors
- [ ] Can complete full workflow from input to PDF generation
- [ ] PDFs include all required visualizations
- [ ] Metadata is displayed in reports
- [ ] Score calculations are accurate and justified
- [ ] Recommendations are actionable and prioritized

---

## 🚀 Testing Your Setup

### Test Workflow

1. **Input Test**
   ```
   "Analyze https://example.com"
   ```
   Expected: Skill loads, requests APIs if missing

2. **API Test**
   ```
   Should see: "Scraping website... ✓ Complete"
   ```
   Expected: Firecrawl successfully scrapes site

3. **Scoring Test**
   ```
   Should see: "Overall Score: [X]/100" with breakdown
   ```
   Expected: All 4 category scores displayed

4. **Visualization Test**
   ```
   Should generate: PDF with charts, not plain text
   ```
   Expected: Radial charts, tables, matrices visible

5. **Keyboard Test**
   ```
   Press Enter → Advances workflow
   Press Backspace → Returns to previous step
   ```
   Expected: Smooth navigation through phases

---

## 📞 Support Resources

### When Things Go Wrong

1. **Check the skills are loaded:**
   ```
   Ask IDE: "List available skills"
   ```

2. **Verify API connectivity:**
   ```
   Ask IDE: "Test Firecrawl API connection"
   ```

3. **Review error logs:**
   ```
   Check: /logs/analysis-[timestamp].log
   ```

4. **Re-read skill documentation:**
   ```
   Ask IDE: "Show me the business-intelligence-apis skill guide"
   ```

---

## 🎓 Best Practices

### For Best Results:

1. **Always start with skills awareness**
   - IDE should check which skills are available
   - Load appropriate skill before attempting task

2. **Request missing tools proactively**
   - Don't silently fail when API is unavailable
   - Explain what's missing and why it matters

3. **Show your work**
   - Display data collection progress
   - Show scoring calculations
   - Justify all recommendations

4. **Make reports visually compelling**
   - Use color coding consistently
   - Include at least 5-7 charts/graphs
   - Balance text with visuals

5. **Be actionable**
   - Every weakness needs a recommendation
   - Prioritize by impact and effort
   - Include success metrics

---

## 📄 File Locations Reference

```
Project Structure:
├── /src/app/api/
│   ├── analyze/route.ts          # Main analysis endpoint
│   └── send-audit/route.ts       # Email delivery (FIX LINE 25!)
│
├── Skills (to be uploaded):
│   ├── business-intelligence-apis.skill
│   └── business-report-designer.skill
│
├── Environment Variables:
│   ├── FIRECRAWL_API_KEY=...
│   ├── APIFY_API_KEY=...
│   └── [other API keys]
│
└── Output:
    └── /mnt/user-data/outputs/
        └── business_intelligence_report.pdf
```

---

## 🔮 Next Steps

1. **Fix the immediate JSX error** (Line 25 in route.ts)
2. **Install both .skill files** to your IDE
3. **Configure API keys** (at minimum: Firecrawl, Apify)
4. **Test the complete workflow** with a sample website
5. **Review generated PDF** to ensure all visualizations appear
6. **Iterate on design** based on client feedback

---

**Your business intelligence system is now ready to conduct professional research and generate executive-ready reports! 🎉**
