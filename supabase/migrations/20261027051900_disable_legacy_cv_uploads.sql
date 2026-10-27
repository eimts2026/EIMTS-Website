-- The CV endpoint now emails submissions directly; anonymous uploads to the
-- retired candidate-cvs bucket must no longer be accepted.
drop policy if exists "Visitors can upload candidate CVs" on storage.objects;
