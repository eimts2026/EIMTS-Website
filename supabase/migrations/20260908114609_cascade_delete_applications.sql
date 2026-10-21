-- Allow deleting job vacancies along with their applications
alter table public.applications
  drop constraint if exists applications_job_id_fkey;

alter table public.applications
  add constraint applications_job_id_fkey
  foreign key (job_id) references public.jobs(id)
  on delete cascade;

drop policy if exists "Staff can delete applications" on public.applications;

create policy "Staff can delete applications"
on public.applications for delete
to authenticated
using (public.is_staff());
