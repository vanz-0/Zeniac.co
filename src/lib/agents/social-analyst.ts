import { ApifyClient } from 'apify-client';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize clients
const apify = new ApifyClient({
    token: process.env.APIFY_API_KEY || process.env.APIFY_API_TOKEN,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

interface SocialData {
    listing_exists?: boolean;
    page_exists?: boolean;
    company_page?: boolean;
    rating?: number;
    review_count?: number;
    likes?: number;
    followers?: number;
    employees_listed?: number;
    [key: string]: any;
}

export async function analyzeSocialPresence(businessName: string, location: string = "") {
    console.log(`🔍 Analyzing social presence for: ${businessName}`);

    // Parallel execution for speed
    const [googleData, facebookData, linkedinData] = await Promise.all([
        analyzeGoogleMyBusiness(businessName, location),
        analyzeFacebookPage(businessName),
        analyzeLinkedinCompany(businessName)
    ]);

    // Calculate score
    const socialScore = calculateSocialScore(googleData, facebookData, linkedinData);

    // Aggregate metrics
    let totalReviews = (googleData?.review_count || 0) + (facebookData?.review_count || 0);
    let totalFollowers = (facebookData?.followers || 0) + (linkedinData?.followers || 0);

    // Calculate average rating
    const ratings = [];
    if (googleData?.rating) ratings.push(googleData.rating);
    if (facebookData?.rating) ratings.push(facebookData.rating);
    const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

    // Generate AI Intelligence
    const intelligence = await generateStrategicIntelligence({
        business: businessName,
        location,
        google: googleData,
        facebook: facebookData,
        linkedin: linkedinData,
        score: socialScore
    });

    return {
        business_name: businessName,
        location,
        analyzed_at: new Date().toISOString(),
        platforms: {
            google_business: googleData,
            facebook: facebookData,
            linkedin: linkedinData
        },
        ai_analysis: {
            strategic_brief: intelligence
        },
        aggregate: {
            social_presence_score: socialScore,
            total_reviews: totalReviews,
            average_rating: Number(avgRating.toFixed(2)),
            total_followers: totalFollowers
        }
    };
}

// --- Platform Specific Analyzers ---

async function analyzeGoogleMyBusiness(businessName: string, location: string): Promise<SocialData> {
    const query = `${businessName} ${location}`;
    try {
        const run = await apify.actor("compass/crawler-google-places").call({
            searchStringsArray: [query],
            maxCrawledPlacesPerSearch: 1,
            language: "en",
            includeReviews: true,
            maxReviews: 0
        });

        const { items } = await apify.dataset(run.defaultDatasetId).listItems();

        if (items && items.length > 0) {
            const place: any = items[0];
            return {
                listing_exists: true,
                rating: place.totalScore || 0,
                review_count: place.reviewsCount || 0,
                category: place.categoryName,
                address: place.address,
                phone: place.phone,
                website: place.website,
                title: place.title
            };
        }
    } catch (e) {
        console.warn("Google Maps scrape failed:", e);
    }
    return { listing_exists: false, rating: 0, review_count: 0 };
}

async function analyzeFacebookPage(businessName: string): Promise<SocialData> {
    // Simplified stub - mimicking the Python script's placeholder behavior
    // Real implementation would use apify/facebook-pages-scraper
    return {
        page_exists: false,
        likes: 0,
        followers: 0,
        check_ins: 0,
        rating: 0,
        review_count: 0
    };
}

async function analyzeLinkedinCompany(businessName: string): Promise<SocialData> {
    // Simplified stub
    return {
        company_page: false,
        followers: 0,
        employees_listed: 0
    };
}

// --- Scoring Logic ---

function calculateSocialScore(google: SocialData, facebook: SocialData, linkedin: SocialData): number {
    let score = 0;

    // Google (50 pts)
    if (google.listing_exists) {
        score += 25;
        if ((google.review_count || 0) > 10) score += 10;
        else if ((google.review_count || 0) > 0) score += 5;

        if ((google.rating || 0) >= 4.5) score += 15;
        else if ((google.rating || 0) >= 4.0) score += 10;
        else if ((google.rating || 0) >= 3.5) score += 5;
    }

    // Facebook (25 pts) - Placeholder logic matches Python script
    if (facebook.page_exists) {
        score += 10;
        if ((facebook.likes || 0) > 1000) score += 15;
        else if ((facebook.likes || 0) > 100) score += 10;
        else if ((facebook.likes || 0) > 0) score += 5;
    }

    // LinkedIn (25 pts)
    if (linkedin.company_page) {
        score += 10;
        if ((linkedin.followers || 0) > 500) score += 15;
        else if ((linkedin.followers || 0) > 100) score += 10;
        else if ((linkedin.followers || 0) > 0) score += 5;
    }

    return Math.min(score, 100);
}

// --- AI Intelligence ---

async function generateStrategicIntelligence(data: any): Promise<string> {
    if (!process.env.GEMINI_API_KEY) return "Gemini API Key missing.";

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `
        Analyze this social media presence data for a business and provide a 3-paragraph "Strategic Intelligence Brief".
        
        Data:
        ${JSON.stringify(data, null, 2)}
        
        Format your response as follows:
        1. CURRENT STATE: A blunt assessment of their visibility and dominance.
        2. THE GAP: What they are losing by not being number one in their local market.
        3. DOMINANCE PATH: 3 specific steps Zeniac should take to fix this.
        
        Tone: Professional, aggressive, strategic, and focused on "Dominance" and "Speed is Currency".
        `;

        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (e) {
        console.error("AI Generation failed:", e);
        return "AI Analysis unavailable.";
    }
}
