-- create table of user basic information
create table public.user_basic (
    -- serial primary key
    id serial primary key,
    -- user id from auth.users.id
    user_id uuid references auth.users(id),
    nickname text not null,
    signature text,
    avatar text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    constraint user_basic_user_id_key unique (user_id),
    constraint user_basic_avatar_check check (avatar ~ '^https?://')
);

-- create index for foreign key
create index user_basic_user_id_idx on public.user_basic (user_id);

-- field comments
comment on table user_basic is 'User basic information';
comment on column user_basic.id is 'Serial primary key, auto increment';
comment on column user_basic.user_id is 'User id from auth.users.id';
comment on column user_basic.nickname is 'User nickname';
comment on column user_basic.signature is 'User signature';
comment on column user_basic.avatar is 'User avatar URL';
comment on column user_basic.created_at is 'The timestamp when the record was created';
comment on column user_basic.updated_at is 'The timestamp when the record was last updated';

-- Function: update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
    RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- add trigger for auto update updated_at
CREATE TRIGGER update_user_basic_updated_at
    BEFORE UPDATE ON public.user_basic
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- enable row level security
alter table user_basic enable row level security;

-- create policy for user_basic
-- - select: all authenticated users
CREATE POLICY "Enable insert for authenticated users only" on "public"."user_basic" as PERMISSIVE
    for INSERT TO authenticated WITH CHECK (true);

-- - insert: only service_role can insert
CREATE POLICY "Enable select for service_role only" on "public"."user_basic" as PERMISSIVE
    for SELECT TO service_role USING (true);

-- - update: only owner can update, and should not update user_id
CREATE POLICY "Enable update for users based on user_id" on "public"."user_basic"  as PERMISSIVE
    for UPDATE TO authenticated USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);

-- - delete: only service_role can delete
CREATE POLICY "Enable delete for service_role only" on "public"."user_basic" as PERMISSIVE
    for DELETE TO service_role USING (true);
