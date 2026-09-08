alter table public.applications drop constraint applications_job_id_fkey;
alter table public.applications alter column job_id drop not null;
alter table public.applications add constraint applications_job_id_fkey foreign key (job_id) references public.jobs(id) on delete set null;
drop policy if exists "Staff can delete applications" on public.applications;

-- Preserve the existing title snapshot when deletion detaches an application.
drop trigger if exists applications_set_job_title on public.applications;
create trigger applications_set_job_title
before insert or update of job_id on public.applications
for each row when (new.job_id is not null)
execute function public.set_application_job_title();
