-- Add paid_vault flag to user_profiles
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS paid_vault BOOLEAN DEFAULT FALSE;

-- Create a payments table for tracking transactions
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_email TEXT NOT NULL,
    amount DECIMAL NOT NULL,
    currency TEXT NOT NULL,
    reference TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL,
    metadata JSONB
);

-- Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Service role can do everything
CREATE POLICY "Service role can manage payments" ON public.payments
    FOR ALL USING (auth.role() = 'service_role');
