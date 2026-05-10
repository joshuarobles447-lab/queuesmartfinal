-- Queue entries table for Supabase

create table if not exists queue_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  customer_name text,
  queue_code text,
  ticket text not null,
  status text not null default 'waiting',
  created_at timestamptz default now()
);
