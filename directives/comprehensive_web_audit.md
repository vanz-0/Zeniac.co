# Comprehensive Web Audit Directive

## Goal
Perform an exhaustive business intelligence analysis that extracts maximum value from Firecrawl, Apify, and PageSpeed APIs to generate a persuasive 15-20 page PDF report that drives appointment bookings.

## Framework
This directive follows the **DOE (Directives → Orchestration → Execution)** architecture:
- **This file (Directive)**: Defines WHAT to extract
- **Orchestration** (`/src/app/api/analyze/route.ts`): Routes and coordinates API calls
- **Execution** (`/execution/*.py`): Deterministic scripts for data processing

---

## Inputs
- `url`: Client's primary website URL
- `business_name`: Company/brand name
- `location`: City for local competitor research (optional, auto-detected)
- `industry`: Business category (optional, auto-detected)

---

## Data Extraction Requirements

### 1. Technical Foundation (Firecrawl + PageSpeed)

**Source**: Firecrawl API (multi-page scan) + Google PageSpeed Insights API

**Pages to Scan** (Firecrawl):
- Homepage (`/`)
- About page (`/about`, `/about-us`, `/who-we-are`)
- Services/Products page (`/services`, `/products`, `/what-we-do`)
- Contact page (`/contact`, `/contact-us`)
- Blog/Resources page (`/blog`, `/resources`, `/news`) - if exists

**Technical Metadata to Extract**:
```json
{
  "tech_stack": {
    "platform": "WordPress | Custom | React | Next.js | Wix | Squarespace",
    "detected_by": "Check for /wp-content/, _next/, .wix domains",
    "framework_version": "Extract from meta tags or source",
    "cms": "WordPress | Drupal | Joomla | None"
  },
  "performance": {
    "mobile_score": 0-100,
    "desktop_score": 0-100,
    "core_web_vitals": {
      "lcp": "milliseconds - Largest Contentful Paint",
      "fcp": "milliseconds - First Contentful Paint", 
      "cls": "decimal - Cumulative Layout Shift",
      "tbt": "milliseconds - Total Blocking Time",
      "speed_index": "milliseconds"
    },
    "page_size": "bytes",
    "requests_count": "number",
    "load_time": "seconds"
  },
  "security": {
    "ssl_enabled": true/false,
    "https_redirect": true/false,
    "security_headers": ["Strict-Transport-Security", "X-Frame-Options", etc.]
  },
  "mobile": {
    "responsive": true/false,
    "viewport_meta": true/false,
    "mobile_friendly_score": 0-100
  }
}
```

---

### 2. SEO Intelligence (Firecrawl - Multi-Page Analysis)

**For EACH Page Scanned**:
```json
{
  "page_url": "full URL",
  "seo_metadata": {
    "title_tag": "content | MISSING",
    "title_length": "characters (optimal 50-60)",
    "meta_description": "content | MISSING",
    "meta_length": "characters (optimal 150-160)",
    "h1_tags": ["array of H1 content"],
    "h1_count": "number (should be 1)",
    "h2_h6_structure": "Present | Missing",
    "canonical_tag": "URL | MISSING",
    "og_tags": {
      "og:title": "content | MISSING",
      "og:description": "content | MISSING",
      "og:image": "URL | MISSING"
    },
    "twitter_cards": true/false,
    "schema_markup": ["Organization", "LocalBusiness", etc.] | []
  },
  "content_analysis": {
    "word_count": "number",
    "readability_score": "Flesch-Kincaid or similar",
    "keyword_density": {"keyword": "percentage"},
    "images": {
      "total_count": "number",
      "missing_alt": "number",
      "alt_coverage": "percentage"
    },
    "internal_links": "count",
    "external_links": "count"
  }
}
```

**Aggregate SEO Score Calculation**:
- Meta tags present: +20 points
- Proper heading structure: +15 points
- Image alt optimization: +15 points
- Schema markup: +10 points
- Mobile optimization: +15 points
- Page speed (from PageSpeed): +25 points
= **Total: /100**

---

### 3. Content & Conversion Analysis (Firecrawl)

