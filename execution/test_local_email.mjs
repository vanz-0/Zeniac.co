
import fetch from 'node-fetch';

const API_URL = 'http://localhost:3000/api/send-audit';

async function testEmail() {
    console.log("🚀 Testing local /api/send-audit endpoint...");

    const payload = {
        name: "Test User",
        website: "test.co",
        email: "evansmakaz@gmail.com",
        analysis: {
            score: 75,
            techStack: "Next.js",
            competitorGap: "Low",
            inferredPainPoints: ["Slow loading", "Poor mobile UX"]
        }
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log("Response Status:", response.status);
        console.log("Response Data:", JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Test failed:", error);
    }
}

testEmail();
