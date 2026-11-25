-- Keep the original category for old dashboard clients and historical URLs.
create function public.job_primary_category(children text[]) returns text
language sql immutable strict security invoker set search_path = '' as $$
  select case
    when children <@ array['Hotel / Restaurant / Food', 'Spa / Beauty / Salon', 'Healthcare'] then 'Hospitality & Healthcare'
    when children <@ array['Sales / Marketing / Merchandise', 'Accounting / Auditing / Finance', 'Logistic / Warehouse / Transport', 'Secretary / Admin', 'HR / Training', 'Education'] then 'Retail, Admin & Accounts'
    when children <@ array['Automotive / Vehicle Maintenance / Service & Repair', 'Marine / Aviation / Watersports', 'Engineering / Technical / Skilled Trades', 'Agricultural / Gardening / Skilled & Unskilled Labour', 'Security / Safety'] then 'Engineering'
  end
  where cardinality(children) > 0 and array_ndims(children) = 1
    and cardinality(children) = (select count(distinct child) from unnest(children) child);
$$;

alter table public.jobs
  add column subcategories text[],
  add column primary_category text generated always as (public.job_primary_category(subcategories)) stored,
  add constraint jobs_subcategories_one_group check (subcategories is null or primary_category is not null);

create function public.job_category_filter(label text) returns text
language sql immutable strict security invoker set search_path = '' as $$
  select case
    when lower(btrim(label)) = any(array['hospitality', 'hotel', 'restaurant', 'food']) then 'Hotel / Restaurant / Food'
    when lower(btrim(label)) = any(array['spa', 'beauty', 'salon']) then 'Spa / Beauty / Salon'
    when lower(btrim(label)) = any(array['caregiving']) then 'Healthcare'
    when lower(btrim(label)) = any(array['retail', 'sales', 'marketing', 'merchandise']) then 'Sales / Marketing / Merchandise'
    when lower(btrim(label)) = any(array['accounting', 'auditing', 'finance']) then 'Accounting / Auditing / Finance'
    when lower(btrim(label)) = any(array['transport / driving', 'driving & logistics', 'transport', 'driving', 'logistic', 'logistics', 'warehouse']) then 'Logistic / Warehouse / Transport'
    when lower(btrim(label)) = any(array['secretary', 'admin', 'administration']) then 'Secretary / Admin'
    when lower(btrim(label)) = any(array['hr', 'human resources', 'training']) then 'HR / Training'
    when lower(btrim(label)) = any(array['automotive', 'vehicle maintenance', 'service & repair']) then 'Automotive / Vehicle Maintenance / Service & Repair'
    when lower(btrim(label)) = any(array['marine', 'aviation', 'watersports']) then 'Marine / Aviation / Watersports'
    when lower(btrim(label)) = any(array['construction / skilled trades', 'engineering / technical', 'construction', 'skilled trades', 'welding', 'electrical', 'plumbing', 'technical']) then 'Engineering / Technical / Skilled Trades'
    when lower(btrim(label)) = any(array['agricultural / gardening', 'general labour / cleaners', 'agriculture', 'agricultural', 'gardening', 'general labour', 'cleaners', 'housekeeping & cleaning', 'domestic work']) then 'Agricultural / Gardening / Skilled & Unskilled Labour'
    when lower(btrim(label)) = any(array['security', 'safety']) then 'Security / Safety'
    else btrim(label) end;
$$;

-- Also handle writes from dashboard versions that only send the legacy category.
create function public.assign_legacy_job_subcategories() returns trigger
language plpgsql security invoker set search_path = '' as $$
declare mapped text;
begin
  if tg_op = 'UPDATE' then
    if new.subcategories is distinct from old.subcategories then return new; end if;
    if new.subcategories is not null and (new.category = old.category or new.category = new.subcategories[1]) then return new; end if;
  elsif new.subcategories is not null then return new;
  end if;
  mapped := public.job_category_filter(new.category);
  new.subcategories := case
    when new.category = 'Manufacturing' and new.slug = 'job-opportunities-in-qatar' then array['Accounting / Auditing / Finance', 'Secretary / Admin', 'HR / Training']
    when new.category = 'Engineering' and new.slug = 'ireland-new-employment-opportunities' then array['Automotive / Vehicle Maintenance / Service & Repair', 'Engineering / Technical / Skilled Trades', 'Agricultural / Gardening / Skilled & Unskilled Labour']
    when new.category = 'Engineering' and new.slug in ('work-in-ireland-automotive-job-opportunities','hiring-diesel-mechanics-auto-electricians-for-uae','uae-career-opportunities') then array['Automotive / Vehicle Maintenance / Service & Repair']
    when new.category = 'Construction' and new.slug = 'groundworkers-for-ireland' then array['Engineering / Technical / Skilled Trades', 'Agricultural / Gardening / Skilled & Unskilled Labour']
    when new.category = 'Hospitality' and new.slug = 'kitchen-equipment-technician-handyman-vacancies-for-oman' then array['Engineering / Technical / Skilled Trades']
    when new.category = 'Engineering' then array['Engineering / Technical / Skilled Trades']
    when public.job_primary_category(array[mapped]) is not null then array[mapped]
    else null end;
  return new;
