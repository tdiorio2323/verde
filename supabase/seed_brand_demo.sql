-- supabase/seed_brand_demo.sql
-- Demo data for BRAND role flows. Safe to run multiple times.

-- 1) Demo brand
insert into public.brands (id, name, slug)
values (
  coalesce(
    (select id from public.brands where slug = 'verde-demo-brand' limit 1),
    gen_random_uuid()
  ),
  'Verde Demo Brand',
  'verde-demo-brand'
)
on conflict (slug) do nothing;

-- Get brand_id
with b as (
  select id from public.brands where slug = 'verde-demo-brand' limit 1
)
-- 2) Menus
insert into public.menus (id, brand_id, name, is_public)
select
  coalesce(
    (select id from public.menus where brand_id = b.id and name = 'Main Menu' limit 1),
    gen_random_uuid()
  ),
  b.id,
  'Main Menu',
  true
from b
on conflict do nothing;

-- 3) Products
with b as (select id from public.brands where slug = 'verde-demo-brand' limit 1)
insert into public.products (id, brand_id, name, price_cents, active)
select gen_random_uuid(), b.id, n, p, true
from b,
     (values
       ('Sunset Gelato 3.5g', 4200),
       ('Purple Haze 3.5g', 3800),
       ('Lemon Fuel 1g Cart', 3200),
       ('Gummies 10-pack', 2500)
     ) as prod(n, p)
on conflict do nothing;

-- 4) Menu items (attach all products to Main Menu)
with
b as (select id from public.brands where slug = 'verde-demo-brand' limit 1),
m as (select id from public.menus  where brand_id = (select id from b) and name = 'Main Menu' limit 1)
insert into public.menu_items (menu_id, product_id, position)
select
  (select id from m),
  p.id,
  row_number() over (order by p.created_at)
from public.products p
where p.brand_id = (select id from b)
on conflict do nothing;

-- 5) Demo customers
with b as (select id from public.brands where slug = 'verde-demo-brand' limit 1)
insert into public.customers (id, brand_id, email, phone)
select gen_random_uuid(), b.id, c.email, c.phone
from b,
     (values
       ('demo.alex@example.com','+15550100001'),
       ('demo.sam@example.com', '+15550100002'),
       ('demo.rin@example.com', '+15550100003')
     ) as c(email, phone)
on conflict do nothing;

-- 6) Demo orders
with
b as (select id from public.brands where slug = 'verde-demo-brand' limit 1),
c as (select id from public.customers where brand_id = (select id from b) limit 1)
insert into public.orders (id, brand_id, customer_id, status, total_cents)
select gen_random_uuid(), (select id from b), (select id from c), s, t
from (values
  ('paid',  4200),
  ('delivered', 7000),
  ('pending', 3200)
) as o(s, t)
on conflict do nothing;

-- 7) Demo invite (brand owner)
-- Replace this email before sending. Token is pre-generated. Accept flow will upsert membership.
with b as (select id from public.brands where slug = 'verde-demo-brand' limit 1)
insert into public.brand_invites (id, brand_id, email, token, created_by, expires_at)
select
  gen_random_uuid(),
  b.id,
  'owner.to.replace@example.com',
  encode(gen_random_bytes(16), 'hex'),
  -- created_by can be null if not known; use a dummy UUID that won't pass RLS outside service role contexts
  '00000000-0000-0000-0000-000000000000',
  now() + interval '14 days'
from b
on conflict do nothing;

-- 8) Output summary
do $$
declare
  v_brand uuid;
  v_menu uuid;
  v_invite text;
begin
  select id into v_brand from public.brands where slug = 'verde-demo-brand' limit 1;
  select id into v_menu  from public.menus  where brand_id = v_brand and name = 'Main Menu' limit 1;
  select token into v_invite from public.brand_invites where brand_id = v_brand order by created_at desc limit 1;

  raise notice 'Seed complete.';
  raise notice 'Brand ID: %', v_brand;
  raise notice 'Menu  ID: %', v_menu;
  raise notice 'Invite token (replace email before using): %', v_invite;
  raise notice 'Example invite URL: /invite?token=%', v_invite;
end $$;