**For Homepage Specifically**:
```json
{
  "value_proposition": {
    "headline": "H1 or prominent text",
    "clarity_score": 0-100,
    "benefit_focused": true/false,
    "unique": true/false
  },
  "services_products": {
    "clearly_listed": true/false,
    "count": "number",
    "pricing_visible": true/false
  },
  "calls_to_action": {
    "primary_cta": "text content",
    "cta_count": "number",
    "cta_placement": "above fold | below fold",
    "cta_clarity": "Book Now | Contact | Vague"
  },
  "trust_signals": {
    "testimonials_present": true/false,
    "case_studies": true/false,
    "certifications": ["list"],
    "awards": ["list"],
    "guarantees": "content | MISSING",
    "privacy_policy": true/false,
    "terms_of_service": true/false
  },
  "contact_options": {
    "phone_visible": true/false,
    "phone_clickable": true/false,
    "email_visible": true/false,
    "contact_form": true/false,
    "chat_widget": true/false,
    "booking_system": "Calendly | Custom | None"
  },
  "content_marketing": {
    "blog_exists": true/false,
    "last_post_date": "YYYY-MM-DD | Never",
    "post_frequency": "Weekly | Monthly | Rare",
    "content_count": "number"
  }
}
```

---

### 4. Social Proof & Authority (Apify)

**Execution Script**: `execution/analyze_social_presence.py`

**Data to Extract**:
```json
{
  "google_my_business": {
    "listing_exists": true/false,
    "rating": 0.0-5.0,
    "review_count": "number",
    "total_reviews": "number",
    "response_rate": "percentage"
  },
  "facebook": {
    "page_exists": true/false,
    "likes": "number",
    "followers": "number",
    "check_ins": "number",
    "rating": 0.0-5.0,
    "review_count": "number"
  },
  "linkedin": {
    "company_page": true/false,
    "followers": "number",
    "employees_listed": "number"
  },
  "instagram": {
    "profile_exists": true/false,
    "followers": "number",
    "posts": "number",
    "engagement_rate": "percentage (if calculable)"
  },
  "aggregate_social_score": {
    "total_reviews": "sum across platforms",
    "average_rating": "weighted average",
    "total_followers": "sum",
    "social_presence_score": 0-100
  }
}
```

**Social Score Calculation**:
- Has Google My Business: +25 points
- Reviews > 10: +15 points
- Average rating > 4.0: +20 points
- Active Facebook page: +15 points
- LinkedIn company page: +10 points
- Instagram presence: +15 points
= **Total: /100**

---

### 5. Competitive Intelligence (Apify)

**Execution Script**: `execution/scrape_apify_parallel.py` (enhanced)

**Process**:
1. Detect business industry from homepage content
2. Search Google for "{industry} {location}"
3. Identify top 3 competitors (exclude client)
4. For each competitor, extract same data as above

**Competitor Comparison Matrix**:
```json
{
  "client": { /* all data */ },
  "competitor_1": {
    "business_name": "string",
    "website": "URL",
    "google_rating": 0.0-5.0,
    "review_count": "number",
    "estimated_traffic": "Low | Medium | High",
    "tech_stack": "string",
    "page_speed_score": 0-100,
    "social_followers": "number"
  },
  "competitor_2": { /* same structure */ },
  "competitor_3": { /* same structure */ },
  "competitive_analysis": {
    "client_rank": "1-4",
    "gaps": ["list of areas where competitors win"],
    "advantages": ["list of areas where client wins"],
    "avg_competitor_score": 0-100
  }
}
```

---

### 6. Revenue Impact Calculation (Deterministic Logic)

**Formula-Based Estimation**:

```javascript
// Industry average conversion rates
const conversionRates = {
  "default": 0.02,  // 2%
  "ecommerce": 0.03,
  "services": 0.025,
  "saas": 0.04
};

// Estimate monthly traffic from SEO score
const estimatedMonthlyTraffic = {
  "0-30": 100,
  "31-50": 500,
  "51-70": 2000,
  "71-85": 5000,
  "86-100": 10000
};

// Calculate revenue leak
const currentScore = analysisData.seoPerformance.score;
const competitorAvgScore = competitiveData.avg_competitor_score;
const gap = competitorAvgScore - currentScore;

const clientTraffic = estimatedMonthlyTraffic[scoreRange(currentScore)];
const competitorTraffic = estimatedMonthlyTraffic[scoreRange(competitorAvgScore)];
const trafficLeak = competitorTraffic - clientTraffic;

const avgLeadValue = 500; // Industry default, can be customized
const conversionRate = conversionRates[industry] || conversionRates.default;

const monthlyRevenueLeak = trafficLeak * conversionRate * avgLeadValue;
```

