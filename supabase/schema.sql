
-- Create analyses table
create table analyses (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  domain text not null,
  score integer not null,
  report_data jsonb not null,
  user_id uuid references auth.users,
  user_name text,
  user_email text,
  meta_hash text
);

-- Index for faster lookups
create index analyses_domain_idx on analyses(domain);
create index analyses_created_at_idx on analyses(created_at);

-- Create user_profiles table
create table user_profiles (
  id uuid references auth.users primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  credits integer default 5 not null,
  tier text default 'free' check (tier in ('free', 'pro', 'agency')),
  last_audit_at timestamp with time zone
);

-- Function to decrement credits safely
create or replace function decrement_credits(user_id uuid)
returns void as $$
begin
  update user_profiles
  set credits = credits - 1,
      last_audit_at = now()
  where id = user_id and credits > 0;
end;
$$ language plpgsql security definer;

-- Enable RLS
alter table analyses enable row level security;
alter table user_profiles enable row level security;

-- Policies
create policy "Public analyses are viewable by everyone"
  on analyses for select
  using (true);

create policy "Users can insert their own analyses"
  on analyses for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own profile"
  on user_profiles for select
  using (auth.uid() = id);
