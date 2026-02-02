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

    // Performance metrics (from PageSpeed Insights API)
    performanceMetrics?: {
        performanceScore: number;
        firstContentfulPaint: number;
        largestContentfulPaint: number;
        totalBlockingTime: number;
        cumulativeLayoutShift: number;
        speedIndex: number;
    };

    // Revenue Impact Analysis
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

    // Social Presence Analysis (from Python script)
    socialPresenceAnalysis?: {
        google_my_business?: any;
        facebook?: any;
        linkedin?: any;
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

    // Metadata
    metadata?: AnalysisMetadata;
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
