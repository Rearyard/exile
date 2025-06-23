--Table: public.post_image_upload_meta
--For Control quota of user's image upload

--create table
CREATE TABLE public.post_image_upload_meta (
    id SERIAL PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES public.user_basic(user_id),
    quota_used INTEGER NOT NULL DEFAULT 0,
    quota_limit INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

--comments
COMMENT ON TABLE public.post_image_upload_meta IS 'For Control quota of user image upload';
COMMENT ON COLUMN public.post_image_upload_meta.user_id IS 'The user id of the post image upload meta';
COMMENT ON COLUMN public.post_image_upload_meta.quota_used IS 'The quota used of the post image upload meta';
COMMENT ON COLUMN public.post_image_upload_meta.quota_limit IS 'The quota limit of the post image upload meta';
COMMENT ON COLUMN public.post_image_upload_meta.created_at IS 'The timestamp when the post image upload meta was created';
COMMENT ON COLUMN public.post_image_upload_meta.updated_at IS 'The timestamp when the post image upload meta was updated';

--enable row level security
ALTER TABLE public.post_image_upload_meta ENABLE ROW LEVEL SECURITY;

--create policy for CRUD: enable insert, update, delete for service_role only
CREATE POLICY "Enable CRUD for service_role only" ON public.post_image_upload_meta
    FOR ALL USING (true);

--create index for user_id
CREATE INDEX post_image_upload_meta_user_id_idx ON public.post_image_upload_meta (user_id);