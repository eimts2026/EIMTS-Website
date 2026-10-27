-- Candidate CVs now go directly to the recruitment inbox. Restrict the retired
-- private bucket while its legacy objects await deletion through the Storage API.
drop policy if exists "Staff can read candidate CVs" on storage.objects;
