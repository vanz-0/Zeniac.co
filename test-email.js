// Quick test script to verify email sending with real API key
// Run with: node test-email.js

const testEmailSending = async () => {
    const testPayload = {
        name: "Test Company",
        website: "zeniac.co",
        email: "your-email@example.com", // REPLACE WITH YOUR EMAIL to receive the test
        analysis: {
            score: 65,
            techStack: "Next.js, React",
            competitorGap: "Medium",
            businessType: "SaaS Company",
            location: "Global",
            services: ["Web Development", "Digital Marketing"],
            inferredPainPoints: [
                "Slow page load times",
                "Missing call-to-action buttons",
                "Poor mobile responsiveness"
            ],
            strengths: [
                "Good content quality",
                "Active social media presence"
            ],
            weaknesses: [
                "No SSL certificate",
                "Missing meta descriptions",
                "Slow server response"
            ],
            recommendations: [
                {
                    title: "Implement SSL Certificate",
                    description: "Secure your website with HTTPS to improve SEO and user trust",
                    impact: "High"
                },
                {
                    title: "Optimize Page Speed",
                    description: "Reduce load times by optimizing images and implementing caching",
                    impact: "High"
                }
            ],
            revenueImpact: {
                monthlyRevenueLeak: 5000,
                annualOpportunity: 60000
            }
        }
    };

    try {
        console.log('🧪 Testing email send with real API key...');
        console.log('📧 Sending to:', testPayload.email);

        const response = await fetch('http://localhost:3000/api/send-audit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testPayload),
        });

        const result = await response.json();

        if (response.ok) {
            console.log('✅ SUCCESS! Email sent.');
            console.log('📬 Response:', result);
            console.log('\n✅ Check the inbox for:', testPayload.email);
        } else {
            console.log('❌ FAILED! Email not sent.');
            console.log('Error:', result);
        }
    } catch (error) {
        console.error('❌ Request failed:', error.message);
    }
};

testEmailSending();
