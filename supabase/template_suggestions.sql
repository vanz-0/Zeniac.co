-- Template Suggestions & Voting System
-- Run this migration in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS template_suggestions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'general',
    suggested_by_email TEXT,
    votes INT DEFAULT 1,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'built', 'rejected'))
);

-- Index for fast category filtering and sorting by votes
CREATE INDEX IF NOT EXISTS idx_suggestions_category ON template_suggestions(category);
CREATE INDEX IF NOT EXISTS idx_suggestions_votes ON template_suggestions(votes DESC);

-- Votes tracking table (prevents duplicate votes per email)
CREATE TABLE IF NOT EXISTS template_votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    suggestion_id UUID REFERENCES template_suggestions(id) ON DELETE CASCADE,
    voter_email TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(suggestion_id, voter_email)
);

-- RLS Policies (public read, authenticated write)
ALTER TABLE template_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_votes ENABLE ROW LEVEL SECURITY;

-- Anyone can read suggestions
CREATE POLICY "Public read suggestions" ON template_suggestions
    FOR SELECT USING (true);

-- Anyone can insert suggestions (anonymous allowed)
CREATE POLICY "Public insert suggestions" ON template_suggestions
    FOR INSERT WITH CHECK (true);

-- Anyone can read votes
CREATE POLICY "Public read votes" ON template_votes
    FOR SELECT USING (true);

-- Anyone can insert votes
CREATE POLICY "Public insert votes" ON template_votes
    FOR INSERT WITH CHECK (true);
