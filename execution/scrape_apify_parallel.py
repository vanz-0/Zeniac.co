#!/usr/bin/env python3
"""
Parallel lead scraping using Apify with geographic partitioning.
Splits by location to avoid extra Apify costs while maintaining speed.
"""

import os
import sys
import json
import argparse
from datetime import datetime
from dotenv import load_dotenv
from apify_client import ApifyClient
from concurrent.futures import ThreadPoolExecutor, as_completed
import hashlib
import time

# Load environment variables
load_dotenv()

# Geographic partitions (cost-neutral strategy)
# Each region map is mutually exclusive to avoid duplicate charges

# United States (4-way split)
US_REGIONS = {
    "northeast": ["Connecticut", "Maine", "Massachusetts", "New Hampshire", "Rhode Island",
                  "Vermont", "New Jersey", "New York", "Pennsylvania"],
    "southeast": ["Delaware", "Florida", "Georgia", "Maryland", "North Carolina",
                  "South Carolina", "Virginia", "West Virginia", "Alabama", "Kentucky",
                  "Mississippi", "Tennessee", "Arkansas", "Louisiana", "Oklahoma", "Texas"],
    "midwest": ["Illinois", "Indiana", "Michigan", "Ohio", "Wisconsin", "Iowa",
                "Kansas", "Minnesota", "Missouri", "Nebraska", "North Dakota", "South Dakota"],
    "west": ["Arizona", "Colorado", "Idaho", "Montana", "Nevada", "New Mexico", "Utah",
             "Wyoming", "Alaska", "California", "Hawaii", "Oregon", "Washington"]
}

# United States metros (8-way split)
US_METROS = [
    ["New York", "New Jersey", "Philadelphia", "Boston"],
    ["Los Angeles", "San Francisco", "San Diego", "San Jose"],
    ["Chicago", "Detroit", "Minneapolis", "Cleveland"],
    ["Dallas", "Houston", "Austin", "San Antonio"],
    ["Atlanta", "Miami", "Charlotte", "Tampa"],
    ["Phoenix", "Denver", "Las Vegas", "Seattle"],
    ["Washington DC", "Baltimore", "Virginia Beach"],
    ["Portland", "Sacramento", "Salt Lake City"]
]

# European Union (4-way split)
EU_REGIONS = {
    "western": ["Germany", "France", "Netherlands", "Belgium", "Luxembourg", "Austria", "Switzerland"],
    "southern": ["Spain", "Italy", "Portugal", "Greece", "Malta", "Cyprus"],
    "northern": ["Denmark", "Sweden", "Finland", "Norway", "Iceland", "Ireland"],
    "eastern": ["Poland", "Czech Republic", "Hungary", "Romania", "Bulgaria", "Slovakia",
                "Slovenia", "Croatia", "Estonia", "Latvia", "Lithuania"]
}

# United Kingdom (4-way split)
UK_REGIONS = {
    "england_southeast": ["London", "Kent", "Surrey", "Sussex", "Hampshire", "Berkshire", "Essex", "Hertfordshire"],
    "england_north": ["Manchester", "Liverpool", "Leeds", "Sheffield", "Newcastle", "Birmingham", "Nottingham"],
    "scotland_wales": ["Scotland", "Edinburgh", "Glasgow", "Wales", "Cardiff", "Swansea"],
    "england_southwest": ["Bristol", "Cornwall", "Devon", "Somerset", "Gloucestershire", "Dorset"]
}

# Canada (4-way split)
CANADA_REGIONS = {
    "ontario": ["Ontario", "Toronto", "Ottawa", "Mississauga", "Hamilton"],
    "quebec": ["Quebec", "Montreal", "Quebec City", "Laval", "Gatineau"],
    "west": ["British Columbia", "Alberta", "Saskatchewan", "Manitoba", "Vancouver", "Calgary", "Edmonton"],
    "atlantic": ["Nova Scotia", "New Brunswick", "Prince Edward Island", "Newfoundland and Labrador"]
}

