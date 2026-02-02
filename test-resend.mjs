import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
    console.log('Testing Resend API Key:', process.env.RESEND_API_KEY?.substring(0, 10) + '...');
    try {
        const data = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'evansmakaz@gmail.com', // Using user's email from screenshot
            subject: 'Resend Debug Test',
            html: '<p>If you see this, the API key is working!</p>'
        });
        console.log('Success:', data);
    } catch (error) {
        console.error('Error:', error);
    }
}

testEmail();
