-- Publish hero slide changes to connected homepage clients and use the new
-- optimized, locally hosted hero artwork for the original seeded slides.
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'hero_slides'
  ) then
    alter publication supabase_realtime add table public.hero_slides;
  end if;
end;
$$;

update public.hero_slides
set image_url = case image_url
  when '/assets/emerald-journey-hero.webp' then '/assets/hero-careers-airport.webp'
  when '/assets/hero-employer-partnership.webp' then '/assets/hero-careers-healthcare.webp'
  when '/assets/hero-travel-guidance.webp' then '/assets/hero-careers-engineering.webp'
  else image_url
end
where image_url in (
  '/assets/emerald-journey-hero.webp',
  '/assets/hero-employer-partnership.webp',
  '/assets/hero-travel-guidance.webp'
);
