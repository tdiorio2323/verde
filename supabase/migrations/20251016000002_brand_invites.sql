create table if not exists public.brand_invites (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands(id) on delete cascade,
  email text not null,
  token text not null unique,
  created_by uuid not null,
  expires_at timestamptz not null default now() + interval '14 days',
  created_at timestamptz default now(),
  accepted_at timestamptz
);

alter table public.brand_invites enable row level security;

create policy "invites_read_admin_or_member"
on public.brand_invites for select
using (
  exists(select 1 from public.admins a where a.user_id = auth.uid())
  or public.is_member_of_brand(brand_id)
);

create policy "invites_write_admin_or_member"
on public.brand_invites for all
using (
  exists(select 1 from public.admins a where a.user_id = auth.uid())
  or public.is_member_of_brand(brand_id)
)
with check (
  exists(select 1 from public.admins a where a.user_id = auth.uid())
  or public.is_member_of_brand(brand_id)
);
