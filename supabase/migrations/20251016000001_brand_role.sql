-- core brand schema + RLS + admins + me_roles() RPC
create extension if not exists "pgcrypto";

create table if not exists public.admins (
  user_id uuid primary key
);

create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  created_at timestamptz default now()
);

create table if not exists public.brand_members (
  brand_id uuid references public.brands(id) on delete cascade,
  user_id uuid not null,
  role text check (role in ('owner','manager','staff')) not null default 'owner',
  created_at timestamptz default now(),
  primary key (brand_id, user_id)
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands(id) on delete cascade,
  name text not null,
  price_cents integer not null check (price_cents >= 0),
  active boolean not null default true,
  created_at timestamptz default now()
);

create table if not exists public.menus (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands(id) on delete cascade,
  name text not null,
  is_public boolean not null default true,
  created_at timestamptz default now()
);

create table if not exists public.menu_items (
  menu_id uuid references public.menus(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  position int default 0,
  primary key (menu_id, product_id)
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands(id) on delete cascade,
  user_id uuid,
  email text,
  phone text,
  created_at timestamptz default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands(id) on delete cascade,
  customer_id uuid references public.customers(id),
  status text check (status in ('pending','paid','preparing','out_for_delivery','delivered','canceled')) not null default 'pending',
  total_cents integer not null default 0,
  created_at timestamptz default now()
);

create or replace function public.is_member_of_brand(brand uuid)
returns boolean language sql stable as $$
  select exists(
    select 1 from public.brand_members bm
    where bm.brand_id = brand and bm.user_id = auth.uid()
  );
$$;

alter table public.brands enable row level security;
alter table public.brand_members enable row level security;
alter table public.products enable row level security;
alter table public.menus enable row level security;
alter table public.menu_items enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;

create policy "brands_read_admin_or_member_or_public"
on public.brands for select
using (
  exists(select 1 from public.admins a where a.user_id = auth.uid())
  or public.is_member_of_brand(id)
  or exists (select 1 from public.menus m where m.brand_id = brands.id and m.is_public)
);

create policy "brands_insert_admin_only"
on public.brands for insert
with check (exists(select 1 from public.admins a where a.user_id = auth.uid()));

create policy "brands_update_admin_only"
on public.brands for update
using (exists(select 1 from public.admins a where a.user_id = auth.uid()));

create policy "brands_delete_admin_only"
on public.brands for delete
using (exists(select 1 from public.admins a where a.user_id = auth.uid()));

create policy "brand_members_read_admin_or_member"
on public.brand_members for select
using (
  exists(select 1 from public.admins a where a.user_id = auth.uid())
  or public.is_member_of_brand(brand_id)
);

create policy "brand_members_admin_manage"
on public.brand_members for all
using (exists(select 1 from public.admins a where a.user_id = auth.uid()))
with check (exists(select 1 from public.admins a where a.user_id = auth.uid()));

create policy "products_read_admin_member_or_public_menu"
on public.products for select
using (
  exists(select 1 from public.admins a where a.user_id = auth.uid())
  or public.is_member_of_brand(brand_id)
  or exists (
    select 1 from public.menu_items mi
    join public.menus m on m.id = mi.menu_id
    where mi.product_id = products.id and m.is_public = true
  )
);

create policy "products_write_admin_or_member"
on public.products for all
using (
  exists(select 1 from public.admins a where a.user_id = auth.uid())
  or public.is_member_of_brand(brand_id)
)
with check (
  exists(select 1 from public.admins a where a.user_id = auth.uid())
  or public.is_member_of_brand(brand_id)
);

create policy "menus_read_public_or_member_or_admin"
on public.menus for select
using (
  is_public = true
  or public.is_member_of_brand(brand_id)
  or exists(select 1 from public.admins a where a.user_id = auth.uid())
);

create policy "menus_write_admin_or_member"
on public.menus for all
using (
  exists(select 1 from public.admins a where a.user_id = auth.uid())
  or public.is_member_of_brand(brand_id)
)
with check (
  exists(select 1 from public.admins a where a.user_id = auth.uid())
  or public.is_member_of_brand(brand_id)
);

create policy "menu_items_rw_admin_or_member"
on public.menu_items for all
using (
  exists(select 1 from public.admins a where a.user_id = auth.uid())
  or public.is_member_of_brand((select brand_id from public.menus where id = menu_id))
)
with check (
  exists(select 1 from public.admins a where a.user_id = auth.uid())
  or public.is_member_of_brand((select brand_id from public.menus where id = menu_id))
);

create policy "customers_rw_admin_or_member"
on public.customers for all
using (
  exists(select 1 from public.admins a where a.user_id = auth.uid())
  or public.is_member_of_brand(brand_id)
)
with check (
  exists(select 1 from public.admins a where a.user_id = auth.uid())
  or public.is_member_of_brand(brand_id)
);

create policy "orders_rw_admin_or_member"
on public.orders for all
using (
  exists(select 1 from public.admins a where a.user_id = auth.uid())
  or public.is_member_of_brand(brand_id)
)
with check (
  exists(select 1 from public.admins a where a.user_id = auth.uid())
  or public.is_member_of_brand(brand_id)
);

create or replace function public.me_roles()
returns table(is_admin boolean, brand_ids uuid[])
language sql stable as $$
  select
    exists(select 1 from public.admins a where a.user_id = auth.uid()) as is_admin,
    coalesce(array(
      select bm.brand_id from public.brand_members bm where bm.user_id = auth.uid()
    ), '{}') as brand_ids;
$$;
