-- Public shop for products and graphic design services
-- RLS-safe for public browsing

-- Shop items table
create table if not exists public.shop_items (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('product','service')),
  slug text unique not null,
  title text not null,
  description text,
  price_cents int not null check (price_cents >= 0),
  image_url text,
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);

-- Tags for shop items
create table if not exists public.shop_item_tags (
  item_id uuid references public.shop_items(id) on delete cascade,
  tag text not null,
  primary key (item_id, tag)
);

-- Performance indexes
create index if not exists idx_shop_items_slug on public.shop_items(slug);
create index if not exists idx_shop_items_public_created on public.shop_items(is_public, created_at desc);
create index if not exists idx_shop_item_tags_item on public.shop_item_tags(item_id);
create index if not exists idx_shop_item_tags_tag on public.shop_item_tags(tag);

-- RLS: public browse allowed for published items
alter table public.shop_items enable row level security;

create policy "public read published items"
on public.shop_items for select
to anon, authenticated
using (is_public = true);

create policy "service write items"
on public.shop_items for all
to service_role
using (true)
with check (true);

alter table public.shop_item_tags enable row level security;

create policy "public read tags"
on public.shop_item_tags for select
to anon, authenticated
using (exists (select 1 from public.shop_items si where si.id = item_id and si.is_public));

create policy "service write tags"
on public.shop_item_tags for all
to service_role
using (true)
with check (true);

-- Seed example services with placeholder images
insert into public.shop_items(kind,slug,title,description,price_cents,image_url)
values
('service','logo-package','Logo Package','3 concepts, 2 revisions, brand sheet', 75000, 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=600&fit=crop'),
('service','label-design','Label Design','Mylar bag or bottle label. Print-ready.', 25000, 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=600&fit=crop'),
('service','website-revamp','Website Revamp','Audit + redesign key pages.', 150000, 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop')
on conflict (slug) do update set image_url = excluded.image_url;

-- Seed tags
insert into public.shop_item_tags(item_id, tag)
select id, unnest(array['design','branding']) from public.shop_items where slug='logo-package'
union all
select id, unnest(array['design','packaging']) from public.shop_items where slug='label-design'
union all
select id, unnest(array['web','revamp']) from public.shop_items where slug='website-revamp'
on conflict do nothing;