end;
$$;
create trigger jobs_assign_legacy_subcategories before insert or update of category, subcategories on public.jobs
for each row execute function public.assign_legacy_job_subcategories();
-- Preserve the editorial timestamps during this one-time classification.
alter table public.jobs disable trigger jobs_set_updated_at;
update public.jobs set subcategories = null where subcategories is null;
alter table public.jobs enable trigger jobs_set_updated_at;

-- Public catalogue: one bounded page, matching total and facet counts.
-- SECURITY INVOKER preserves existing jobs RLS for every caller.
create or replace function public.search_public_jobs_by_category(
  p_keyword text default '', p_location text default '', p_category text default '',
  p_sort text default 'default', p_page_size integer default 6, p_cursor jsonb default null
) returns jsonb language plpgsql stable security invoker set search_path = '' as $$
declare result jsonb;
begin
  if p_keyword is null or p_location is null or p_category is null or p_sort is null or p_page_size is null
     or length(p_keyword) > 100 or length(p_location) > 160 or length(p_category) > 160
     or p_sort not in ('default','title-asc','location-asc') or p_page_size not in (6,12)
     or (p_cursor is not null and (jsonb_typeof(p_cursor) <> 'object' or not (p_cursor ? 'id'))) then
    raise exception 'Invalid catalogue filters' using errcode='22023';
  end if;
  p_category := public.job_category_filter(p_category);
  with keyword_jobs as materialized (
    select j.id,j.slug,j.title,j.country,coalesce(nullif(j.location,''),j.country) as location,
      j.category,j.primary_category,j.subcategories,j.employment_type,j.urgent,j.image_url,j.image_position,j.expires_at,
      j.salary_negotiable,j.salary_amount,j.salary_lkr,j.currency,j.published_at,
      (p_category='' or j.primary_category=p_category or p_category=any(j.subcategories)
        or j.category=p_category or (j.subcategories is null and public.job_category_matches(j.category,p_category))) as category_match,
      lower(case when p_sort='location-asc' then coalesce(nullif(j.location,''),j.country) else j.title end) collate "C" as sort_value
    from public.jobs j
    where j.status='published' and (j.expires_at is null or j.expires_at > now())
      and (p_keyword='' or strpos(lower(j.title || ' ' || j.category || ' ' || coalesce(j.primary_category,'') || ' ' || coalesce(array_to_string(j.subcategories,' '),'') || ' ' || coalesce(nullif(j.location,''),j.country)),lower(p_keyword)) > 0)
  ), matching as materialized (
    select * from keyword_jobs where (p_location='' or location=p_location) and (category_match)
  ), eligible as (
    select * from matching where p_cursor is null or case when p_sort='default' then
      (urgent,coalesce(published_at,'-infinity'::timestamptz),id) <
      ((p_cursor->>'urgent')::boolean,coalesce((p_cursor->>'published_at')::timestamptz,'-infinity'::timestamptz),(p_cursor->>'id')::uuid)
    else (sort_value,id) > ((p_cursor->>'sort_value') collate "C",(p_cursor->>'id')::uuid) end
  ), page as materialized (
    select * from eligible order by
      case when p_sort='default' then urgent end desc,
      case when p_sort='default' then published_at end desc nulls last,
      case when p_sort<>'default' then sort_value end collate "C" asc,
      case when p_sort='default' then id end desc,
      case when p_sort<>'default' then id end asc
    limit p_page_size+1
  ), numbered as (select *, row_number() over (order by
      case when p_sort='default' then urgent end desc,
      case when p_sort='default' then published_at end desc nulls last,
      case when p_sort<>'default' then sort_value end collate "C" asc,
      case when p_sort='default' then id end desc,
      case when p_sort<>'default' then id end asc) as row_num from page),
  shown as (select * from numbered where row_num<=p_page_size),
  locations as (select location as value,count(*) as count from keyword_jobs where category_match group by location),
  categories as (select label as value,count(*) as count from keyword_jobs
    cross join lateral unnest(case when primary_category is null then array[category]
      else array_prepend(primary_category, subcategories) end) label
    where p_location='' or location=p_location group by label)
  select jsonb_build_object(
    'items',coalesce((select jsonb_agg(to_jsonb(s)-'category_match'-'row_num'-'sort_value'-'published_at' order by row_num) from shown s),'[]'::jsonb),
    'total',(select count(*) from matching),
    'nextCursor',case when (select count(*) from page)>p_page_size then
      (select jsonb_build_object('id',id,'urgent',urgent,'published_at',published_at,'sort_value',sort_value) from shown order by row_num desc limit 1) else null end,
    'locations',coalesce((select jsonb_agg(to_jsonb(l) order by value) from locations l),'[]'::jsonb),
    'categories',coalesce((select jsonb_agg(to_jsonb(c) order by value) from categories c),'[]'::jsonb)
  ) into result;
  return result;
end $$;
revoke all on function public.search_public_jobs_by_category(text,text,text,text,integer,jsonb) from public;
grant execute on function public.search_public_jobs_by_category(text,text,text,text,integer,jsonb) to anon,authenticated;
