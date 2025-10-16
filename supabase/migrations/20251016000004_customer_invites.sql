create table if not exists public.customer_invites (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands(id) on delete cascade,
  email text not null,
  token text not null unique,
  created_by uuid not null,
  expires_at timestamptz not null default now() + interval '30 days',
  created_at timestamptz default now(),
  accepted_at timestamptz
);

alter table public.customer_invites enable row level security;

create policy "customer_invites_read_admin_or_member"
on public.customer_invites for select
using (
  exists(select 1 from public.admins a where a.user_id = auth.uid())
  or public.is_member_of_brand(brand_id)
);

create policy "customer_invites_write_admin_or_member"
on public.customer_invites for all
using (
  exists(select 1 from public.admins a where a.user_id = auth.uid())
  or public.is_member_of_brand(brand_id)
)
with check (
  exists(select 1 from public.admins a where a.user_id = auth.uid())
  or public.is_member_of_brand(brand_id)
);

-- Redeem: create CRM record, optionally link to auth user if signed in
create or replace function public.redeem_customer_invite(invite_token text)
returns table(brand_id uuid, customer_id uuid, linked boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_brand uuid;
  v_invite uuid;
  v_customer uuid;
  v_user uuid;
  v_email text;
begin
  select ci.id, ci.brand_id, ci.email
  into v_invite, v_brand, v_email
  from public.customer_invites ci
  where ci.token = invite_token
    and ci.accepted_at is null
    and ci.expires_at > now()
  limit 1;

  if v_brand is null then
    raise exception 'invalid_or_expired_invite';
  end if;

  v_user := auth.uid();

  -- upsert customer row
  insert into public.customers(id, brand_id, user_id, email)
  values (gen_random_uuid(), v_brand, v_user, v_email)
  on conflict do nothing;

  -- Fixed: qualify column names to avoid ambiguity
  select c.id into v_customer
  from public.customers c
  where c.brand_id = v_brand 
    and (c.email = v_email or (v_user is not null and c.user_id = v_user))
  order by c.created_at asc
  limit 1;

  update public.customer_invites
  set accepted_at = now()
  where id = v_invite;

  return query select v_brand, v_customer, v_user is not null;
end $$;

revoke all on function public.redeem_customer_invite(text) from public;
grant execute on function public.redeem_customer_invite(text) to anon, authenticated;

