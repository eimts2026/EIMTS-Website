create index if not exists hero_slides_created_by_idx
  on public.hero_slides (created_by);
create index if not exists jobs_created_by_idx
  on public.jobs (created_by);
create index if not exists popups_created_by_idx
  on public.popups (created_by);
create index if not exists projects_created_by_idx
  on public.projects (created_by);

drop index if exists public.jobs_country_idx;

drop policy if exists "Profiles can read themselves" on public.profiles;
create policy "Profiles can read themselves"
on public.profiles for select
to authenticated
using (
  id = (select auth.uid())
  or (select public.is_staff())
);

drop policy if exists "Staff can create jobs" on public.jobs;
create policy "Staff can create jobs"
on public.jobs for insert
to authenticated
with check (
  (select public.is_staff())
  and created_by = (select auth.uid())
);

drop policy if exists "Staff can create popups" on public.popups;
create policy "Staff can create popups"
on public.popups for insert
to authenticated
with check ((select public.is_staff()));

drop policy if exists "Staff can create hero slides" on public.hero_slides;
create policy "Staff can create hero slides"
on public.hero_slides for insert
to authenticated
with check ((select public.is_staff()));

drop policy if exists "Active hero slides are public" on public.hero_slides;
drop policy if exists "Staff can read hero slides" on public.hero_slides;
create policy "Active hero slides are public"
on public.hero_slides for select
to anon
using (
  active = true and (starts_at is null or starts_at <= now()) and (ends_at is null or ends_at >= now())
);
create policy "Staff can read hero slides"
on public.hero_slides for select
to authenticated
using ((select public.is_staff()));

drop policy if exists "Published jobs are public" on public.jobs;
drop policy if exists "Staff can read every job" on public.jobs;
create policy "Published jobs are public"
on public.jobs for select
to anon
using (status = 'published' and (expires_at is null or expires_at >= now()));
create policy "Staff can read every job"
on public.jobs for select
to authenticated
using ((select public.is_staff()));

drop policy if exists "Active popups are public" on public.popups;
drop policy if exists "Staff can read popups" on public.popups;
create policy "Active popups are public"
on public.popups for select
to anon
using (
  active = true and (starts_at is null or starts_at <= now()) and (ends_at is null or ends_at >= now())
);
create policy "Staff can read popups"
on public.popups for select
to authenticated
using ((select public.is_staff()));

drop policy if exists "Active projects are public" on public.projects;
drop policy if exists "Staff can read every project" on public.projects;
create policy "Active projects are public"
on public.projects for select
to anon
using (active = true);
create policy "Staff can read every project"
on public.projects for select
to authenticated
using ((select public.is_staff()));
