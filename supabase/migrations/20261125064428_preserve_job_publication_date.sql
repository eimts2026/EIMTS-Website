create function public.preserve_job_publication_date() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  if tg_op = 'UPDATE' and old.published_at is not null then
    new.published_at := old.published_at;
  elsif new.status = 'published' then
    new.published_at := coalesce(new.published_at, now());
  else
    new.published_at := null;
  end if;
  return new;
end;
$$;
revoke all on function public.preserve_job_publication_date() from public;
create trigger jobs_preserve_publication_date before insert or update on public.jobs
for each row execute function public.preserve_job_publication_date();
