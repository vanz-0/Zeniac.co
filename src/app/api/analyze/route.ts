import { NextRequest, NextResponse } from 'next/server';
import { PageSpeedMetrics, AnalysisData } from '@/types/analysis';
import { getRecentAnalysis, saveAnalysisResult } from '@/lib/db-actions';

export const maxDuration = 60; // 60 seconds (requires Vercel Pro, but safe to include)
export const dynamic = 'force-dynamic';

// Constants for analysis
const CONVERSION_RATES: Record<string, number> = {
    "default": 0.02,
    "ecommerce": 0.03,
    "services": 0.025,
    "saas": 0.04,
    "hospitality": 0.03,
    "technology": 0.035,
    "home services": 0.02
};

const PAIN_POINTS_RULES = [
    { id: "seo", trigger: (md: string) => !md.includes("# ") || md.length < 500, label: "Critical SEO Gaps (Thin Content / No H1)" },
    { id: "speed", trigger: (md: string) => md.includes("wordpress") && md.includes("plugin"), label: "Potential CMS Bloat (Speed Risk)" },
    { id: "conversion", trigger: (md: string) => !/(book|start|contact|buy|get)/i.test(md), label: "Weak Conversion Paths (No Clear CTA)" },
    { id: "social", trigger: (md: string) => !/(review|testimonial|rated)/i.test(md), label: "Missing Social Proof" }
];

export async function POST(req: NextRequest) {
    try {
        const { url, userId, name, email } = await req.json(); // Added email
        console.log(`🔍 Received analysis request for: ${url} (User: ${name || 'Guest'})`);

        // 0. Check for recent analysis locally (Caching Layer - 10 Days)
        const cachedAnalysis = await getRecentAnalysis(url);
        if (cachedAnalysis) {
            console.log(`⚡ [CACHE HIT] Serving existing analysis for: ${url}`);
            return NextResponse.json({
                success: true,
                data: cachedAnalysis.report_data,
                _meta: { source: 'cache', timestamp: cachedAnalysis.created_at }
            });
        }
        console.log(`🆕 [CACHE MISS] Starting fresh scan via Modal for: ${url}`);

        // 1. Call Modal Endpoint (Autonomous)
        const MODAL_ENDPOINT = "https://merchzenith--analyze.modal.run";

        // Pass token_data if available (not accessible here on server unless passed from client)
        // For now, we assume client might pass it, or we rely on Modal to handle email without it (if implemented)
        // or we skip component-level email logic here.

        const modalResponse = await fetch(MODAL_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url, userId, name, email })
        });

        if (!modalResponse.ok) {
            throw new Error(`Modal API failed: ${modalResponse.statusText}`);
        }

        const modalResult = await modalResponse.json();
        if (!modalResult.success || !modalResult.data) {
            throw new Error(modalResult.error || "Modal returned invalid data");
        }

        const analysisData = modalResult.data;
        console.log("✅ Received data from Modal successfully");

        // 2. Patch Data (If Python results are missing frontend heuristics)
        const md = analysisData.allPagesData?.[0]?.markdown || "";
        const html = analysisData.allPagesData?.[0]?.html || "";

        if (!analysisData.businessType) analysisData.businessType = detectBusinessType(md);
        if (!analysisData.location) analysisData.location = detectLocation(md) || "United States";
        if (!analysisData.services || analysisData.services.length === 0) analysisData.services = extractServices(md);
        if (!analysisData.techStack) analysisData.techStack = detectTechStack(html);

        // Fill missing logic flags
        if (analysisData.competitorGap === undefined) analysisData.competitorGap = (analysisData.categoryScores?.competitive?.score || 50) < 50 ? "Significant" : "Moderate";
        if (analysisData.hasSocialProof === undefined) analysisData.hasSocialProof = md.toLowerCase().includes("review") || (analysisData.socialPresenceAnalysis?.aggregate?.total_reviews || 0) > 0;
        if (analysisData.hasClearCTA === undefined) analysisData.hasClearCTA = /(book|start|contact)/i.test(md);

        // 3. Return (Modal already saved to Supabase)
        return NextResponse.json({ success: true, data: analysisData });

    } catch (error: any) {
        console.error("Deep analysis/scaffold failed:", error);
        return NextResponse.json({
            success: false,
            error: error.message || "Analysis failed"
        }, { status: 500 });
    }
}

// ============================================================================
// HELPER FUNCTIONS (Preserved from original implementation)
// ============================================================================

function extractServices(md: string): string[] {
    const lines = md.split('\n');
    const potentialServices = lines
        .filter(l => l.trim().startsWith('-') || l.trim().startsWith('*'))
        .filter(l => l.length < 50 && l.length > 5)
        .map(l => l.replace(/[-*]/g, '').trim())
        .slice(0, 5);
    return potentialServices.length > 0 ? potentialServices : ["Consulting", "Service Delivery"];
}

