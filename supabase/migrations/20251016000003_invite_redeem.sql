-- Brand admin/member invite → adds current user to brand_members
create or replace function public.redeem_brand_invite(invite_token text, member_role text default 'owner')
returns table(brand_id uuid, added boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_brand uuid;
  v_invite_id uuid;
begin
  -- validate role
  if member_role not in ('owner','manager','staff') then
    raise exception 'invalid role';
  end if;

  -- find valid invite
  select bi.id, bi.brand_id
  into v_invite_id, v_brand
  from public.brand_invites bi
  where bi.token = invite_token
    and bi.accepted_at is null
    and bi.expires_at > now()
  limit 1;

  if v_brand is null then
    raise exception 'invalid_or_expired_invite';
  end if;

  -- insert membership (upsert)
  insert into public.brand_members(brand_id, user_id, role)
  values (v_brand, auth.uid(), member_role)
  on conflict (brand_id, user_id) do update set role = excluded.role;

  -- mark invite accepted
  update public.brand_invites
  set accepted_at = now()
  where id = v_invite_id;

  return query select v_brand, true;
end $$;

revoke all on function public.redeem_brand_invite(text, text) from public;
grant execute on function public.redeem_brand_invite(text, text) to authenticated;

