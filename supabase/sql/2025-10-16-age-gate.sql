create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  phone text unique,
  full_name text,
  role text not null default 'customer' check (role in ('customer','driver','admin')),
  age_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

drop policy if exists "read own profile" on public.profiles;
create policy "read own profile" on public.profiles for select to authenticated using (auth.uid() = id);

drop policy if exists "update own profile" on public.profiles;
create policy "update own profile" on public.profiles for update to authenticated using (auth.uid() = id);

drop policy if exists "only age-verified read data" on public.profiles;
create policy "only age-verified read data" on public.profiles for select to authenticated using (auth.uid() = id and age_verified = true);

drop policy if exists "only age-verified update self" on public.profiles;
create policy "only age-verified update self" on public.profiles for update to authenticated using (auth.uid() = id and age_verified = true);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, phone) values (new.id, new.phone) on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

