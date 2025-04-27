-- create table platform_kv 
CREATE TABLE public.platform_kv (
    -- unique, primary, not null, not empty, not empty string
    key text primary key check (key <> ''),
    value jsonb NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT platform_kv_value_check CHECK (jsonb_typeof(value) = 'object')
);

-- field comments
comment on table platform_kv is 'key-value storage for platform, for platform configuration or settings';
comment on column platform_kv.key is 'key';
comment on column platform_kv.value is 'value, must be jsonb, if not, please convert it to jsonb like `{"value": "something"}`';
comment on column platform_kv.created_at is 'The timestamp when the record was created';
comment on column platform_kv.updated_at is 'The timestamp when the record was last updated';

-- Function: update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
    RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- add trigger for auto update updated_at
CREATE TRIGGER update_platform_kv_updated_at
    BEFORE UPDATE ON public.platform_kv
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- enable row level security
alter table platform_kv enable row level security;

-- create policies
CREATE POLICY "Enable select for service_role only" on "public"."platform_kv"
    for SELECT TO service_role USING (true);
CREATE POLICY "Enable insert for service_role only" on "public"."platform_kv"
    for INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Enable update for service_role only" on "public"."platform_kv"
    for UPDATE TO service_role USING (true);
CREATE POLICY "Enable delete for service_role only" on "public"."platform_kv"
    for DELETE TO service_role USING (true);