-- Table: public.fandom
-- for fandom management

-- create fandom table
CREATE TABLE public.fandom (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    created_by uuid references auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    is_rps BOOLEAN NOT NULL DEFAULT FALSE,
    is_user_original BOOLEAN NOT NULL DEFAULT FALSE,
    is_official_managed BOOLEAN NOT NULL DEFAULT FALSE,
    is_nsfw BOOLEAN NOT NULL DEFAULT FALSE,
    visibility INTEGER NOT NULL DEFAULT 0,
    tag_visibility INTEGER NOT NULL DEFAULT 0,
    works_creation_level INTEGER NOT NULL DEFAULT 0
);

-- comments
COMMENT ON TABLE public.fandom IS 'For fandom management';
COMMENT ON COLUMN public.fandom.created_by IS 'The user who created the fandom';
COMMENT ON COLUMN public.fandom.created_at IS 'The timestamp when the fandom was created';
COMMENT ON COLUMN public.fandom.updated_at IS 'The timestamp when the fandom was updated';
COMMENT ON COLUMN public.fandom.is_rps IS 'Whether the fandom is RPS, RPS stands for real person story';
COMMENT ON COLUMN public.fandom.is_user_original IS 'Whether the fandom is user original';
COMMENT ON COLUMN public.fandom.is_official_managed IS 'Whether the fandom is official managed';
COMMENT ON COLUMN public.fandom.is_nsfw IS 'Whether the fandom is NSFW';
COMMENT ON COLUMN public.fandom.visibility IS 'The visibility level of the works in the fandom, higher level means less visibility';
COMMENT ON COLUMN public.fandom.works_creation_level IS 'The level of new works creation in the fandom, higher level means more restricted';
COMMENT ON COLUMN public.fandom.tag_visibility IS 'The visibility level of the tag display in the fandom, higher level means less visibility';

-- detail comments for visibility
-- 0: The fandom is visible to everyone
-- 1: The fandom is visible to logged in users
-- start from here, the fandom can not be searched by name
-- 2: The fandom is only visible to the users who subscribe the fandom (limited visibility)
-- 3: The fandom is only visible to the users who has already created works of the fandom (soft ban)
-- 4: The fandom is only visible to the user itself (hard ban, can not be seen by anyone else)

-- detail comments for tag_visibility  
-- same as visibility, but only for tag display visibility, do not affect the works visibility
-- must <= visibility, otherwise, it will be overridden by visibility

-- detail comments for works_creation_level
-- 0: Anyone can create works in the fandom (no restriction)
-- 1: Only users who subscribe the fandom can create works in the fandom (limited visibility)
-- 2: Only users who has already created works of the fandom can create works in the fandom (soft ban)
-- 3: Only the creator of the fandom can create works in the fandom (hard ban)
-- 4: Only admins can create works in the fandom (hard ban, and for management usage, such as platform announcement)
-- 5: No one can create works in the fandom (DEATH ROW)

-- Function: update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
    RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- add trigger for auto update updated_at
CREATE TRIGGER update_fandom_updated_at
    BEFORE UPDATE ON public.fandom
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Function: check_fandom_visibility, check if the visibility and tag_visibility is valid
CREATE OR REPLACE FUNCTION public.check_fandom_visibility()
    RETURNS TRIGGER AS $$
BEGIN
    IF NEW.visibility < NEW.tag_visibility THEN
        -- override the tag_visibility to the visibility
        NEW.tag_visibility := NEW.visibility;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: prevent_fandom_deletion, raise an error and prevent the deletion
CREATE OR REPLACE FUNCTION public.prevent_fandom_deletion()
    RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'You are not allowed to delete the fandom';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: update_fandom_visibility_trigger, check if the visibility and tag_visibility is valid
CREATE TRIGGER update_fandom_visibility_trigger
    BEFORE UPDATE ON public.fandom
    FOR EACH ROW
    EXECUTE FUNCTION public.check_fandom_visibility();

-- So we set a trigger when a fandom is deleted, we will raise an error and prevent the deletion
CREATE TRIGGER prevent_fandom_deletion
    BEFORE DELETE ON public.fandom
    FOR EACH ROW
    EXECUTE FUNCTION public.prevent_fandom_deletion();

