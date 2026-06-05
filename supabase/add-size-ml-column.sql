alter table public.products
add column if not exists size_ml text;

notify pgrst, 'reload schema';
