-- Create a private storage bucket named 'media' in Supabase UI or via API.
-- Then attach these RLS-like policies.

-- Only allow owners to upload/read objects inside media/{user_id}/**
-- NOTE: In storage.objects, `name` is the full path.

drop policy if exists "media upload own" on storage.objects;
create policy "media upload own"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'media'
  and name like auth.uid()::text || '/%'
);

drop policy if exists "media read own" on storage.objects;
create policy "media read own"
on storage.objects for select to authenticated
using (
  bucket_id = 'media'
  and name like auth.uid()::text || '/%'
);
