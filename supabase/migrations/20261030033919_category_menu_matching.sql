-- Match navigation groups while preserving existing categories and pagination.
create or replace function public.job_category_matches(saved_category text, requested_category text)
returns boolean language sql immutable security invoker set search_path = '' as $$
select requested_category = '' or lower(btrim(saved_category)) = lower(btrim(requested_category))
or lower(btrim(saved_category)) = any(case lower(btrim(requested_category))
when 'automotive / vehicle maintenance / service & repair' then array['automotive','vehicle maintenance','service & repair']
when 'marine / aviation / watersports' then array['marine','aviation','watersports']
when 'construction / skilled trades' then array['construction','skilled trades','welding','electrical','plumbing']
when 'general labour / cleaners' then array['general labour','cleaners','housekeeping & cleaning','domestic work']
when 'agricultural / gardening' then array['agriculture','agricultural','gardening']
when 'engineering / technical' then array['engineering','technical']
when 'transport / driving' then array['transport','driving','driving & logistics']
when 'security / safety' then array['security','safety']
when 'accounting / auditing / finance' then array['accounting','auditing','finance']
when 'logistic / warehouse / transport' then array['logistic','logistics','warehouse','transport','driving & logistics']
when 'sales / marketing / merchandise' then array['sales','marketing','merchandise']
when 'secretary / admin' then array['secretary','admin','administration']
when 'hr / training' then array['hr','human resources','training']
when 'hotel / restaurant / food' then array['hospitality','hotel','restaurant','food']
when 'spa / beauty / salon' then array['spa','beauty','salon']
when 'healthcare' then array['healthcare','caregiving']
else array[]::text[] end);
$$;
revoke all on function public.job_category_matches(text,text) from public;
grant execute on function public.job_category_matches(text,text) to anon,authenticated;
do $$
declare definition text;
begin
definition := pg_get_functiondef('public.search_public_jobs(text,text,text,text,integer,jsonb)'::regprocedure);
if position('category=p_category' in definition) = 0 then
raise exception 'Expected category predicate missing';
end if;
execute replace(definition, 'p_category='''' or category=p_category', 'public.job_category_matches(category,p_category)');
end $$;

