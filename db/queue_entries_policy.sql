-- Supabase policy for queue_entries table
-- Allow authenticated users to insert and read their own queue entries.

create policy "Allow authenticated user to insert own queue entry" on queue_entries
  for insert
  with check (auth.uid() = user_id);

create policy "Allow authenticated user to select queue entries in same queue" on queue_entries
  for select
  using (auth.role() = 'authenticated');

create policy "Allow authenticated user to update own queue entry" on queue_entries
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