**Output**:
```json
{
  "revenue_impact": {
    "estimated_monthly_traffic": "number",
    "competitor_avg_traffic": "number",
    "traffic_gap": "number (negative if behind)",
    "estimated_conversion_rate": "percentage",
    "avg_lead_value": "$XX",
    "monthly_revenue_leak": "$X,XXX",
    "annual_opportunity": "$XX,XXX"
  }
}
```

---

## Output Format

### Structured Analysis Object

```json
{
  "overall_score": 0-100,
  "category_scores": {
    "website_quality": { "score": 0-100, "issues": [], "strengths": [] },
    "seo_performance": { "score": 0-100, "issues": [], "strengths": [] },
    "social_authority": { "score": 0-100, "issues": [], "strengths": [] },
    "competitive_position": { "score": 0-100, "issues": [], "strengths": [] },
    "conversion_optimization": { "score": 0-100, "issues": [], "strengths": [] }
  },
  "technical_data": { /* from section 1 */ },
  "seo_data": { /* from section 2 */ },
  "content_data": { /* from section 3 */ },
  "social_data": { /* from section 4 */ },
  "competitive_data": { /* from section 5 */ },
  "revenue_impact": { /* from section 6 */ },
  "recommendations": [
    {
      "title": "string",
      "description": "persuasive copy with urgency",
      "impact": "High | Medium | Low",
      "effort": "High | Medium | Low",
      "priority": 1-10,
      "estimated_value": "$X,XXX monthly"
    }
  ],
  "metadata": {
    "generated_at": "ISO timestamp",
    "apis_used": ["Firecrawl", "Apify", "PageSpeed"],
    "pages_analyzed": "number",
    "completeness": 0-100,
    "confidence": "High | Medium | Low"
  }
}
```

---

## Persuasive Language Templates

### Pain Amplification
- "Your competitors are capturing **{X}%** more search traffic"
- "You're losing approximately **${revenue_leak}** monthly to better-optimized competitors"
- "**{missing_feature}** is costing you an estimated **{count}** leads per month"

### Urgency Creation
- "Every day without optimization costs **${daily_cost}**"
- "Your top competitor is **{weeks}** weeks ahead in SEO"
- "**{percentage}%** of consumers will choose competitors with higher ratings"

### Authority Positioning
- "Based on analysis of **500+** businesses in {industry}..."
- "Industry benchmark data shows **{metric}** performs **{X}%** better"
- "Businesses with **{score_range}** scores typically achieve **{result}**"

### Solution Teasing
- "Fixing these **{count}** critical gaps could increase conversions by **{percentage}%**"
- "Implementing **{recommendation}** typically yields **{ROI}** return within **{timeframe}**"
- "Our analysis identified **${opportunity}** in untapped revenue potential"

---

## Success Criteria

A complete analysis should:
- ✅ Extract data from **5-10 website pages**
- ✅ Identify and analyze **3 local competitors**
- ✅ Aggregate social presence from **3+ platforms**
- ✅ Calculate **quantified revenue impact**
- ✅ Generate **15-20 prioritized recommendations**
- ✅ Achieve **85%+ completeness score**
- ✅ Include **persuasive copy** throughout
- ✅ Enable PDF generation with **all visualizations**

---

## Error Handling

### If Firecrawl Fails:
- Fallback to basic `curl` scraping for homepage only
- Mark completeness as "Low" (30%)
- Show limitation in metadata

### If Apify Fails:
- Skip competitor analysis
- Use generic industry benchmarks
- Mark "Competitor data unavailable"

### If PageSpeed Fails:
- Use Firecrawl performance hints
- Estimate based on page size/requests
- Show "Performance estimates only"

---

## Orchestration Notes

This directive should be orchestrated by `/src/app/api/analyze/route.ts` which:
1. Calls Firecrawl for multi-page scan
2. Calls PageSpeed for performance
3. Executes `analyze_social_presence.py` via Node child process
4. Executes enhanced `scrape_apify_parallel.py` for competitors
5. Aggregates all data
6. Calculates scores and revenue impact
7. Generates persuasive recommendations
8. Returns structured JSON for PDF generation
