# Generate Toolkit Webhook

## Goal
Generate a personalized "Dominance Toolkit" Google Doc for a user based on their survey responses.

## Input Data
The directive expects the following `input_data`:
- `industry`: The user's industry (e.g., "Real Estate")
- `struggle`: The user's primary struggle (e.g., "Leads")
- `revenueRange`: The user's revenue range (e.g., "$10k+")
- `email`: The user's email address

## Steps
1.  **Generate Toolkit**: Use the `generate_toolkit` tool to create the personalized Google Doc.
    -   Pass `industry`, `struggle`, `revenueRange`, and `email` from the input.
2.  **Confirm**: Return the document URL and ID.

## Output
Return a JSON object with:
-   `status`: "success"
-   `doc_url`: URL of the generated Google Doc
-   `email`: User's email
