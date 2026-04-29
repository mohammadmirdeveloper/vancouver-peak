create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  ticket_id text unique not null,
  tour text not null,
  tour_name text not null,
  customer_name text not null,
  email text not null,
  phone text not null,
  pickup text,
  tour_date date not null,
  time_slot text not null,
  guests int not null,
  addon boolean default false,
  total int not null,
  created_at timestamptz default now()
);

create unique index if not exists unique_tour_date_slot
on public.orders (tour, tour_date, time_slot);

create table if not exists public.settings (
  key text primary key,
  value jsonb not null
);

insert into public.settings (key, value)
values
('prices', '{"sea":125,"grouse":100,"whistler":125,"addon":100}'::jsonb),
('images', '{
  "hero":"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=85",
  "sea":"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85",
  "grouse":"https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=1200&q=85",
  "whistler":"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=85"
}'::jsonb)
on conflict (key) do nothing;

-- Supabase Storage: create a public bucket named tour-images