function detectBusinessType(md: string): string {
    if (md.includes("restaurant") || md.includes("menu")) return "Hospitality";
    if (md.includes("saas") || md.includes("software")) return "Technology";
    if (md.includes("plumbing") || md.includes("repair")) return "Home Services";
    return "Service Business";
}

function detectLocation(md: string): string | null {
    const match = md.match(/in ([A-Z][a-z]+, [A-Z]{2})/);
    return match ? match[1] : null;
}

function detectTechStack(html: string): string {
    if (html.includes("wp-content")) return "WordPress";
    if (html.includes("__NEXT_DATA__")) return "Next.js";
    if (html.includes("shopify")) return "Shopify";
    if (html.includes("wix")) return "Wix";
    return "Custom HTML";
}

// Traffic estimation based on SEO performance
function estimateMonthlyTraffic(seoScore: number): number {
    if (seoScore >= 86) return 10000;
    if (seoScore >= 71) return 5000;
    if (seoScore >= 51) return 2000;
    if (seoScore >= 31) return 500;
    return 100;
}

// Calculate revenue impact
function calculateRevenueImpact(clientSeoScore: number, competitorAvgScore: number, businessType: string): any {
    const clientTraffic = estimateMonthlyTraffic(clientSeoScore);
    const competitorTraffic = estimateMonthlyTraffic(competitorAvgScore);
    const trafficGap = competitorTraffic - clientTraffic;

    const conversionRate = CONVERSION_RATES[businessType.toLowerCase()] || CONVERSION_RATES.default;
    const avgLeadValue = 500;

    const monthlyRevenueLeak = Math.max(0, trafficGap * conversionRate * avgLeadValue);
    const annualOpportunity = monthlyRevenueLeak * 12;

    return {
        estimatedMonthlyTraffic: clientTraffic,
        competitorAvgTraffic: competitorTraffic,
        trafficGap,
        estimatedConversionRate: conversionRate,
        avgLeadValue,
        monthlyRevenueLeak: Math.round(monthlyRevenueLeak),
        annualOpportunity: Math.round(annualOpportunity)
    };
}

function calculateWebsiteQuality(md: string, html: string) {
    let score = 50;
    const issues: string[] = [];
    const strengths: string[] = [];

    if (md.length > 2000) {
        score += 15;
        strengths.push("Rich content");
    } else {
        issues.push("Thin content (< 2000 characters)");
    }

    if (html.includes("img") || md.includes("![")) {
        score += 10;
        strengths.push("Visual content present");
    } else {
        issues.push("Missing visual elements");
    }

    if (md.includes("# ")) {
        score += 10;
        strengths.push("Good heading structure");
    } else {
        issues.push("Missing H1 headings");
    }

    if (html.includes("viewport") || html.includes("responsive")) {
        score += 10;
        strengths.push("Mobile-optimized");
    } else {
        issues.push("Mobile optimization unclear");
    }

    return {
        score: Math.min(score, 95),
        label: "Website Quality",
        issues,
        strengths
    };
}

function calculateSEOPerformance(md: string, html: string) {
    let score = 40;
    const issues: string[] = [];
    const strengths: string[] = [];

    if (html.includes("<meta") && html.includes("description")) {
        score += 20;
        strengths.push("Meta descriptions present");
    } else {
        issues.push("Missing meta descriptions");
    }

    if (md.includes("# ")) {
        score += 15;
        strengths.push("H1 tags present");
    } else {
        issues.push("Missing H1 tags");
    }

    if (md.includes("[") || html.includes("<a")) {
        score += 10;
        strengths.push("Internal linking");
    } else {
        issues.push("Limited internal links");
    }

    if (md.length > 3000) {
        score += 10;
        strengths.push("Comprehensive content");
    } else {
        issues.push("Short content (SEO disadvantage)");
    }

    return {
        score: Math.min(score, 95),
        label: "SEO Performance",
        issues,
        strengths
    };
}

function calculateSocialMediaPresence(md: string, reviews: string[] = []) {
    let score = 30;
    const issues: string[] = [];
    const strengths: string[] = [];

    const socialPlatforms = ["facebook", "twitter", "instagram", "linkedin", "youtube"];
    const foundPlatforms = socialPlatforms.filter(platform => md.toLowerCase().includes(platform));

    score += foundPlatforms.length * 15;

    if (foundPlatforms.length > 0) {
        strengths.push(`Active on: ${foundPlatforms.join(", ")}`);
    } else {
        issues.push("No social media presence detected");
    }

    if (/(review|testimonial|rated)/i.test(md) || reviews.length > 0) {
        score += 20;
        strengths.push(reviews.length > 0 ? `Detected ${reviews.length} external reviews` : "On-site social proof detected");
    } else {
        issues.push("Missing social proof/reviews");
    }

    return {
        score: Math.min(score, 95),
        label: "Social Media Presence",
        issues,
        strengths
    };
}

