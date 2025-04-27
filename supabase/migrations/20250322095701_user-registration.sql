-- user registration db preparation

-- insert platform kv record for user registration
INSERT INTO platform_kv (key, value)
VALUES ('REGISTER_PROOF_QUESTIONS', '{"value": ["question1", "question2"]}');

-- create invitation_code table
CREATE TABLE public.invitation_code
(
    id         SERIAL PRIMARY KEY,
    code       TEXT                                                                              NOT NULL,
    created_by uuid references auth.users (id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())                     NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now() + interval '1 week') NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())                     NOT NULL,
    used_by    uuid references auth.users (id),
    used_at    TIMESTAMP WITH TIME ZONE,
    CONSTRAINT invitation_code_code_key UNIQUE (code),
    CONSTRAINT invitation_code_used_check CHECK (
        (used_by IS NULL AND used_at IS NULL) OR
        (used_by IS NOT NULL AND used_at IS NOT NULL)
    )
);

-- comments
COMMENT ON TABLE public.invitation_code IS 'For invitation code management';
COMMENT ON COLUMN public.invitation_code.code IS 'The invitation code';
COMMENT ON COLUMN public.invitation_code.created_by IS 'The user who created the invitation code';
COMMENT ON COLUMN public.invitation_code.created_at IS 'The timestamp when the invitation code was created';
COMMENT ON COLUMN public.invitation_code.expires_at IS 'The timestamp when the invitation code expires';
COMMENT ON COLUMN public.invitation_code.updated_at IS 'The timestamp when the invitation code was last updated';
COMMENT ON COLUMN public.invitation_code.used_by IS 'The user who used the invitation code';
COMMENT ON COLUMN public.invitation_code.used_at IS 'The timestamp when the invitation code was used';

-- create index for foreign key
CREATE INDEX invitation_code_created_by_idx ON public.invitation_code (created_by);
COMMENT ON INDEX public.invitation_code_created_by_idx IS 'Index for fast search by created_by';

CREATE INDEX invitation_code_used_by_idx ON public.invitation_code (used_by);
COMMENT ON INDEX public.invitation_code_used_by_idx IS 'Index for fast search by used_by';

-- create index for code: for fast search by code
CREATE INDEX invitation_code_code_idx ON public.invitation_code (code);
COMMENT ON INDEX public.invitation_code_code_idx IS 'Index for fast search by code';

-- Function: update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
    RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- add trigger for auto update updated_at
CREATE TRIGGER update_invitation_code_updated_at
    BEFORE UPDATE ON public.invitation_code
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- enable row level security
alter table public.invitation_code enable row level security;

-- create policies
CREATE POLICY "Enable select for service_role only" on "public"."invitation_code"
    for SELECT TO service_role USING (true);
CREATE POLICY "Enable insert for service_role only" on "public"."invitation_code"
    for INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Enable update for service_role only" on "public"."invitation_code"
    for UPDATE TO service_role USING (true);
CREATE POLICY "Enable delete for service_role only" on "public"."invitation_code"
    for DELETE TO service_role USING (true);
