// Shared TypeScript types for analysis data across the application

export interface CategoryScore {
    score: number;
    label: string;
    issues: string[];
    strengths: string[];
}

export interface Recommendation {
    title: string;
    description: string;
    impact: 'High' | 'Medium' | 'Low';
    effort: 'High' | 'Medium' | 'Low';
    priority: number;
}

export interface AnalysisMetadata {
    generatedAt: string;
    apiSources: string[];
    dataPoints: number;
    completeness: number; // 0-100
    confidence: 'High' | 'Medium' | 'Low';
    limitations: string[];
}

export interface PageSpeedMetrics {
    performanceScore: number;
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    totalBlockingTime: number;
    cumulativeLayoutShift: number;
    speedIndex: number;
}

export interface PageSpeedResponse {
    lighthouseResult: {
        categories: {
            performance: {
                score: number;
            };
        };
        audits: {
            'first-contentful-paint': {
                displayValue: string;
                numericValue: number;
            };
            'largest-contentful-paint': {
                displayValue: string;
                numericValue: number;
            };
            'total-blocking-time': {
                displayValue: string;
                numericValue: number;
            };
            'cumulative-layout-shift': {
                displayValue: string;
                numericValue: number;
            };
            'speed-index': {
                displayValue: string;
                numericValue: number;
            };
        };
    };
}

export interface SocialPlatformMetrics {
    followers?: number;
    reviewsCount?: number;
    rating?: number;
    posts?: number;
    [key: string]: any; // Allow other properties
}

export interface AnalysisData {
    // Overall
    score: number;

    // Legacy fields (for backward compatibility)
    techStack: string;
    businessType: string;
    services: string[];
    location?: string;
    inferredPainPoints: string[];
    competitorGap: string;
    hasSocialProof?: boolean;
    hasClearCTA?: boolean;

    // Enhanced multi-category analysis
    categoryScores?: {
        websiteQuality: CategoryScore;
        seoPerformance: CategoryScore;
        socialMedia: CategoryScore;
        competitive: CategoryScore;
        performance?: CategoryScore; // Optional, only when PageSpeed API is enabled
    };

    // Performance metrics (PageSpeed Insights data)
    performanceMetrics?: PageSpeedMetrics;

    revenueImpact?: {
        estimatedMonthlyTraffic: number;
        competitorAvgTraffic: number;
        trafficGap: number;
        estimatedConversionRate: number;
        avgLeadValue: number;
        monthlyRevenueLeak: number;
        annualOpportunity: number;
    };

    // Social media presence data
    socialData?: {
        google?: {
            rating: number;
            reviewCount: number;
            listingExists: boolean;
        };
        facebook?: {
            likes: number;
            followers: number;
            pageExists: boolean;
        };
        linkedin?: {
            followers: number;
            companyPage: boolean;
        };
        aggregateScore: number;
    };

    // Competitor Intelligence (from Python script)
    competitorIntelligence?: {
        competitors: Array<{
            name: string;
            website?: string;
            rating?: number;
            review_count?: number;
            estimated_seo_score?: number;
            rank?: number;
        }>;
        analysis: {
            avg_rating: number;
            avg_reviews: number;
            avg_seo_score: number;
            total_found: number;
        };
        error?: string;
    };

    // Social Presence Analysis (from TypeScript agent)
    socialPresenceAnalysis?: {
        business_name?: string;
        location?: string;
        analyzed_at?: string;
        platforms?: {
            google_business?: SocialPlatformMetrics;
            facebook?: SocialPlatformMetrics;
            linkedin?: SocialPlatformMetrics;
        };
        // Legacy fields for backward compatibility
        google_my_business?: SocialPlatformMetrics;
        facebook?: SocialPlatformMetrics;
        linkedin?: SocialPlatformMetrics;
        ai_analysis?: {
            strategic_brief?: string;
        };
        aggregate: {
            social_presence_score: number;
            total_reviews: number;
            average_rating: number;
            total_followers: number;
        };
        error?: string;
    };

    // Structured insights
    strengths?: string[];
    weaknesses?: string[];
    recommendations?: Recommendation[];

    // Multi-page crawl data
    allPagesData?: Array<{
        url: string;
        title: string;
        description: string;
        markdown: string;
    }>;

    // Metadata
    metadata?: AnalysisMetadata;

    // Debug Info
    debug?: any;
}

export interface EmailPayload {
    name: string;
    website: string;
    email: string;
    analysis: AnalysisData;
}

export interface AnalysisResponse {
    success: boolean;
    data?: AnalysisData;
    error?: string;
}
