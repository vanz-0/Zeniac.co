
import { supabase, supabaseAdmin } from './supabase';
import { AnalysisData } from '@/types/analysis';

/**
 * Check if a domain has been analyzed recently (e.g., within the last 30 days)
 * to avoid unnecessary re-crawling and token usage.
 */
export async function getRecentAnalysis(domain: string, hours = 720) {
    // Normalize domain
    const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');

    const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .ilike('domain', `%${cleanDomain}%`)
        .gt('created_at', new Date(Date.now() - hours * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.warn('Supabase lookup error:', error);
        return null;
    }

    return data;
}

/**
 * Save a new analysis result to Supabase.
 * If userId is provided, it links the analysis to the user.
 */
export async function saveAnalysisResult(
    domain: string,
    data: AnalysisData,
    userId?: string
) {
    const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');

    // Use admin client if available (for service role operations), otherwise public client
    const client = supabaseAdmin || supabase;

    const { error } = await client
        .from('analyses')
        .insert({
            domain: cleanDomain,
            score: data.score,
            report_data: data,
            user_id: userId || null,
            created_at: new Date().toISOString()
        });

    if (error) {
        console.error('Failed to save analysis:', error);
    }
}

/**
 * Check user credits/limits.
 * Returns true if allowed, false if limit reached.
 */
export async function checkUserLimits(userId: string): Promise<boolean> {
    if (!userId) return true; // Allow anonymous for now (or implement IP rate limit later)

    const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('credits, tier')
        .eq('id', userId)
        .single();

    if (error || !profile) return true; // Fail open if profile not found (for now)

    return (profile?.credits || 0) > 0;
}

/**
 * Deduct a credit from the user.
 */
export async function deductCredit(userId: string) {
    if (!supabaseAdmin) return; // Only admin can reliably update credits without strict RLS

    const { error } = await supabaseAdmin.rpc('decrement_credits', { user_id: userId });

    if (error) {
        console.warn('Failed to deduct credit:', error);
    }
}
