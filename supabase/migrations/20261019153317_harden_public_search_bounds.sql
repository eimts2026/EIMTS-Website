-- Public catalogue: one bounded page, matching total and facet counts.
-- SECURITY INVOKER preserves existing jobs RLS for every caller.
create or replace function public.search_public_jobs(
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
  with keyword_jobs as materialized (
    select j.id,j.slug,j.title,j.country,coalesce(nullif(j.location,''),j.country) as location,
      j.category,j.employment_type,j.urgent,j.image_url,j.image_position,j.expires_at,
      j.salary_amount,j.salary_lkr,j.currency,j.published_at,
      lower(case when p_sort='location-asc' then coalesce(nullif(j.location,''),j.country) else j.title end) collate "C" as sort_value
    from public.jobs j
    where j.status='published' and (j.expires_at is null or j.expires_at > now())
      and (p_keyword='' or strpos(lower(j.title || ' ' || j.category || ' ' || coalesce(nullif(j.location,''),j.country)),lower(p_keyword)) > 0)
  ), matching as materialized (
    select * from keyword_jobs where (p_location='' or location=p_location) and (p_category='' or category=p_category)
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
  locations as (select location as value,count(*) as count from keyword_jobs where p_category='' or category=p_category group by location),
  categories as (select category as value,count(*) as count from keyword_jobs where p_location='' or location=p_location group by category)
  select jsonb_build_object(
    'items',coalesce((select jsonb_agg(to_jsonb(s)-'row_num'-'sort_value'-'published_at' order by row_num) from shown s),'[]'::jsonb),
    'total',(select count(*) from matching),
    'nextCursor',case when (select count(*) from page)>p_page_size then
      (select jsonb_build_object('id',id,'urgent',urgent,'published_at',published_at,'sort_value',sort_value) from shown order by row_num desc limit 1) else null end,
    'locations',coalesce((select jsonb_agg(to_jsonb(l) order by value) from locations l),'[]'::jsonb),
    'categories',coalesce((select jsonb_agg(to_jsonb(c) order by value) from categories c),'[]'::jsonb)
  ) into result;
  return result;
end $$;
revoke all on function public.search_public_jobs(text,text,text,text,integer,jsonb) from public;
grant execute on function public.search_public_jobs(text,text,text,text,integer,jsonb) to anon,authenticated;

