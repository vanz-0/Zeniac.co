import { NextResponse } from 'next/server';
import { FREEBIES } from '@/config/freebies';

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || 'merchzenith@gmail.com';
const SENDER_NAME = "Zeniac Intelligence";

export async function POST(req: Request) {
    try {
        const { name, email, serviceId } = await req.json();

        if (!email || !serviceId) {
            return NextResponse.json({ error: 'Email and Service ID are required' }, { status: 400 });
        }

        const freebie = FREEBIES[serviceId as keyof typeof FREEBIES];

        if (!freebie) {
            console.warn(`⚠️ No freebie found for service: ${serviceId}`);
            return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
        }

        const emailHtml = `
      <div style="font-family: 'Courier New', Courier, monospace; background-color: #000; color: #fff; padding: 40px; border: 2px solid #D4AF37;">
        <h1 style="color: #D4AF37; margin-bottom: 20px; text-transform: uppercase;">Your Intelligence Asset is Ready</h1>
        <p style="font-size: 16px; line-height: 1.6;">Hello ${name},</p>
        <p style="font-size: 16px; line-height: 1.6;">As requested, here is your access to the <strong>${freebie.name}</strong>.</p>
        
        <div style="margin: 30px 0; padding: 20px; background: #1A1A1A; border-left: 4px solid #D4AF37;">
          <p style="margin: 0; color: #D4AF37; font-weight: bold;">FREEBIE DESCRIPTION:</p>
          <p style="margin: 10px 0 0 0;">${freebie.description}</p>
        </div>

        <a href="${freebie.link}" 
           style="display: inline-block; padding: 15px 30px; background-color: #D4AF37; color: #000; text-decoration: none; font-weight: bold; text-transform: uppercase;">
           Download Resource Now
        </a>

        <p style="margin-top: 40px; font-size: 14px; color: #888;">
          Systems that scale for market dominance. <br/>
          &copy; 2026 ZENIAC.CO
        </p>
      </div>
    `;

        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'api-key': BREVO_API_KEY as string
            },
            body: JSON.stringify({
                sender: { name: SENDER_NAME, email: SENDER_EMAIL },
                to: [{ email: email, name: name }],
                subject: `🎁 Your Free Gift: ${freebie.name}`,
                htmlContent: emailHtml
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Brevo API Error');
        }

        return NextResponse.json({ success: true, message: 'Freebie sent successfully' });

    } catch (error) {
        console.error("❌ Lead Form API Error:", error);
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}
