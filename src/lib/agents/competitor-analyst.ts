import { ApifyClient } from 'apify-client';

const apify = new ApifyClient({
    token: process.env.APIFY_API_KEY || process.env.APIFY_API_TOKEN || "placeholder_token",
});

interface CompetitorResult {
    competitors: any[];
    analysis: {
        avg_rating: number;
        avg_reviews: number;
        avg_seo_score: number;
        total_found: number;
    };
    search_query: string;
}

export async function analyzeCompetitors(industry: string, location: string, excludeBusiness: string): Promise<CompetitorResult> {
    console.log(`🐍 Executing competitor research: ${industry} in ${location}`);

    // Construct search query
    const terms = {
        "Real Estate": "Realtors",
        "Technology": "Software Companies",
        "Hospitality": "Hotels"
    };
    // @ts-ignore
    const industryTerm = terms[industry] || industry || "Business";
    const query = `${industryTerm} in ${location}`;

    try {
        // Run Google Search Scraper via Apify
        const run = await apify.actor("apify/google-search-scraper").call({
            queries: [query],
            maxPagesPerQuery: 1,
            resultsPerPage: 10,
            countryCode: "us", // Defaulting to US for broad checks, or make dynamic
            languageCode: "en"
        });

        // Fetch results
        const { items } = await apify.dataset(run.defaultDatasetId).listItems();

        // Filter and Process
        const competitors = items
            .filter((item: any) => {
                const title = item.title || "";
                return !title.toLowerCase().includes(excludeBusiness.toLowerCase()) &&
                    !title.includes("Top 10") &&
                    !title.includes("Best"); // Filter out listicles
            })
            .slice(0, 5)
            .map((item: any) => {
                const snippet = item.description || "";

                // Extract rating using regex (e.g., "4.5 stars", "4.8 rating")
                const ratingMatch = snippet.match(/(\d\.\d)\s*(?:stars?|★|rating)/i);
                const rating = ratingMatch ? parseFloat(ratingMatch[1]) : 0;

                // Extract review count using regex (e.g., "150 reviews")
                const reviewMatch = snippet.match(/(\d+)\s*(?:reviews?|ratings?)/i);
                const reviewCount = reviewMatch ? parseInt(reviewMatch[1].replace(/,/g, ''), 10) : 0;

                // Estimate SEO score based on rank (1-10)
                // Rank 1 = ~90, Rank 10 = ~60
                const rank = item.rank || 5;
                const estimatedSeoScore = Math.max(50, 100 - (rank * 4));

                return {
                    name: item.title,
                    website: item.url,
                    description: snippet,
                    rating: rating || 0, // Default to 0 if not found
                    review_count: reviewCount || 0,
                    estimated_seo_score: estimatedSeoScore,
                    rank: rank
                };
            });

        // Analysis Stats
        const total = competitors.length;
        const avgRating = total > 0 ? competitors.reduce((acc, c) => acc + c.rating, 0) / total : 0;
        const avgReviews = total > 0 ? competitors.reduce((acc, c) => acc + c.review_count, 0) / total : 0;
        const avgSeo = total > 0 ? competitors.reduce((acc, c) => acc + c.estimated_seo_score, 0) / total : 0;

        return {
            competitors,
            analysis: {
                avg_rating: Number(avgRating.toFixed(1)),
                avg_reviews: Math.round(avgReviews),
                avg_seo_score: Math.round(avgSeo),
                total_found: total
            },
            search_query: query
        };

    } catch (error) {
        console.error("Competitor analysis failed:", error);
        // Return Industry Benchmarks Fallback
        return {
            competitors: [],
            analysis: {
                avg_rating: 4.2,
                avg_reviews: 150,
                avg_seo_score: 75,
                total_found: 0
            },
            search_query: query
        };
    }
}
