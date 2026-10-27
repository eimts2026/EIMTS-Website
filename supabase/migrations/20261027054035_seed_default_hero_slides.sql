-- Make the three built-in homepage hero slides editable and visible in the
-- dashboard instead of leaving them as hidden code-only fallbacks.
insert into public.hero_slides
  (kicker, title, copy, image_url, cta_label, cta_url, cta2_label, cta2_url, sort_order, active, is_takeover)
select seed.kicker, seed.title, seed.copy, seed.image_url,
       seed.cta_label, seed.cta_url, seed.cta2_label, seed.cta2_url,
       seed.sort_order, true, false
from (values
  (
    'Trusted in Sri Lanka since 1995',
    '32+ years of connecting Sri Lankan talent with global opportunity.',
    'Responsible overseas recruitment, documentation and travel guidance, supported by one accountable team.',
    '/assets/hero-careers-airport.webp',
    'Explore foreign jobs', '/foreign-job-vacancies/',
    'Hire exceptional talent', '/client-recruitment-solutions/',
    10
  ),
  (
    'Trusted recruitment. Stronger teams.',
    'Exceptional people build stronger businesses.',
    'Industry-focused recruitment connecting respected employers with carefully screened talent.',
    '/assets/hero-careers-healthcare.webp',
    'Explore foreign jobs', '/foreign-job-vacancies/',
    'Hire exceptional talent', '/client-recruitment-solutions/',
    20
  ),
  (
    'From application to arrival.',
    'Every overseas journey deserves clear guidance.',
    'Recruitment, documentation and travel support brought together by one accountable team.',
    '/assets/hero-careers-engineering.webp',
    'Explore foreign jobs', '/foreign-job-vacancies/',
    'Hire exceptional talent', '/client-recruitment-solutions/',
    30
  )
) as seed(kicker, title, copy, image_url, cta_label, cta_url, cta2_label, cta2_url, sort_order)
where not exists (select 1 from public.hero_slides);
