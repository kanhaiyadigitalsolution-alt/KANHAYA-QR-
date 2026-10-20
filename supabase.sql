create table shops(id uuid primary key default gen_random_uuid(), code text unique not null, name text not null, owner text, phone text, city text, printer text, login_id text unique not null, pass_hash text not null, price_bw numeric, price_color numeric, active boolean default true, created_at timestamptz default now());
create table jobs(id uuid primary key default gen_random_uuid(), shop_id uuid references shops(id) on delete cascade, token int, customer text, file_name text, file_path text, paper text, color text, sides text, copies int, status text default 'new', created_at timestamptz default now());
alter table shops enable row level security;
alter table jobs enable row level security;
insert into storage.buckets(id,name,public) values('files','files',false);
