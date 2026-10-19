create or replace function public.claim_website_inquiries(p_limit integer default 3)
returns setof public.website_inquiry_outbox language plpgsql security invoker set search_path='' as $$
declare active_count integer; capacity integer;
begin
  -- Serialize only the short claiming transaction, never SMTP delivery.
  if not pg_try_advisory_xact_lock(9175402201::bigint) then return; end if;
  select count(*) into active_count from public.website_inquiry_outbox
    where status='processing' and locked_until>now();
  capacity := least(greatest(p_limit,1),3,greatest(3-active_count,0));
  if capacity=0 then return; end if;
  return query
    with candidates as (
      select id from public.website_inquiry_outbox
      where ((status='pending' and available_at<=now()) or (status='processing' and locked_until<now())) and attempts<5
      order by available_at,id for update skip locked limit capacity
    )
    update public.website_inquiry_outbox q set status='processing',attempts=attempts+1,locked_until=now()+interval '5 minutes'
    from candidates c where q.id=c.id returning q.*;
end $$;
revoke all on function public.claim_website_inquiries(integer) from public,anon,authenticated;
grant execute on function public.claim_website_inquiries(integer) to service_role;
