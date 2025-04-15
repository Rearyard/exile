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
    used_at    TIMESTAMP WITH TIME ZONE
);

-- enable row level security
alter table platform_kv enable row level security;
CREATE POLICY "Enable select for service_role only" on "public"."invitation_code"
    for SELECT TO service_role USING (true);
CREATE POLICY "Enable insert for service_role only" on "public"."invitation_code"
    for INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Enable update for service_role only" on "public"."invitation_code"
    for UPDATE TO service_role USING (true);
CREATE POLICY "Enable delete for service_role only" on "public"."invitation_code"
    for DELETE TO service_role USING (true);
