--Table: public.chat
--For chat management

--create chat table
CREATE TABLE public.chat (
    id SERIAL PRIMARY KEY,
    seq_id INTEGER NOT NULL,
    from_user_id uuid references public.user_basic(user_id),
    to_user_id uuid references public.user_basic(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    content JSONB NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE
);

--comments
COMMENT ON TABLE public.chat IS 'For chat management';
COMMENT ON COLUMN public.chat.seq_id IS 'The sequence id of the chat. Useful for pagination, keep the order for batch sending.';
COMMENT ON COLUMN public.chat.from_user_id IS 'The user who sent the chat';
COMMENT ON COLUMN public.chat.to_user_id IS 'The user who received the chat';
COMMENT ON COLUMN public.chat.created_at IS 'The timestamp when the chat msg was created';
COMMENT ON COLUMN public.chat.content IS 'The content of the chat msg';
COMMENT ON COLUMN public.chat.is_read IS 'Whether the chat msg has been read';

--RLS
--enable row level security
ALTER TABLE public.chat ENABLE ROW LEVEL SECURITY;

--create policy for CRUD: enable insert, update, delete for service_role only
CREATE POLICY "Enable CRUD for service_role only" ON public.chat
    FOR ALL TO service_role USING (true);