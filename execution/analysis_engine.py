import re
from datetime import datetime

def calculate_website_quality(md: str, html: str):
    score = 50
    issues = []
    strengths = []

    if len(md) > 2000:
        score += 15
        strengths.append("Rich content")
    else:
        issues.append("Thin content (< 2000 characters)")

    if "img" in html or "![" in md:
        score += 10
        strengths.append("Visual content present")
    else:
        issues.append("Missing visual elements")

    if "# " in md:
        score += 10
        strengths.append("Good heading structure")
    else:
        issues.append("Missing H1 headings")

    if "viewport" in html or "responsive" in html:
        score += 10
        strengths.append("Mobile-optimized")
    else:
        issues.append("Mobile optimization unclear")

    return {
        "score": min(score, 95),
        "label": "Website Quality",
        "issues": issues,
        "strengths": strengths
    }

def calculate_seo_performance(md: str, html: str):
    score = 40
    issues = []
    strengths = []

    if "<meta" in html and "description" in html:
        score += 20
        strengths.append("Meta descriptions present")
    else:
        issues.append("Missing meta descriptions")

    if "# " in md:
        score += 15
        strengths.append("H1 tags present")
    else:
        issues.append("Missing H1 tags")

    if "[" in md or "<a" in html:
        score += 10
        strengths.append("Internal linking")
    else:
        issues.append("Limited internal links")

    if len(md) > 3000:
        score += 10
        strengths.append("Comprehensive content")
    else:
        issues.append("Short content (SEO disadvantage)")

    return {
        "score": min(score, 95),
        "label": "SEO Performance",
        "issues": issues,
        "strengths": strengths
    }

def construct_analysis_data(url: str, business_name: str, firecrawl_data: dict, social_data: dict, pagespeed_data: dict):
    # Extract primary page content
    pages = firecrawl_data.get('data', [])
    primary = pages[0] if pages else {}
    md = primary.get('markdown', '')
    html = primary.get('html', '')
    
    # Run analysis
    website_score = calculate_website_quality(md, html)
    seo_score = calculate_seo_performance(md, html)
    
    # Social Score
    social_agg = social_data.get('aggregate', {})
    social_score_val = social_agg.get('social_presence_score', 30)
    social_score = {
        "score": social_score_val,
        "label": "Social Media Presence",
        "issues": ["No reviews found"] if social_agg.get('total_reviews', 0) == 0 else [],
        "strengths": [f"{social_agg.get('total_reviews', 0)} total reviews"] if social_agg.get('total_reviews', 0) > 10 else []
    }

    # Performance Score
    perf_metrics = pagespeed_data.get('metrics', {})
    perf_val = pagespeed_data.get('performance_score', 0)
    perf_score = {
        "score": perf_val,
        "label": "Performance",
        "issues": ["Slow LCP"] if perf_metrics.get('lcp', 0) > 2500 else [],
        "strengths": ["Fast Load"] if perf_metrics.get('lcp', 0) < 2500 and perf_val > 0 else []
    }

    # Competitive (Placeholder logic for now)
    comp_score = {
        "score": 45,
        "label": "Competitive Position",
        "issues": ["Generic positioning"],
        "strengths": []
    }
    
    # Overall
    scores = [website_score['score'], seo_score['score'], social_score_val, comp_score['score']]
    if perf_val > 0:
        scores.append(perf_val)
    overall_score = round(sum(scores) / len(scores))

    # Recommendations
    recommendations = []
    if seo_score['score'] < 50:
        recommendations.append({"title": "SEO Emergency Overhaul", "description": "Fix meta tags and heading structure."})
    if website_score['score'] < 50:
        recommendations.append({"title": "Website Redesign", "description": "Modernize design and improve UX."})
    if social_score_val < 50:
        recommendations.append({"title": "Social Media Strategy", "description": "Establish presence on key platforms."})
        
    # Revenue Impact (Simplified)
    revenue_impact = {
        "monthlyRevenueLeak": 1000 if overall_score < 70 else 0,
        "annualOpportunity": 12000 if overall_score < 70 else 0,
        "trafficGap": 1000,
        "estimatedMonthlyTraffic": 500,
        "competitorAvgTraffic": 1500
    }

    return {
        "url": url,
        "businessName": business_name,
        "score": overall_score,
        "techStack": "Detected via Analysis", # Placeholder
        "allPagesData": firecrawl_data.get('data', [])[:10],
        "categoryScores": {
            "websiteQuality": website_score,
            "seoPerformance": seo_score,
            "socialMedia": social_score,
            "competitive": comp_score,
            "performance": perf_score
        },
        "performanceMetrics": {
            "performanceScore": perf_val,
            "largestContentfulPaint": perf_metrics.get('lcp', 0),
            "firstContentfulPaint": perf_metrics.get('fcp', 0),
            "cumulativeLayoutShift": perf_metrics.get('cls', 0)
        },
        "socialPresenceAnalysis": social_data,
        "revenueImpact": revenue_impact,
        "strengths": website_score['strengths'] + seo_score['strengths'],
        "weaknesses": website_score['issues'] + seo_score['issues'],
        "recommendations": recommendations,
        "metadata": {
            "generatedAt": datetime.now().isoformat()
        }
    }
