-- AI prompt kayıtları. Supabase SQL Editor veya CLI ile uygulayın.
create table if not exists public.ai_prompts (
  id uuid primary key default gen_random_uuid(),
  title text,
  content text not null,
  created_at timestamptz not null default now(),
  constraint ai_prompts_content_not_blank check (char_length(trim(content)) > 0)
);

create index if not exists ai_prompts_created_at_idx on public.ai_prompts (created_at desc);

alter table public.ai_prompts enable row level security;

-- Demo / geliştirme: herkes okuyup ekleyebilir. Üretimde auth ve kullanıcıya özel policy kullanın.
create policy "ai_prompts_select_all"
  on public.ai_prompts
  for select
  to anon, authenticated
  using (true);

create policy "ai_prompts_insert_all"
  on public.ai_prompts
  for insert
  to anon, authenticated
  with check (true);
