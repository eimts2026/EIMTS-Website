alter table public.jobs
  add column salary_amount numeric(12,2) check (salary_amount >= 0),
  add column salary_lkr numeric(12,2) check (salary_lkr >= 0);

comment on column public.jobs.salary_lkr is 'Optional manually entered LKR equivalent; no automatic currency conversion.';