-- enable row level security
alter table public.fandom enable row level security;

-- create policy for select: enable select for service_role only, for visibility management
CREATE POLICY "Enable select for service_role only" ON public.fandom
    FOR SELECT TO service_role USING (true);

-- create policy for insert: only service_role can insert, for prevent insert by spam
CREATE POLICY "Enable insert for service_role only" ON public.fandom
    FOR INSERT TO service_role WITH CHECK (true);

-- create policy for update: only service_role can update, for prevent update by spam, and content management
CREATE POLICY "Enable update for service_role only" ON public.fandom
    FOR UPDATE TO service_role USING (true);

-- create policy for delete: only service_role can delete, for prevent delete by spam
CREATE POLICY "Enable delete for service_role only" ON public.fandom
    FOR DELETE TO service_role USING (true);

-- Index: fandom_name_idx, for fast search by name
CREATE INDEX fandom_name_idx ON public.fandom (name);

-- Index: fandom_created_by_idx, for fast search by created_by
CREATE INDEX fandom_created_by_idx ON public.fandom (created_by);

CREATE INDEX fandom_is_rps_idx ON public.fandom (is_rps);
CREATE INDEX fandom_is_user_original_idx ON public.fandom (is_user_original);
CREATE INDEX fandom_is_official_managed_idx ON public.fandom (is_official_managed);
CREATE INDEX fandom_is_nsfw_idx ON public.fandom (is_nsfw);
CREATE INDEX fandom_visibility_idx ON public.fandom (visibility);
CREATE INDEX fandom_tag_visibility_idx ON public.fandom (tag_visibility);
CREATE INDEX fandom_works_creation_level_idx ON public.fandom (works_creation_level);

-- Table: public.fandom_subscription
-- for fandom subscription management

-- create fandom subscription table
CREATE TABLE public.fandom_subscription (
    id SERIAL PRIMARY KEY,
    fandom_id SERIAL references public.fandom (id),
    user_id uuid references auth.users (id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- comments
COMMENT ON TABLE public.fandom_subscription IS 'For fandom subscription management';
COMMENT ON COLUMN public.fandom_subscription.fandom_id IS 'The fandom id';
COMMENT ON COLUMN public.fandom_subscription.user_id IS 'The user id';
COMMENT ON COLUMN public.fandom_subscription.created_at IS 'The timestamp when the fandom subscription was created';

-- enable row level security for fandom_subscription
alter table public.fandom_subscription enable row level security;

-- create policy for select: only service_role can see all the fandom subscription, for detailed management
CREATE POLICY "Enable select for service_role only" ON public.fandom_subscription
    FOR SELECT TO service_role USING (true);
-- create policy for select: user itself can always see the fandom subscription
CREATE POLICY "Enable select for user itself only" ON public.fandom_subscription
    FOR SELECT TO authenticated USING ( (select auth.uid()) = user_id );

-- create policy for insert: only service_role can insert, for content management
CREATE POLICY "Enable insert for service_role only" ON public.fandom_subscription
    FOR INSERT TO service_role WITH CHECK (true);
-- Hint: we do not need to create policy for user insert or update, because fandom has visability restiction. Allow user to insert or update may break the limition.

-- create policy for update: only service_role can update, for content management
CREATE POLICY "Enable update for service_role only" ON public.fandom_subscription
    FOR UPDATE TO service_role USING (true);

-- create policy for delete: service_role can delete, for content management
CREATE POLICY "Enable delete for service_role only" ON public.fandom_subscription
    FOR DELETE TO service_role USING (true);

-- create policy for delete: user itself can always delete
CREATE POLICY "Enable delete for user itself only" ON public.fandom_subscription
    FOR DELETE TO authenticated USING ( (select auth.uid()) = user_id );

-- create index for fandom_id and user_id in fandom_subscription
CREATE INDEX fandom_subscription_fandom_id_idx ON public.fandom_subscription (fandom_id);
CREATE INDEX fandom_subscription_user_id_idx ON public.fandom_subscription (user_id);

-- add unique limit for avoid duplicate fandom subscription
ALTER TABLE public.fandom_subscription ADD CONSTRAINT fandom_subscription_fandom_id_user_id_key UNIQUE (fandom_id, user_id);