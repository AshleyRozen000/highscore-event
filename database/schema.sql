-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Prizes Table (存储所有防伪码)
create table public.prizes (
  id uuid default gen_random_uuid() primary key,
  code text not null unique,
  prize_type text not null, -- 奖品名称 (e.g., 'DJI Mini Drone', '5 USD Voucher')
  category text not null, -- 类别: 'PHYSICAL' (实物) or 'VOUCHER' (优惠券)
  status text not null default 'active', -- 状态: 'active' (未兑换), 'redeemed' (已兑换)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Redemptions Table (存储实物奖品的兑换信息)
create table public.redemptions (
  id uuid default gen_random_uuid() primary key,
  prize_code text references public.prizes(code) not null,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  address text not null,
  city text not null,
  zip_code text not null,
  country text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Row Level Security (RLS) Policies
alter table public.prizes enable row level security;
alter table public.redemptions enable row level security;

-- Policy: 允许前端查询 Prize 状态 (用于验证 Code)
create policy "Enable read access for all users"
  on public.prizes for select
  using (true);

-- Policy: 允许前端插入 Redemption 记录 (用户填表)
create policy "Enable insert for all users"
  on public.redemptions for insert
  with check (true);

-- Function: 兑换成功后自动更新 Prize 状态为 'redeemed'
create or replace function mark_prize_as_redeemed()
returns trigger as $$
begin
  update public.prizes
  set status = 'redeemed'
  where code = new.prize_code;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger: 监听 Redemptions 插入事件
create trigger on_redemption_created
  after insert on public.redemptions
  for each row execute procedure mark_prize_as_redeemed();