# Australia (4-way split)
AUSTRALIA_REGIONS = {
    "nsw": ["New South Wales", "Sydney", "Newcastle", "Wollongong"],
    "victoria_tasmania": ["Victoria", "Melbourne", "Geelong", "Tasmania", "Hobart"],
    "queensland": ["Queensland", "Brisbane", "Gold Coast", "Sunshine Coast", "Cairns"],
    "west_south": ["Western Australia", "Perth", "South Australia", "Adelaide", "Northern Territory"]
}

# Asia-Pacific (8-way split)
APAC_REGIONS = [
    ["Japan", "Tokyo", "Osaka", "Kyoto"],
    ["South Korea", "Seoul", "Busan", "Incheon"],
    ["Singapore"],
    ["Hong Kong"],
    ["India", "Mumbai", "Delhi", "Bangalore", "Hyderabad"],
    ["China", "Beijing", "Shanghai", "Guangzhou", "Shenzhen"],
    ["Southeast Asia", "Thailand", "Vietnam", "Malaysia", "Indonesia", "Philippines"],
    ["Australia", "New Zealand"]
]

# Global/Worldwide (8-way continental split)
GLOBAL_REGIONS = [
    ["United States", "Canada", "Mexico"],
    ["United Kingdom", "Ireland", "France", "Germany", "Netherlands", "Belgium"],
    ["Spain", "Italy", "Portugal", "Greece", "Switzerland", "Austria"],
    ["Poland", "Czech Republic", "Hungary", "Romania", "Scandinavia"],
    ["Australia", "New Zealand", "Singapore", "Hong Kong"],
    ["India", "Pakistan", "Bangladesh"],
    ["China", "Japan", "South Korea", "Taiwan"],
    ["Brazil", "Argentina", "Chile", "Colombia", "Peru"]
]

# Region map lookup
REGION_MAPS = {
    "united states": US_REGIONS,
    "us": US_REGIONS,
    "usa": US_REGIONS,
    "european union": EU_REGIONS,
    "eu": EU_REGIONS,
    "europe": EU_REGIONS,
    "united kingdom": UK_REGIONS,
    "uk": UK_REGIONS,
    "great britain": UK_REGIONS,
    "canada": CANADA_REGIONS,
    "australia": AUSTRALIA_REGIONS,
}

def scrape_partition(partition_id, query, locations, max_items, company_keywords=None, require_email=False):
    """
    Run a single Apify scrape for specific locations.
    Returns (partition_id, results, elapsed_time).
    """
    start_time = time.time()

    api_token = os.getenv("APIFY_API_TOKEN")
    if not api_token:
        print(f"[Partition {partition_id}] Error: APIFY_API_TOKEN not found in .env", file=sys.stderr)
        return (partition_id, None, 0)

    client = ApifyClient(api_token)

    # Prepare the actor input
    # Convert locations to Apify's required format (e.g., "illinois, us" instead of "Illinois")
    formatted_locations = []
    for loc in locations:
        loc_lower = loc.lower()
        # Check if it's a US state (not already formatted as "state, us")
        if ", us" not in loc_lower and loc_lower not in ["united states", "canada", "australia", "uk", "united kingdom"]:
            # Assume it's a US state and format it
            loc_lower = f"{loc_lower}, us"
        formatted_locations.append(loc_lower)

    run_input = {
        "fetch_count": int(max_items),
        "contact_job_title": [query],
        "company_keywords": company_keywords if company_keywords else [query],
        "contact_location": formatted_locations,  # Multiple locations
        "language": "en",
    }

    if require_email:
        run_input["email_status"] = ["validated"]

    location_str = ", ".join(locations[:3]) + ("..." if len(locations) > 3 else "")
    print(f"[Partition {partition_id}] Starting scrape for '{query}' in [{location_str}] (Limit: {max_items})...")

    try:
        # Run the actor and wait for it to finish
        run = client.actor("code_crafter/leads-finder").call(run_input=run_input)
    except Exception as e:
        elapsed = time.time() - start_time
        print(f"[Partition {partition_id}] Error running actor: {e}")
        return (partition_id, None, elapsed)

    if not run:
        elapsed = time.time() - start_time
        print(f"[Partition {partition_id}] Error: Actor run failed to start", file=sys.stderr)
        return (partition_id, None, elapsed)

    print(f"[Partition {partition_id}] Scrape finished. Fetching results from dataset {run['defaultDatasetId']}...")

    # Fetch results from the actor's default dataset
    results = []
    for item in client.dataset(run["defaultDatasetId"]).iterate_items():
        results.append(item)

    elapsed = time.time() - start_time
    print(f"[Partition {partition_id}] Retrieved {len(results)} leads in {elapsed:.1f}s")
    return (partition_id, results, elapsed)

