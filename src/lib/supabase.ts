
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://egnvzaaxxwgzhozkzlfg.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnbnZ6YWF4eHdnemhvemt6bGZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NTYxNzcsImV4cCI6MjA4NjEzMjE3N30.tUnaRamXKtcYsNA3rY9484VMwEgbL0UpnrFhmQZL2fE';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnbnZ6YWF4eHdnemhvemt6bGZnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDU1NjE3NywiZXhwIjoyMDg2MTMyMTc3fQ.6aGfPgwJ1g7WOknCtdgO8GSX9DU6xWOCW4hqpXkfzgk';

if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️ Missing Supabase environment variables. Client operations will fail at runtime.');
}

// Public client for client-side operations (if needed) and safe server-side queries
// Pass empty strings if missing to prevent build-time crash; errors will occur on actual requests if not set
export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseKey || 'placeholder-key');

// Admin client for secure server-side operations (bypasses RLS)
// Only use this in API routes or Server Actions, never on the client
export const supabaseAdmin = serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey)
    : null;
