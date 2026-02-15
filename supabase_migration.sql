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

-- 3. Enable RLS and create policy for service role access
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'Allow service role full access'
      AND schemaname = 'public'
      AND tablename = 'user_profiles'
  ) THEN
    EXECUTE $q$
      CREATE POLICY "Allow service role full access"
      ON public.user_profiles
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
    $q$;
  END IF;
END
$$;

-- 4. Verify columns
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'user_profiles' ORDER BY ordinal_position;
