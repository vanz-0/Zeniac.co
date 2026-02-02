import { Resend } from 'resend';

const resend = new Resend('re_HEDb6R7Y_AoYskegkw397J9eZHuvxgMQq');

async function testEmail() {
    console.log('Testing Resend API Key directly...');
    try {
        const data = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'evansmakaz@gmail.com',
            subject: 'Manual Resend Test',
            html: '<p>Direct test from terminal.</p>'
        });
        console.log('API Response:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('API Error:', error);
    }
}

testEmail();
