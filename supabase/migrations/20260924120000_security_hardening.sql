-- Security hardening for public RPCs, candidate uploads, and anonymous inserts.

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.is_admin() from public, anon, authenticated;
revoke execute on function public.is_staff() from public, anon, authenticated;
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;

-- Trigger-only function must never be a REST RPC.
revoke execute on function public.set_application_job_title() from public, anon, authenticated;

-- Restrict the bucket as defense in depth; the application still validates magic bytes.
update storage.buckets
set allowed_mime_types = array[
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]::text[]
where id = 'candidate-cvs';

create or replace function public.harden_application_insert()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.status := 'new';
  new.created_at := now();
  new.updated_at := now();
  if new.cv_path !~ ('^' || new.job_id::text || '/[0-9a-f-]{36}\.(pdf|doc|docx)$') then
    raise exception 'invalid candidate CV path';
  end if;
  return new;
end;
$$;

revoke execute on function public.harden_application_insert() from public, anon, authenticated;
drop trigger if exists applications_harden_insert on public.applications;
create trigger applications_harden_insert
before insert on public.applications
for each row execute function public.harden_application_insert();

-- Anonymous applicants never need to update or delete application rows.
revoke update, delete on public.applications from anon;
