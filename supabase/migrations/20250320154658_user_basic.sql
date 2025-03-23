-- create table of user`s basic information
create table public.user_basic (
    -- serial primary key
    id serial primary key,
    -- user`s id from auth.users.id
    user_id uuid references auth.users(id),
    nickname text not null,
    signature text,
    avatar text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- field comments
comment on table user_basic is 'user`s basic information';
comment on column user_basic.id is 'serial primary key, auto increment';
comment on column user_basic.user_id is 'user`s id from auth.users.id';
comment on column user_basic.nickname is 'user`s nickname';
comment on column user_basic.signature is 'user`s signature';
comment on column user_basic.avatar is 'user`s avatar';
comment on column user_basic.created_at is 'created time';
comment on column user_basic.updated_at is 'updated time';

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
