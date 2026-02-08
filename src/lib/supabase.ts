
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
}

// Public client for client-side operations (if needed) and safe server-side queries
export const supabase = createClient(supabaseUrl, supabaseKey);

// Admin client for secure server-side operations (bypasses RLS)
// Only use this in API routes or Server Actions, never on the client
export const supabaseAdmin = serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey)
    : null;
