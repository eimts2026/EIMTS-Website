alter table public.jobs add column if not exists salary_negotiable boolean not null default false;
update public.jobs set salary_negotiable=true where currency='NEG';
do $$ declare definition text; begin definition := pg_get_functiondef('public.search_public_jobs(text,text,text,text,integer,jsonb)'::regprocedure); if position('j.salary_negotiable' in definition)=0 then execute replace(definition,'j.salary_amount,j.salary_lkr,j.currency','j.salary_negotiable,j.salary_amount,j.salary_lkr,j.currency'); end if; end $$;
