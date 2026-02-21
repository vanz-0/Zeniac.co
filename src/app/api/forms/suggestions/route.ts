import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
);

// GET: Fetch all suggestions sorted by votes
export async function GET() {
    try {
        const { data, error } = await supabase
            .from('template_suggestions')
            .select('*')
            .order('votes', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ success: true, suggestions: data || [] });
    } catch (error: any) {
        console.error('[SUGGESTIONS] Fetch error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST: Submit a new suggestion OR vote on an existing one
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { action } = body;

        if (action === 'vote') {
            // Vote on an existing suggestion
            const { suggestionId, email } = body;
            if (!suggestionId || !email) {
                return NextResponse.json({ success: false, error: 'Missing suggestionId or email' }, { status: 400 });
            }

            // Insert vote (will fail on duplicate due to UNIQUE constraint)
            const { error: voteError } = await supabase
                .from('template_votes')
                .insert({ suggestion_id: suggestionId, voter_email: email });

            if (voteError) {
                if (voteError.code === '23505') {
                    return NextResponse.json({ success: false, error: 'Already voted' }, { status: 409 });
                }
                throw voteError;
            }

            // Increment vote count via manual read-then-update
            const { data: current } = await supabase
                .from('template_suggestions')
                .select('votes')
                .eq('id', suggestionId)
                .single();

            if (current) {
                await supabase
                    .from('template_suggestions')
                    .update({ votes: (current.votes || 0) + 1 })
                    .eq('id', suggestionId);
            }

            return NextResponse.json({ success: true, message: 'Vote recorded' });

        } else {
            // Submit a new suggestion
            const { title, description, category, email } = body;
            if (!title || !category) {
                return NextResponse.json({ success: false, error: 'Title and category are required' }, { status: 400 });
            }

            const { data, error } = await supabase
                .from('template_suggestions')
                .insert({
                    title,
                    description: description || '',
                    category,
                    suggested_by_email: email || null,
                    votes: 1,
                    status: 'pending'
                })
                .select()
                .single();

            if (error) throw error;

            return NextResponse.json({ success: true, suggestion: data });
        }
    } catch (error: any) {
        console.error('[SUGGESTIONS] Submit error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
