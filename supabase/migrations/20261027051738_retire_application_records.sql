-- Candidate CV submissions are delivered directly by email. Remove the
-- retired dashboard-backed application queue and its database-only helpers.
drop table if exists public.applications cascade;
drop function if exists public.set_application_job_title();
drop function if exists public.harden_application_insert();
