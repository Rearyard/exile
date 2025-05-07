--Table: public.follow
--For follow management

--create follow table
CREATE TABLE public.follow (
    id SERIAL PRIMARY KEY,
    follower_id uuid references public.user_basic(user_id),
    following_id uuid references public.user_basic(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(follower_id, following_id),
    CONSTRAINT no_self_follow CHECK (follower_id != following_id)
);

--comments
COMMENT ON TABLE public.follow IS 'For follow management';
COMMENT ON COLUMN public.follow.follower_id IS 'The user who followed';
COMMENT ON COLUMN public.follow.following_id IS 'The user who is followed';
COMMENT ON COLUMN public.follow.created_at IS 'The timestamp when the follow was created';

--RLS
--enable row level security
ALTER TABLE public.follow ENABLE ROW LEVEL SECURITY;

--create policy for CRUD: enable insert, update, delete for service_role only
CREATE POLICY "Enable CRUD for service_role only" ON public.follow
    FOR ALL TO service_role USING (true);

--INDEX: follow_follower_id_idx
CREATE INDEX follow_follower_id_idx ON public.follow (follower_id);

--INDEX: follow_following_id_idx
CREATE INDEX follow_following_id_idx ON public.follow (following_id);

--INDEX: follow_follower_id_following_id_idx
CREATE INDEX follow_follower_id_following_id_idx ON public.follow (follower_id, following_id);


