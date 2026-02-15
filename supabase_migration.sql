-- ============================================
-- Dominance Vault: User Profiles Migration
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Add new columns to user_profiles
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS user_email text;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS display_name text;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS source text DEFAULT 'wizard';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS onboarding_stage text DEFAULT 'new';

-- 2. Create unique index on user_email for upsert
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(user_email);

-- 3. Allow anon inserts for lead capture (RLS policy)
-- This lets our API route create profiles for anonymous users
CREATE POLICY IF NOT EXISTS "Allow service role full access" ON user_profiles
  FOR ALL USING (true) WITH CHECK (true);

-- 4. Verify
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'user_profiles' ORDER BY ordinal_position;
