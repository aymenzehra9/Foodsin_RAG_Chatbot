create extension if not exists vector with schema extensions;
create extension if not exists pgcrypto;

create table restaurants (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  name text not null,
  description text,
  phone text,
  whatsapp text,
  email text,
  website text,
  address text,
  city text,
  opening_hours text,
  delivery_areas text,
  payment_methods text,
  tax_note text default 'All prices are exclusive of sales tax and may change without prior notice.',
  logo_url text,
  cover_image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table menu_categories (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references restaurants(id) on delete cascade,
  name text not null,
  description text,
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table menu_items (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references restaurants(id) on delete cascade,
  category_id uuid references menu_categories(id) on delete set null,
  name text not null,
  description text,
  price numeric(10,2),
  image_url text,
  spice_level text,
  serving_size text,
  is_available boolean default true,
  is_popular boolean default false,
  is_recommended boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table deals (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references restaurants(id) on delete cascade,
  title text not null,
  description text,
  price numeric(10,2),
  start_date date,
  end_date date,
  is_active boolean default true,
  terms text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table faqs (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references restaurants(id) on delete cascade,
  question text not null,
  answer text not null,
  category text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table knowledge_documents (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references restaurants(id) on delete cascade,
  title text not null,
  source_type text not null check (source_type in ('manual', 'menu', 'faq', 'deal', 'profile', 'pdf', 'txt', 'docx', 'website')),
  content text,
  file_url text,
  metadata jsonb default '{}',
  status text default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table knowledge_chunks (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references restaurants(id) on delete cascade,
  document_id uuid references knowledge_documents(id) on delete cascade,
  content text not null,
  chunk_index int not null,
  token_count int,
  metadata jsonb default '{}',
  embedding extensions.vector(1536),
  created_at timestamptz default now()
);

create table chat_sessions (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references restaurants(id) on delete cascade,
  customer_name text,
  customer_phone text,
  customer_email text,
  status text default 'active' check (status in ('active', 'closed')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table chat_messages (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references restaurants(id) on delete cascade,
  session_id uuid references chat_sessions(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  sources jsonb default '[]',
  created_at timestamptz default now()
);

create table leads (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references restaurants(id) on delete cascade,
  session_id uuid references chat_sessions(id) on delete set null,
  type text not null check (type in ('order', 'reservation', 'general')),
  customer_name text,
  phone text,
  email text,
  address text,
  message text,
  details jsonb default '{}',
  status text default 'new' check (status in ('new', 'contacted', 'confirmed', 'cancelled', 'completed')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table chatbot_settings (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references restaurants(id) on delete cascade unique,
  bot_name text default 'MenuMate AI',
  welcome_message text default 'Hi! Welcome to our restaurant. How can I help you today?',
  fallback_message text default 'I do not have this information right now. Please contact the restaurant directly.',
  primary_color text default '#f97316',
  is_active boolean default true,
  collect_leads boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create or replace function match_knowledge_chunks (
  query_embedding extensions.vector(1536),
  match_restaurant_id uuid,
  match_count int default 5,
  similarity_threshold float default 0.50
)
returns table (
  id uuid,
  document_id uuid,
  restaurant_id uuid,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    knowledge_chunks.id,
    knowledge_chunks.document_id,
    knowledge_chunks.restaurant_id,
    knowledge_chunks.content,
    knowledge_chunks.metadata,
    1 - (knowledge_chunks.embedding <=> query_embedding) as similarity
  from knowledge_chunks
  where knowledge_chunks.restaurant_id = match_restaurant_id
    and knowledge_chunks.embedding is not null
    and 1 - (knowledge_chunks.embedding <=> query_embedding) > similarity_threshold
  order by knowledge_chunks.embedding <=> query_embedding
  limit match_count;
end;
$$;

create index knowledge_chunks_embedding_idx on knowledge_chunks using hnsw (embedding extensions.vector_cosine_ops);

alter table restaurants enable row level security;
alter table menu_categories enable row level security;
alter table menu_items enable row level security;
alter table deals enable row level security;
alter table faqs enable row level security;
alter table knowledge_documents enable row level security;
alter table knowledge_chunks enable row level security;
alter table chat_sessions enable row level security;
alter table chat_messages enable row level security;
alter table leads enable row level security;
alter table chatbot_settings enable row level security;

create policy "Admins manage own restaurants" on restaurants for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "Admins manage categories" on menu_categories for all using (exists (select 1 from restaurants where restaurants.id = restaurant_id and restaurants.owner_id = auth.uid())) with check (exists (select 1 from restaurants where restaurants.id = restaurant_id and restaurants.owner_id = auth.uid()));
create policy "Admins manage menu items" on menu_items for all using (exists (select 1 from restaurants where restaurants.id = restaurant_id and restaurants.owner_id = auth.uid())) with check (exists (select 1 from restaurants where restaurants.id = restaurant_id and restaurants.owner_id = auth.uid()));
create policy "Admins manage deals" on deals for all using (exists (select 1 from restaurants where restaurants.id = restaurant_id and restaurants.owner_id = auth.uid())) with check (exists (select 1 from restaurants where restaurants.id = restaurant_id and restaurants.owner_id = auth.uid()));
create policy "Admins manage faqs" on faqs for all using (exists (select 1 from restaurants where restaurants.id = restaurant_id and restaurants.owner_id = auth.uid())) with check (exists (select 1 from restaurants where restaurants.id = restaurant_id and restaurants.owner_id = auth.uid()));
create policy "Admins manage knowledge documents" on knowledge_documents for all using (exists (select 1 from restaurants where restaurants.id = restaurant_id and restaurants.owner_id = auth.uid())) with check (exists (select 1 from restaurants where restaurants.id = restaurant_id and restaurants.owner_id = auth.uid()));
create policy "Admins manage knowledge chunks" on knowledge_chunks for all using (exists (select 1 from restaurants where restaurants.id = restaurant_id and restaurants.owner_id = auth.uid())) with check (exists (select 1 from restaurants where restaurants.id = restaurant_id and restaurants.owner_id = auth.uid()));
create policy "Admins manage chat sessions" on chat_sessions for select using (exists (select 1 from restaurants where restaurants.id = restaurant_id and restaurants.owner_id = auth.uid()));
create policy "Admins manage chat messages" on chat_messages for select using (exists (select 1 from restaurants where restaurants.id = restaurant_id and restaurants.owner_id = auth.uid()));
create policy "Admins manage leads" on leads for all using (exists (select 1 from restaurants where restaurants.id = restaurant_id and restaurants.owner_id = auth.uid())) with check (exists (select 1 from restaurants where restaurants.id = restaurant_id and restaurants.owner_id = auth.uid()));
create policy "Admins manage settings" on chatbot_settings for all using (exists (select 1 from restaurants where restaurants.id = restaurant_id and restaurants.owner_id = auth.uid())) with check (exists (select 1 from restaurants where restaurants.id = restaurant_id and restaurants.owner_id = auth.uid()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('restaurant-logos', 'restaurant-logos', true, 10485760, array['image/jpeg', 'image/png', 'image/webp']),
  ('restaurant-covers', 'restaurant-covers', true, 10485760, array['image/jpeg', 'image/png', 'image/webp']),
  ('menu-images', 'menu-images', true, 10485760, array['image/jpeg', 'image/png', 'image/webp']),
  ('knowledge-documents', 'knowledge-documents', false, 10485760, array['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict (id) do nothing;
