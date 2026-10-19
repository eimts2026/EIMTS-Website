-- Public catalogue: one bounded page, matching total and facet counts.
-- SECURITY INVOKER preserves existing jobs RLS for every caller.
create or replace function public.search_public_jobs(
  p_keyword text default '', p_location text default '', p_category text default '',
  p_sort text default 'default', p_page_size integer default 6, p_cursor jsonb default null
) returns jsonb language plpgsql stable security invoker set search_path = '' as $$
declare result jsonb;
begin
  if length(p_keyword) > 100 or length(p_location) > 160 or length(p_category) > 160
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

-- Only server-side service credentials can access submission infrastructure.
create table public.website_rate_limits (
  key text primary key,
  hits integer not null,
  expires_at timestamptz not null
);
alter table public.website_rate_limits enable row level security;
revoke all on public.website_rate_limits from anon,authenticated;
grant select,insert,update,delete on public.website_rate_limits to service_role;
create index website_rate_limits_expiry on public.website_rate_limits(expires_at);

create or replace function public.allow_website_submission(p_key text,p_limit integer,p_seconds integer)
returns boolean language plpgsql security invoker set search_path='' as $$
declare n integer;
begin
  if length(p_key)>128 or p_limit not between 1 and 100 or p_seconds not between 1 and 86400 then raise exception 'Invalid rate limit'; end if;
  insert into public.website_rate_limits(key,hits,expires_at) values(p_key,1,now()+make_interval(secs=>p_seconds))
  on conflict(key) do update set
    hits=case when website_rate_limits.expires_at<=now() then 1 else least(website_rate_limits.hits+1,p_limit+1) end,
    expires_at=case when website_rate_limits.expires_at<=now() then now()+make_interval(secs=>p_seconds) else website_rate_limits.expires_at end
  returning hits into n;
  return n<=p_limit;
end $$;
revoke all on function public.allow_website_submission(text,integer,integer) from public,anon,authenticated;
grant execute on function public.allow_website_submission(text,integer,integer) to service_role;

create table public.website_inquiry_outbox (
  id uuid primary key,
  kind text not null check(kind in ('contact','employer')),
  payload jsonb not null,
  payload_hash text not null,
  status text not null default 'pending' check(status in ('pending','processing','sent','dead')),
  attempts integer not null default 0,
  available_at timestamptz not null default now(),
  locked_until timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);
alter table public.website_inquiry_outbox enable row level security;
revoke all on public.website_inquiry_outbox from anon,authenticated;
grant select,insert,update,delete on public.website_inquiry_outbox to service_role;
create index website_inquiry_pending on public.website_inquiry_outbox(available_at) where status in ('pending','processing');

create or replace function public.claim_website_inquiries(p_limit integer default 3)
returns setof public.website_inquiry_outbox language sql security invoker set search_path='' as $$
  with candidates as (
    select id from public.website_inquiry_outbox
    where ((status='pending' and available_at<=now()) or (status='processing' and locked_until<now())) and attempts<5
    order by available_at,id for update skip locked limit least(greatest(p_limit,1),3)
  )
  update public.website_inquiry_outbox q set status='processing',attempts=attempts+1,locked_until=now()+interval '5 minutes'
  from candidates c where q.id=c.id returning q.*;
$$;
revoke all on function public.claim_website_inquiries(integer) from public,anon,authenticated;
grant execute on function public.claim_website_inquiries(integer) to service_role;
