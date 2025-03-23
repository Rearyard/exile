-- create table platform_kv 
CREATE TABLE public.platform_kv (
    -- unique, primary, not null, not empty, not empty string
    key text primary key check (key <> ''),
    value jsonb
);

-- field comments
comment on table platform_kv is 'key-value storage for platform, for platform configuration or settings';
comment on column platform_kv.key is 'key';
comment on column platform_kv.value is 'value, must be jsonb, if not, please convert it to jsonb like `{"value": "something"}`';

-- enable row level security
alter table platform_kv enable row level security;
CREATE POLICY "Enable select for service_role only" on "public"."platform_kv"
    for SELECT TO service_role USING (true);
CREATE POLICY "Enable insert for service_role only" on "public"."platform_kv"
    for INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Enable update for service_role only" on "public"."platform_kv"
    for UPDATE TO service_role USING (true);
CREATE POLICY "Enable delete for service_role only" on "public"."platform_kv"
    for DELETE TO service_role USING (true);