alter table public.categories
add column if not exists parent_id uuid references public.categories(id) on delete set null;

notify pgrst, 'reload schema';
