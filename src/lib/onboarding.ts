import { supabaseAdmin, supabase } from '@/lib/supabase';

/**
 * Ensures a user profile exists for the given email.
 * Creates one if it doesn't exist (upsert on user_email).
 * 
 * @param email - The user's email address
 * @param name - The user's display name (optional)
 * @param source - Where the lead came from: 'wizard' | 'footer' | 'booking'
 * @returns The user profile row, or null if failed
 */
export async function ensureUserProfile(
    email: string,
    name?: string,
    source: 'wizard' | 'footer' | 'booking' = 'wizard'
) {
    if (!email) {
        console.warn('⚠️ ensureUserProfile called without email, skipping.');
        return null;
    }

    const client = supabaseAdmin || supabase;
    const normalizedEmail = email.toLowerCase().trim();

    try {
        // 1. Check if profile already exists
        const { data: existing, error: lookupError } = await client
            .from('user_profiles')
            .select('*')
            .eq('user_email', normalizedEmail)
            .single();

        if (existing) {
            console.log(`✅ [ONBOARDING] Profile exists for: ${normalizedEmail}`);
            // Update display name if we have a better one now
            if (name && !existing.display_name) {
                await client
                    .from('user_profiles')
                    .update({ display_name: name })
                    .eq('user_email', normalizedEmail);
            }
            return existing;
        }

        // 2. Create new profile (free tier, 1 credit)
        const { data: newProfile, error: insertError } = await client
            .from('user_profiles')
            .insert({
                user_email: normalizedEmail,
                display_name: name || null,
                tier: 'free',
                credits: 1,
                source: source,
                onboarding_stage: 'new'
            })
            .select()
            .single();

        if (insertError) {
            console.error('❌ [ONBOARDING] Failed to create profile:', insertError.message);
            return null;
        }

        console.log(`🆕 [ONBOARDING] New profile created for: ${normalizedEmail} (source: ${source})`);
        return newProfile;

    } catch (error: any) {
        console.error('❌ [ONBOARDING] ensureUserProfile error:', error.message);
        return null;
    }
}

/**
 * Updates the onboarding stage for a user.
 * Stages: 'new' → 'engaged' → 'active' → 'toolkit_buyer' → 'client'
 *         'new' → 'cold' (if they never opened emails)
 */
export async function updateOnboardingStage(
    email: string,
    stage: 'new' | 'engaged' | 'cold' | 'active' | 'toolkit_buyer' | 'client'
) {
    if (!email) return null;

    const client = supabaseAdmin || supabase;

    const { data, error } = await client
        .from('user_profiles')
        .update({ onboarding_stage: stage })
        .eq('user_email', email.toLowerCase().trim())
        .select()
        .single();

    if (error) {
        console.warn(`⚠️ [ONBOARDING] Stage update failed for ${email}:`, error.message);
        return null;
    }

    console.log(`📊 [ONBOARDING] ${email} → stage: ${stage}`);
    return data;
}

/**
 * Adds a contact to Brevo and tags them for the appropriate email sequence.
 * Uses the Brevo Contacts API.
 */
export async function addToBrevoList(
    email: string,
    name: string,
    source: 'wizard' | 'footer' | 'booking'
) {
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    if (!BREVO_API_KEY) {
        console.warn('⚠️ [BREVO] No API key — skipping contact creation.');
        return null;
    }

    try {
        // Create or update contact with attributes
        const response = await fetch('https://api.brevo.com/v3/contacts', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'api-key': BREVO_API_KEY
            },
            body: JSON.stringify({
                email: email.toLowerCase().trim(),
                attributes: {
                    FIRSTNAME: name || '',
                    SOURCE: source,
                    ONBOARDING_STAGE: 'new'
                },
                updateEnabled: true // Update if contact already exists
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            // "duplicate parameter" is fine — means contact exists, attributes updated
            if (errorData.code !== 'duplicate_parameter') {
                console.warn('⚠️ [BREVO] Contact creation issue:', errorData.message || response.status);
            }
        }

        console.log(`📬 [BREVO] Contact synced: ${email} (source: ${source})`);
        return true;

    } catch (error: any) {
        console.error('❌ [BREVO] Contact sync failed:', error.message);
        return null;
    }
}
