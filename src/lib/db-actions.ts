import { supabaseAdmin, supabase } from '@/lib/supabase';
import { AnalysisData } from '@/types/analysis';

export async function getRecentAnalysis(domain: string) {
    // Validate inputs
    if (!domain) return null;

    // Use admin client to bypass RLS for reading cached reports if needed, 
    // or use public client if we want to respect RLS (but cache should likely be global?)
    // "Public analyses are viewable by everyone" policy exists, so public client is fine.

    // Normalize domain
    const normalizedDomain = domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');

    const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .ilike('domain', `%${normalizedDomain}%`)
        .gt('created_at', new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (error) {
        if (error.code !== 'PGRST116') { // PGRST116 is "JSON object requested, multiple (or no) results returned" - usually "no results" with .single()
            console.warn('Error fetching recent analysis:', error);
        }
        return null;
    }

    return data;
}

export async function checkUserLimits(userId: string) {
    if (!userId) return { allowed: false, error: "User not authenticated" };

    // Use admin to check profiles securely
    const client = supabaseAdmin || supabase;

    const { data: profile, error } = await client
        .from('user_profiles')
        .select('credits, tier, last_audit_at')
        .eq('id', userId)
        .single();

    if (error || !profile) {
        // If no profile, maybe create one? Or fail. For now, fail safe.
        // Or assume free tier?
        return { allowed: false, error: "User profile not found" };
    }

    if (profile.credits <= 0) {
        return { allowed: false, error: "Insufficient credits. Please upgrade." };
    }

    return { allowed: true, profile };
}

export async function saveAnalysisResult(
    userId: string | null, // Nullable for anonymous/public scans if we allow them
    domain: string,
    score: number,
    reportData: AnalysisData,
    userName?: string,
    userEmail?: string
) {
    const client = supabaseAdmin || supabase;

    // Normalize domain before saving to ensure cache hits
    const normalizedDomain = domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');

    // 1. Insert Analysis
    const { data: analysis, error: insertError } = await client
        .from('analyses')
        .insert({
            user_id: userId,
            domain: normalizedDomain, // Saved normalized!
            score,
            report_data: reportData,
            user_name: userName,
            user_email: userEmail,
            meta_hash: `${normalizedDomain}-${Date.now()}`
        })
        .select()
        .single();

    let finalAnalysis = analysis;

    if (insertError) {
        console.warn('⚠️ Standard insert failed, attempting fallback (Metadata columns may be missing):', insertError.message);
        // Fallback: Insert without the new user_name and user_email columns
        const { data: fallbackAnalysis, error: fallbackError } = await client
            .from('analyses')
            .insert({
                user_id: userId,
                domain: normalizedDomain,
                score,
                report_data: reportData,
                meta_hash: `${normalizedDomain}-${Date.now()}`
            })
            .select()
            .single();

        if (fallbackError) {
            console.error('❌ Failed to save analysis (Fallback also failed):', fallbackError);
            return null;
        }
        finalAnalysis = fallbackAnalysis;
    }

    // 2. Decrement Credits (if user exists)
    if (userId) {
        const { error: rpcError } = await client.rpc('decrement_credits', { user_id: userId });
        // Wait, schema says: create or replace function decrement_credits(user_id uuid) -> parameter name is likely $1 or user_id if named.
        // Let's check schema again. `create or replace function decrement_credits(user_id uuid)`
        // calling with { user_id: userId } should work if named parameter is `user_id`.

        if (rpcError) {
            console.warn('Failed to decrement credits:', rpcError);
            // Don't fail the whole request, but log it.
        }
    }

    return finalAnalysis;
}