def generate_lead_hash(lead):
    """
    Generate a unique hash for a lead based on key identifiers.
    Used for deduplication.
    """
    # Use email as primary key, fallback to name+company+location
    email = lead.get("email") or ""
    email = email.strip().lower() if email else ""
    if email:
        return hashlib.md5(email.encode()).hexdigest()

    # Fallback: combine available identifiers
    identifiers = [
        (lead.get("first_name") or "").strip().lower(),
        (lead.get("last_name") or "").strip().lower(),
        (lead.get("full_name") or "").strip().lower(),
        (lead.get("company_name") or "").strip().lower(),
        (lead.get("company_domain") or "").strip().lower(),
        (lead.get("city") or "").strip().lower(),
        (lead.get("state") or "").strip().lower()
    ]

    combined = "|".join(filter(None, identifiers))
    return hashlib.md5(combined.encode()).hexdigest()

def deduplicate_leads(all_results):
    """
    Deduplicate leads across all partitions.
    Returns unique leads only.
    """
    seen_hashes = set()
    unique_leads = []
    duplicate_count = 0

    for lead in all_results:
        lead_hash = generate_lead_hash(lead)

        if lead_hash not in seen_hashes:
            seen_hashes.add(lead_hash)
            unique_leads.append(lead)
        else:
            duplicate_count += 1

    print(f"\nDeduplication complete:")
    print(f"  - Total leads collected: {len(all_results)}")
    print(f"  - Duplicates removed: {duplicate_count}")
    print(f"  - Unique leads: {len(unique_leads)}")

    return unique_leads

