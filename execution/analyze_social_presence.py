#!/usr/bin/env python3
"""
Social Media Presence Analyzer
Aggregates social proof metrics from Google My Business, Facebook, and LinkedIn using Apify.
Part of the Zeniac.Co DOE Framework - Layer 3 (Execution).
"""

import os
import sys
import json
import argparse
from datetime import datetime
from dotenv import load_dotenv
from apify_client import ApifyClient

# Load environment variables
load_dotenv()

def analyze_google_my_business(business_name, location):
    """
    Scrape Google My Business listing data.
    Uses Apify's Google Maps scraper.
    """
    api_token = os.getenv("APIFY_API_TOKEN")
    if not api_token:
        print("Warning: APIFY_API_TOKEN not found", file=sys.stderr)
        return None

    client = ApifyClient(api_token)
    
    search_query = f"{business_name} {location}"
    
    run_input = {
        "searchStringsArray": [search_query],
        "maxCrawledPlacesPerSearch": 1,
        "language": "en",
        "includeReviews": True,
        "maxReviews": 0  # Just get rating stats, not full reviews
    }

    try:
        print(f"Searching Google My Business for: {search_query}")
        run = client.actor("compass/crawler-google-places").call(run_input=run_input)
        
        results = list(client.dataset(run["defaultDatasetId"]).iterate_items())
        
        if results:
            place = results[0]
            return {
                "listing_exists": True,
                "rating": place.get("totalScore", 0),
                "review_count": place.get("reviewsCount", 0),
                "category": place.get("categoryName", ""),
                "address": place.get("address", ""),
                "phone": place.get("phone", ""),
                "website": place.get("website", "")
            }
    except Exception as e:
        print(f"Google My Business scrape failed: {e}", file=sys.stderr)
    
    return {
        "listing_exists": False,
        "rating": 0,
        "review_count": 0
    }

def analyze_facebook_page(business_name):
    """
    Scrape Facebook Business Page metrics.
    Uses Apify's Facebook Pages Scraper.
    """
    api_token = os.getenv("APIFY_API_TOKEN")
    if not api_token:
        return None

    client = ApifyClient(api_token)
    
    # Search for the business page
    # Note: This is a simplified version - you may need to find the exact page URL first
    # For now, return mock structure
    print(f"Searching Facebook for: {business_name}")
    
    # TODO: Implement actual Facebook scraping once Apify actor is configured
    # For now, return structure
    return {
        "page_exists": False,
        "likes": 0,
        "followers": 0,
        "check_ins": 0,
        "rating": 0,
        "review_count": 0
    }

def analyze_linkedin_company(business_name):
    """
    Scrape LinkedIn Company Page data.
    Uses Apify's LinkedIn Company Scraper.
    """
    api_token = os.getenv("APIFY_API_TOKEN")
    if not api_token:
        return None

    client = ApifyClient(api_token)
    
    print(f"Searching LinkedIn for: {business_name}")
    
    # TODO: Implement LinkedIn scraping once Apify actor is configured
    # For now, return structure
    return {
        "company_page": False,
        "followers": 0,
        "employees_listed": 0
    }

def calculate_social_score(google_data, facebook_data, linkedin_data):
    """
    Calculate aggregate social presence score (0-100).
    """
    score = 0
    
    # Google My Business (50 points max)
    if google_data and google_data.get("listing_exists"):
        score += 25  # Has listing
        
        rating = google_data.get("rating", 0)
        review_count = google_data.get("review_count", 0)
        
        if review_count > 10:
            score += 10
        elif review_count > 0:
            score += 5
            
        if rating >= 4.5:
            score += 15
        elif rating >= 4.0:
            score += 10
        elif rating >= 3.5:
            score += 5
    
    # Facebook (25 points max)
    if facebook_data and facebook_data.get("page_exists"):
        score += 10  # Has page
        
        likes = facebook_data.get("likes", 0)
        if likes > 1000:
            score += 15
        elif likes > 100:
            score += 10
        elif likes > 0:
            score += 5
    
    # LinkedIn (25 points max)
    if linkedin_data and linkedin_data.get("company_page"):
        score += 10  # Has company page
        
        followers = linkedin_data.get("followers", 0)
        if followers > 500:
            score += 15
        elif followers > 100:
            score += 10
        elif followers > 0:
            score += 5
    
    return min(score, 100)

def analyze_social_presence(business_name, location=""):
    """
    Main function to aggregate all social media data.
    """
    print(f"\n🔍 Analyzing social presence for: {business_name}")
    print("=" * 60)
    
    # Collect data from each platform
    google_data = analyze_google_my_business(business_name, location)
    facebook_data = analyze_facebook_page(business_name)
    linkedin_data = analyze_linkedin_company(business_name)
    
    # Calculate aggregate score
    social_score = calculate_social_score(google_data, facebook_data, linkedin_data)
    
    # Aggregate metrics
    total_reviews = 0
    total_followers = 0
    ratings = []
    
    if google_data:
        total_reviews += google_data.get("review_count", 0)
        if google_data.get("rating", 0) > 0:
            ratings.append(google_data["rating"])
    
    if facebook_data:
        total_reviews += facebook_data.get("review_count", 0)
        total_followers += facebook_data.get("followers", 0)
        if facebook_data.get("rating", 0) > 0:
            ratings.append(facebook_data["rating"])
    
    if linkedin_data:
        total_followers += linkedin_data.get("followers", 0)
    
    avg_rating = sum(ratings) / len(ratings) if ratings else 0
    
    result = {
        "business_name": business_name,
        "location": location,
        "analyzed_at": datetime.now().isoformat(),
        "google_my_business": google_data,
        "facebook": facebook_data,
        "linkedin": linkedin_data,
        "aggregate": {
            "total_reviews": total_reviews,
            "average_rating": round(avg_rating, 2),
            "total_followers": total_followers,
            "social_presence_score": social_score
        }
    }
    
    return result

def save_results(results, output_file=None):
    """
    Save results to JSON file in .tmp directory.
    """
    if not output_file:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        business_name_slug = results["business_name"].lower().replace(" ", "_")[:30]
        output_file = f".tmp/social_analysis_{business_name_slug}_{timestamp}.json"
    
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    
    with open(output_file, "w") as f:
        json.dump(results, f, indent=2)
    
    print(f"\n✅ Results saved to: {output_file}")
    return output_file

def main():
    parser = argparse.ArgumentParser(
        description="Analyze social media presence across multiple platforms"
    )
    parser.add_argument("--business", required=True, help="Business name")
    parser.add_argument("--location", default="", help="Business location (city, state)")
    parser.add_argument("--output", help="Output file path (optional)")
    
    args = parser.parse_args()
    
    # Perform analysis
    results = analyze_social_presence(args.business, args.location)
    
    # Print summary
    print("\n" + "=" * 60)
    print("📊 Social Presence Summary")
    print("=" * 60)
    print(f"Overall Score: {results['aggregate']['social_presence_score']}/100")
    print(f"Total Reviews: {results['aggregate']['total_reviews']}")
    print(f"Average Rating: {results['aggregate']['average_rating']:.1f}/5.0")
    print(f"Total Social Followers: {results['aggregate']['total_followers']:,}")
    print("=" * 60)
    
    # Save to file
    output_file = save_results(results, args.output)
    
    # Return JSON to stdout for programmatic use
    print(json.dumps(results, indent=2))
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
