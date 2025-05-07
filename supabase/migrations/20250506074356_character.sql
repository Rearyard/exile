--Table: public.character
--For character management

--create character table
CREATE TABLE public.character (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    created_by uuid references public.user_basic(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    fandom_id INTEGER REFERENCES public.fandom(id)
);

--comments
COMMENT ON TABLE public.character IS 'For character management';
COMMENT ON COLUMN public.character.id IS 'Unique identifier for the character';
COMMENT ON COLUMN public.character.name IS 'Name of the character';
COMMENT ON COLUMN public.character.created_by IS 'The user who created the character';
COMMENT ON COLUMN public.character.created_at IS 'The timestamp when the character was created';
COMMENT ON COLUMN public.character.updated_at IS 'The timestamp when the character was updated';
COMMENT ON COLUMN public.character.fandom_id IS 'The fandom id that the character belongs to';

--Function: update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
    RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--RLS
--enable row level security
ALTER TABLE public.character ENABLE ROW LEVEL SECURITY;

--create policy for CRUD: enable insert, update, delete for service_role only
CREATE POLICY "Enable CRUD for service_role only" ON public.character
    FOR ALL TO service_role USING (true);

--create policy for read access to authenticated users
CREATE POLICY "Enable read access for authenticated users" ON public.character
    FOR SELECT TO authenticated USING (true);

--TRIGGER: update_updated_at_column
CREATE TRIGGER update_updated_at_column
    BEFORE UPDATE ON public.character
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

--INDEX: character_name_idx
CREATE INDEX character_name_idx ON public.character (name);

--INDEX: character_created_by_idx
CREATE INDEX character_created_by_idx ON public.character (created_by);

--INDEX: character_fandom_id_idx
CREATE INDEX character_fandom_id_idx ON public.character (fandom_id);

