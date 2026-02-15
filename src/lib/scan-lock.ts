import { supabase } from './supabase';

/**
 * Checks if there's an active or very recent scan to prevent overload.
 * Uses a "rate limit" approach by checking if any analysis was CREATED in the last X seconds.
 * This acts as a global lock because analyses are created at start (if we modify flow) or end.
 * Since current flow saves at END, we use a different strategy:
 * 
 * STRATEGY: 
 * We use a dedicated function to check current server load.
 * Since we can't easily add a new table without migrations, we will check if any analysis
 * was completed in the last 15 seconds. This acts as a "Cool Down".
 * 
 * If users are triggering scans rapidly, the "Cool Down" will block them.
 * 
 * Limitation: This doesn't catch "In Progress" if Supabase isn't updated at start.
 * To fix "In Progress", we would need to insert a "PENDING" row.
 * 
 * Ideally, we should:
 * 1. Insert a row with status='processing' at START.
 * 2. Update it to 'completed' at END.
 * 
 * However, 'analyses' table has 'score' and 'report_data' which might be non-nullable.
 * Let's try to trust the user usage pattern first with a simple Cool Down.
 * A 20-second global cool down is safer than nothing.
 */

const SCAN_COOLDOWN_SECONDS = 15;

export async function checkSystemLoad(): Promise<{ allowed: boolean; waitTime?: number }> {
    try {
        // Calculate timestamp for X seconds ago
        const cooldownTime = new Date(Date.now() - SCAN_COOLDOWN_SECONDS * 1000).toISOString();

        // Check for any analysis created recently
        // This means "Did a scan finish recently?"
        const { count, error } = await supabase
            .from('analyses')
            .select('*', { count: 'exact', head: true })
            .gt('created_at', cooldownTime);

        if (error) {
            console.warn("⚠️ Failed to check system load:", error.message);
            // Fail open? or Fail closed?
            // Let's Fail Open to not block if DB is weird, but log it.
            return { allowed: true };
        }

        if (count && count > 0) {
            return { allowed: false, waitTime: SCAN_COOLDOWN_SECONDS };
        }

        return { allowed: true };

    } catch (e) {
        console.error("System load check failed:", e);
        return { allowed: true };
    }
}