def scrape_parallel(query, location, total_count, strategy="regions", num_partitions=4, company_keywords=None, require_email=False):
    """
    Run parallel scrapes with geographic partitioning.

    Strategy Options:
    - "regions": Split by US regions (Northeast, Southeast, Midwest, West) - 4 partitions
    - "metros": Split by major metro areas - 8 partitions
    - "states": Provide your own list of states - custom partitions

    Args:
        query: Base search query
        location: Target location (must be "United States" for region/metro strategies)
        total_count: Total number of leads desired
        strategy: Partitioning strategy ("regions", "metros", "states")
        num_partitions: Number of parallel partitions (default 4)
        company_keywords: Company keywords to filter
        require_email: Whether to require validated emails

    Returns:
        (unique_leads, total_time, partition_times)
    """
    workflow_start = time.time()

    # Determine partition strategy
    if strategy == "regions":
        # Auto-detect region map based on location
        location_lower = location.lower() if isinstance(location, str) else None

        if location_lower in REGION_MAPS:
            # Use predefined region map
            region_map = REGION_MAPS[location_lower]
            location_groups = list(region_map.values())
            num_partitions = len(location_groups)
            print(f"  - Detected region: {location_lower.upper()} ({num_partitions}-way split)")
        else:
            # Default to US regions if ambiguous
            location_groups = list(US_REGIONS.values())
            num_partitions = 4
            print(f"  - No region map found for '{location}', defaulting to US regions")

    elif strategy == "metros":
        # Use US metros by default (could expand to other metros)
        location_groups = US_METROS[:num_partitions] if num_partitions else US_METROS
        num_partitions = len(location_groups)

    elif strategy == "apac":
        location_groups = APAC_REGIONS[:num_partitions] if num_partitions else APAC_REGIONS
        num_partitions = len(location_groups)

    elif strategy == "global":
        location_groups = GLOBAL_REGIONS[:num_partitions] if num_partitions else GLOBAL_REGIONS
        num_partitions = len(location_groups)

    elif isinstance(location, list):
        # Custom: user provided list of locations
        # Split into N groups
        if not num_partitions:
            num_partitions = 4
        chunk_size = max(1, len(location) // num_partitions)
        location_groups = [location[i:i + chunk_size] for i in range(0, len(location), chunk_size)]
    else:
        print(f"Error: For parallel scraping, use strategy='regions', or provide location as a list of states/cities")
        print(f"Supported locations for auto-regions: {', '.join(REGION_MAPS.keys())}")
        return None, 0, []

    items_per_partition = total_count // num_partitions

    print(f"Starting parallel scrape:")
    print(f"  - Total target: {total_count} leads")
    print(f"  - Partitions: {num_partitions}")
    print(f"  - Items per partition: {items_per_partition}")
    print(f"  - Strategy: {strategy.upper()} (geographic split)")
    print(f"  - Cost: SAME as sequential ({total_count} total leads)")
    print()

    # Execute partitions in parallel
    all_results = []
    partition_times = []

    with ThreadPoolExecutor(max_workers=num_partitions) as executor:
        # Submit all partition scrapes
        futures = []
        for i, locations in enumerate(location_groups[:num_partitions]):
            future = executor.submit(
                scrape_partition,
                partition_id=i + 1,
                query=query,
                locations=locations,
                max_items=items_per_partition,
                company_keywords=company_keywords,
                require_email=require_email
            )
            futures.append((future, i + 1, locations))

        # Collect results as they complete
        for future, partition_id, locations in futures:
            pid, results, elapsed = future.result()
            partition_times.append(elapsed)

            if results:
                location_str = ", ".join(locations[:2]) + ("..." if len(locations) > 2 else "")
                print(f"[Partition {pid}] ✅ Completed: {len(results)} leads from [{location_str}]")
                all_results.extend(results)
            else:
                print(f"[Partition {pid}] ❌ Failed or returned no results")

    if not all_results:
        print("\nNo results collected from any partition")
        return None, 0, partition_times

    # Deduplicate (in case leads appear in multiple geographic regions)
    unique_leads = deduplicate_leads(all_results)

    total_time = time.time() - workflow_start

    # Note: No trimming needed - we requested exactly what we wanted

    return unique_leads, total_time, partition_times

def save_results(results, prefix="leads"):
    """
    Save results to a JSON file in .tmp/ (temporary intermediates).
    """
    if not results:
        print("No results to save.")
        return None

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_dir = ".tmp"
    os.makedirs(output_dir, exist_ok=True)

    filename = f"{output_dir}/{prefix}_{timestamp}.json"

    with open(filename, "w") as f:
        json.dump(results, f, indent=2)

    print(f"\nResults saved to {filename}")
    return filename

def scrape_competitors(industry, location, exclude_business=None, max_competitors=3):
    """
    Find and analyze top local competitors.
    
    Args:
        industry: Business type (e.g., "Dentist", "Plumber", "Digital Marketing")
        location: Geographic location (e.g., "San Francisco", "New York")
        exclude_business: Business name to exclude from results (the client)
        max_competitors: Maximum number of competitors to return (default: 3)
    
    Returns:
        {
            "competitors": [
                {
                    "name": "Acme Corp",
                    "website": "https://acme.com",
                    "rating": 4.5,
                    "review_count": 250,
                    "snippet": "...",
                    "estimated_seo_score": 75
                }
            ],
            "analysis": {
                "avg_rating": 4.3,
                "avg_reviews": 180,
                "avg_seo_score": 72,
                "total_found": 3
            }
        }
    """
    api_token = os.getenv("APIFY_API_TOKEN")
    if not api_token:
        print("Error: APIFY_API_TOKEN not found in .env", file=sys.stderr)
        return {"competitors": [], "analysis": {}}
    
    client = ApifyClient(api_token)
    
    # Search query to find competitors
    search_query = f"{industry} in {location}"
    
    print(f"\n🔍 Searching for competitors: '{search_query}'")
    print(f"Excluding: {exclude_business if exclude_business else 'None'}")
    print(f"Max results: {max_competitors}")
    
    try:
        # Use Google Search scraper to find competitors
        run_input = {
            "queries": search_query,
            "maxPagesPerQuery": 1,
            "resultsPerPage": max_competitors * 3,  # Get extra to account for filtering
            "languageCode": "en",
            "type": "SEARCH"
        }
        
        run = client.actor("apify/google-search-scraper").call(run_input=run_input)
        items = list(client.dataset(run["defaultDatasetId"]).iterate_items())
        
        competitors = []
        exclude_lower = exclude_business.lower() if exclude_business else ""
        
        for item in items:
            # Skip if this is the excluded business
            title = item.get("title", "")
            url = item.get("url", "")
            
            if exclude_lower and (exclude_lower in title.lower() or exclude_lower in url.lower()):
                continue
            
            # Extract competitor data
            competitor = {
                "name": title,
                "website": url,
                "snippet": item.get("description", ""),
                "rank": item.get("rank", 0)
            }
            
            # Try to extract rating from snippet (many Google results show ratings)
            snippet = item.get("description", "")
            rating_match = None
            import re
            rating_pattern = r'(\d\.\d)\s*(?:stars?|★|rating)'
            rating_match = re.search(rating_pattern, snippet.lower())
            
            if rating_match:
                competitor["rating"] = float(rating_match.group(1))
            else:
                competitor["rating"] = 0
            
            # Extract review count from snippet
            review_pattern = r'(\d+)\s*(?:reviews?|ratings?)'
            review_match = re.search(review_pattern, snippet.lower())
            
            if review_match:
                competitor["review_count"] = int(review_match.group(1))
            else:
                competitor["review_count"] = 0
            
            # Estimate SEO score based on search rank and presence
            # Higher rank = higher SEO score
            if competitor["rank"] <= 3:
                competitor["estimated_seo_score"] = 80 + (10 * (4 - competitor["rank"]))
            elif competitor["rank"] <= 10:
                competitor["estimated_seo_score"] = 60 + (competitor["rank"] * 2)
            else:
                competitor["estimated_seo_score"] = 50
            
            competitors.append(competitor)
            
            if len(competitors) >= max_competitors:
                break
        
        # Calculate aggregate benchmarks
        if competitors:
            avg_rating = sum(c.get("rating", 0) for c in competitors) / len(competitors)
            avg_reviews = sum(c.get("review_count", 0) for c in competitors) / len(competitors)
            avg_seo = sum(c.get("estimated_seo_score", 0) for c in competitors) / len(competitors)
            
            analysis = {
                "avg_rating": round(avg_rating, 2),
                "avg_reviews": int(avg_reviews),
                "avg_seo_score": int(avg_seo),
                "total_found": len(competitors)
            }
        else:
            # Fallback to industry benchmarks
            analysis = {
                "avg_rating": 4.0,
                "avg_reviews": 100,
                "avg_seo_score": 70,
                "total_found": 0
            }
        
        result = {
            "competitors": competitors,
            "analysis": analysis,
            "search_query": search_query,
            "timestamp": datetime.now().isoformat()
        }
        
        print(f"\n✅ Found {len(competitors)} competitors")
        print(f"📊 Avg Rating: {analysis['avg_rating']}")
        print(f"📊 Avg Reviews: {analysis['avg_reviews']}")
        print(f"📊 Avg SEO Score: {analysis['avg_seo_score']}")
        
        return result
        
    except Exception as e:
        print(f"❌ Competitor research failed: {e}", file=sys.stderr)
        return {
            "competitors": [],
            "analysis": {
                "avg_rating": 4.0,
                "avg_reviews": 100,
                "avg_seo_score": 70,
                "total_found": 0
            },
            "error": str(e)
        }

def main():
    parser = argparse.ArgumentParser(
        description="Parallel lead scraping with geographic partitioning OR competitor research",
        epilog=f"Supported regions for auto-detection: {', '.join(REGION_MAPS.keys())}"
    )
    
    # Mode selection (new)
    parser.add_argument("--mode", default="leads", choices=["leads", "competitors"],
                        help="Mode: 'leads' for lead scraping, 'competitors' for competitor research")
    
    # Lead scraping arguments
    parser.add_argument("--query", help="Search query (e.g., 'Dentist', 'Plumber') - Required for leads mode")
    parser.add_argument("--location", help="Location - Required for both modes")
    parser.add_argument("--total_count", type=int, help="Total number of leads desired - Required for leads mode")
    parser.add_argument("--strategy", default="regions",
                        choices=["regions", "metros", "apac", "global"],
                        help="Partition strategy (leads mode only)")
    parser.add_argument("--partitions", type=int, default=None, help="Number of partitions (leads mode only)")
    parser.add_argument("--output_prefix", default="leads", help="Prefix for the output file")
    parser.add_argument("--company_keywords", nargs='+', help="Company keywords to filter (leads mode only)")
    parser.add_argument("--no-email-filter", action="store_true", help="Don't filter by validated emails (leads mode only)")
    
    # Competitor research arguments
    parser.add_argument("--industry", help="Industry/business type - Required for competitors mode")
    parser.add_argument("--exclude", help="Business name to exclude from competitor results")
    parser.add_argument("--max", type=int, default=3, help="Maximum competitors to find (default: 3)")
    parser.add_argument("--output", help="Output file path (for competitors mode)")

    args = parser.parse_args()

    # COMPETITOR MODE
    if args.mode == "competitors":
        if not args.industry or not args.location:
            print("Error: --industry and --location are required for competitor research mode")
            sys.exit(1)
        
        results = scrape_competitors(
            industry=args.industry,
            location=args.location,
            exclude_business=args.exclude,
            max_competitors=args.max
        )
        
        # Save results
        if args.output:
            output_file = args.output
        else:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            output_file = f".tmp/competitors_{timestamp}.json"
        
        os.makedirs(os.path.dirname(output_file) if os.path.dirname(output_file) else ".tmp", exist_ok=True)
        
        with open(output_file, "w") as f:
            json.dump(results, f, indent=2)
        
        print(f"\n💾 Results saved to: {output_file}")
        
        # Output JSON to stdout for programmatic use
        print("\n" + json.dumps(results, indent=2))
        return
    
    # LEADS MODE (original functionality)
    if not args.query or not args.location or not args.total_count:
        print("Error: --query, --location, and --total_count are required for leads mode")
        sys.exit(1)

    require_email = not args.no_email_filter

    # Handle custom state list
    location = args.location
    if "," in location:
        # User provided comma-separated list
        location = [loc.strip() for loc in location.split(",")]
        strategy = "custom"
        num_partitions = args.partitions or 4
    else:
        strategy = args.strategy
        num_partitions = args.partitions

    results, total_time, partition_times = scrape_parallel(
        query=args.query,
        location=location,
        total_count=args.total_count,
        strategy=strategy,
        num_partitions=num_partitions,
        company_keywords=args.company_keywords,
        require_email=require_email
    )

    if results:
        print(f"\n✅ Total unique leads collected: {len(results)}")
        print(f"⏱️  Total time: {total_time:.1f}s ({total_time/60:.1f} minutes)")
        print(f"📊 Partition times: {[f'{t:.1f}s' for t in partition_times]}")
        print(f"🚀 Avg partition time: {sum(partition_times)/len(partition_times):.1f}s")
        print(f"💰 Cost: SAME as sequential ({args.total_count} total leads)")

        save_results(results, prefix=args.output_prefix)
    else:
        print("\n❌ No leads found or error occurred.")
        sys.exit(1)

if __name__ == "__main__":
    main()
