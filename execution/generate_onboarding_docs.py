import google.generativeai as genai
import os
import json
import argparse
from pathlib import Path
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def generate_strategic_welcome_guide(client_data):
    """Generate a premium welcome guide using Gemini."""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return "Error: GEMINI_API_KEY not configured in environment."

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-pro')
    
    prompt = f"""You are a Strategic Growth Consultant at Zeniac. Create a premium 'Strategic Welcome Guide' for a new client.

## CLIENT PROFILE
Client Name: {client_data.get('client_name')}
Service Type: {client_data.get('service_type')}
Target Location: {client_data.get('target_location')}
Offers: {client_data.get('offers')}
Target Audience: {client_data.get('target_audience')}
Social Proof: {client_data.get('social_proof')}

## OBJECTIVE
Generate a professional, persuasive, and structured onboarding document (Markdown format) that:
1. Reconfirms the vision and growth plan.
2. Outlines the 3 Core Offers we are split-testing.
3. Explains the 'Zenith Gold' standard of execution.
4. Sets clear expectations and next steps.

Use a tone that is premium, authoritative, but approachable ('Mono-Dominance' aesthetic). Avoid generic marketing fluff. Focus on ROI and systems that scale.

## STRUCTURE
- Header: Zeniac Strategic Welcome Guide
- Executive Summary
- The Growth Thesis (Why this will work)
- Campaign Strategy & Offer Breakdown
- Target Audience Insights
- Onboarding Timeline & Next Steps
- Conclusion & Contact Info

Return ONLY the Markdown content. Do not include any explanations or markdown code blocks around the entire content."""

    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error generating guide: {str(e)}"

def main():
    parser = argparse.ArgumentParser(description="Generate Zeniac Strategic Onboarding Documents using Gemini.")
    parser.add_argument("--client_name", required=True, help="Name of the client")
    parser.add_argument("--service_type", required=True, help="Type of service (e.g., Local SEO, Lead Gen)")
    parser.add_argument("--target_location", required=True, help="Primary target location")
    parser.add_argument("--offers", required=True, help="Pipe-separated list of 3 offers")
    parser.add_argument("--target_audience", required=False, default="business owners", help="Target audience description")
    parser.add_argument("--social_proof", required=False, default="", help="Client social proof/credentials")
    parser.add_argument("--output_dir", required=False, default=".tmp", help="Directory to save the guide")
    
    args = parser.parse_args()
    
    client_data = {
        "client_name": args.client_name,
        "service_type": args.service_type,
        "target_location": args.target_location,
        "offers": args.offers,
        "target_audience": args.target_audience,
        "social_proof": args.social_proof
    }
    
    print(f"🚀 Generating Strategic Welcome Guide for {args.client_name}...")
    
    guide_content = generate_strategic_welcome_guide(client_data)
    
    # Create output directory if it doesn't exist
    output_path = Path(args.output_dir)
    output_path.mkdir(parents=True, exist_ok=True)
    
    # Save as Markdown
    safe_name = args.client_name.lower().replace(" ", "_")
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = output_path / f"welcome_guide_{safe_name}_{timestamp}.md"
    
    with open(filename, "w", encoding="utf-8") as f:
        f.write(guide_content)
    
    print(f"✅ Guide generated and saved to: {filename}")
    
    # Attempt to convert to HTML for easier viewing if needed
    # Or just print a snippet
    print("\n--- Preview ---")
    print(guide_content[:500] + "...")
    print("----------------\n")

if __name__ == "__main__":
    main()
