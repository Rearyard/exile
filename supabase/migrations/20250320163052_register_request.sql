-- create register_request_status enum
create type register_request_status as enum ('pending', 'approved', 'rejected');

-- create table register_request
create table public.register_request (
    id uuid primary key default gen_random_uuid(),
    -- email, unique
    email text not null unique,
    question jsonb not null,
    request_ip inet not null,
    request_user_agent text not null,
    additional_info jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    status register_request_status default 'pending' not null,
    finished_at timestamp with time zone,
    finished_by uuid references auth.users(id)
);

-- enable row level security
alter table register_request enable row level security;

-- create policy for register_request

-- - select, insert, update, delete: service_role
CREATE POLICY "Enable select for service_role only" on "public"."register_request"
    for SELECT TO service_role USING (true);
CREATE POLICY "Enable insert for service_role only" on "public"."register_request"
    for INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Enable update for service_role only" on "public"."register_request"
    for UPDATE TO service_role USING (true);
CREATE POLICY "Enable delete for service_role only" on "public"."register_request"
    for DELETE TO service_role USING (true);


