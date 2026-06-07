alter table public.site_settings
add column if not exists home_hero_image_url text,
add column if not exists home_story_image_url text,
add column if not exists about_hero_image_url text,
add column if not exists about_founder_image_url text;

notify pgrst, 'reload schema';
