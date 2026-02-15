import { NextRequest, NextResponse } from 'next/server';
import { updateOnboardingStage } from '@/lib/onboarding';

/**
 * Brevo Webhook Handler
 * 
 * Receives events from Brevo when emails are opened, clicked, etc.
 * Used to gate the onboarding email sequence — only continue
 * sending to users who actually engage.
 * 
 * Configure in Brevo Dashboard:
 *   Settings → Webhooks → Add webhook
 *   URL: https://yourdomain.com/api/brevo/webhook
 *   Events: opened, click
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Brevo sends an array of events
        const events = Array.isArray(body) ? body : [body];

        for (const event of events) {
            const email = event.email;
            const eventType = event.event; // 'opened', 'click', 'hard_bounce', 'unsubscribed', etc.

            if (!email) continue;

            console.log(`📬 [BREVO WEBHOOK] ${eventType} from ${email}`);

            switch (eventType) {
                case 'opened':
                case 'click':
                    // User is engaged — allow sequence to continue
                    await updateOnboardingStage(email, 'engaged');
                    break;

                case 'hard_bounce':
                case 'unsubscribed':
                case 'complaint':
                    // User is cold/invalid — stop sequence
                    await updateOnboardingStage(email, 'cold');
                    break;

                default:
                    // Other events (delivered, soft_bounce, etc.) — no action
                    break;
            }
        }

        return NextResponse.json({ received: true });

    } catch (error: any) {
        console.error('❌ [BREVO WEBHOOK] Error:', error.message);
        // Return 200 anyway so Brevo doesn't keep retrying
        return NextResponse.json({ received: true, error: error.message });
    }
}