function calculateCompetitivePosition(md: string, competitors: string[] = []) {
    let score = 45;
    const issues: string[] = [];
    const strengths: string[] = [];

    if (/(award|certified|trusted|leader)/i.test(md)) {
        score += 20;
        strengths.push("Brand authority indicators");
    } else {
        issues.push("Limited brand authority signals");
    }

    if (competitors.length > 0) {
        score += 10;
        strengths.push(`Market awareness: Identified ${competitors.length} competitors`);
    }

    if (/(unique|exclusive|only|first)/i.test(md)) {
        score += 15;
        strengths.push("Distinct positioning");
    } else {
        issues.push("Generic positioning");
    }

    if (/(book|contact|start|get started|schedule)/i.test(md)) {
        score += 10;
        strengths.push("Clear CTA");
    } else {
        issues.push("Weak call-to-action");
    }

    return {
        score: Math.min(score, 95),
        label: "Competitive Position",
        issues,
        strengths
    };
}

function calculatePerformanceScore(performanceData: PageSpeedMetrics | null) {
    if (!performanceData) {
        return {
            score: 0,
            label: "Performance",
            issues: ["PageSpeed API not configured"],
            strengths: []
        };
    }

    const issues: string[] = [];
    const strengths: string[] = [];
    let score = performanceData.performanceScore;
    const lcpSeconds = performanceData.largestContentfulPaint / 1000;
    const fcpSeconds = performanceData.firstContentfulPaint / 1000;
    const cls = performanceData.cumulativeLayoutShift;

    if (lcpSeconds <= 2.5) strengths.push(`Excellent LCP (${lcpSeconds.toFixed(1)}s)`);
    else if (lcpSeconds > 4) issues.push(`Poor LCP (${lcpSeconds.toFixed(1)}s) - needs optimization`);

    if (fcpSeconds <= 1.8) strengths.push(`Fast FCP (${fcpSeconds.toFixed(1)}s)`);
    else if (fcpSeconds > 3) issues.push(`Slow FCP (${fcpSeconds.toFixed(1)}s)`);

    if (cls <= 0.1) strengths.push("Stable visual layout");
    else if (cls > 0.25) issues.push(`High layout shift (${cls.toFixed(2)})`);

    return {
        score: Math.min(score, 95),
        label: "Performance",
        issues,
        strengths
    };
}

function generateRecommendations(websiteScore: number, seoScore: number, socialScore: number, competitiveScore: number, performanceScore: number = 0) {
    const recommendations = [];

    if (seoScore < 40) {
        recommendations.push({
            title: "SEO Emergency Overhaul",
            description: "Implement meta tags, fix heading structure, and optimize content for search engines immediately.",
            impact: "High" as const,
            effort: "Medium" as const,
            priority: 1
        });
    }

    if (websiteScore < 40) {
        recommendations.push({
            title: "Website Redesign",
            description: "Modernize design, improve UX, and enhance mobile responsiveness to reduce bounce rate.",
            impact: "High" as const,
            effort: "High" as const,
            priority: 2
        });
    }

    if (socialScore < 60) {
        recommendations.push({
            title: "Social Media Strategy",
            description: "Establish presence on key platforms and integrate social proof elements on website.",
            impact: "Medium" as const,
            effort: "Low" as const,
            priority: 3
        });
    }

    if (competitiveScore < 60) {
        recommendations.push({
            title: "Competitive Differentiation",
            description: "Develop unique value propositions and strengthen brand positioning against competitors.",
            impact: "High" as const,
            effort: "Medium" as const,
            priority: 4
        });
    }

    if (performanceScore > 0 && performanceScore < 60) {
        recommendations.push({
            title: "Performance Optimization",
            description: "Improve page speed, optimize Core Web Vitals, and enhance user experience through faster load times.",
            impact: "High" as const,
            effort: "Medium" as const,
            priority: recommendations.length + 1
        });
    }

    recommendations.push({
        title: "Continuous Optimization",
        description: "Implement analytics tracking and regular performance monitoring to identify opportunities.",
        impact: "Medium" as const,
        effort: "Low" as const,
        priority: 5
    });

    return recommendations.slice(0, 5);
}

function extractStrengths(websiteScore: any, seoScore: any, socialScore: any, competitiveScore: any) {
    return [
        ...websiteScore.strengths,
        ...seoScore.strengths,
        ...socialScore.strengths,
        ...competitiveScore.strengths
    ];
}

function extractWeaknesses(websiteScore: any, seoScore: any, socialScore: any, competitiveScore: any) {
    return [
        ...websiteScore.issues,
        ...seoScore.issues,
        ...socialScore.issues,
        ...competitiveScore.issues
    ];
}
