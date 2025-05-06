--Table: public.relation
--For relation management

--create relation table
CREATE TABLE public.relation (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    created_by uuid references auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    fandom_ids INTEGER[] NOT NULL CHECK (array_length(fandom_ids, 1) > 0),
    characters INTEGER[] NOT NULL CHECK (array_length(characters, 1) > 0)
);

--comments
COMMENT ON TABLE public.relation IS 'For relation management';
COMMENT ON COLUMN public.relation.name IS 'The name of the relation';
COMMENT ON COLUMN public.relation.created_by IS 'The user who created the relation';
COMMENT ON COLUMN public.relation.created_at IS 'The timestamp when the relation was created';
COMMENT ON COLUMN public.relation.updated_at IS 'The timestamp when the relation was updated';
COMMENT ON COLUMN public.relation.fandom_ids IS 'The fandom ids that the relation belongs to';
COMMENT ON COLUMN public.relation.characters IS 'The characters that the relation belongs to';

--NOTES:
-- Relation is a many-to-many relationship between characters.
-- Relation is used to describe the relationship between characters. Maybe they are lovers, friends, or enemies.
-- Relation is a 'vector' of characters. e.g. [A, B] is different from [B, A].
-- Relation is unique, it can't be duplicated. e.g. It can't be [A, B] and [A, B] at the same time. So we use insert trigger to prevent this.
-- fandom_ids is an array of fandom ids that the relation belongs to. It's more like a 'cache' for the relation. We use insert trigger to update this.

--Function: update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
    RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--Function: ensure_relation_unique
CREATE OR REPLACE FUNCTION public.ensure_relation_unique()
    RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM public.relation 
        WHERE characters = NEW.characters 
        AND id != NEW.id
    ) THEN
        RAISE EXCEPTION 'Relation already exists';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--Function: update_fandom_ids: Query character info from character table and update fandom_ids(remove duplicates)
CREATE OR REPLACE FUNCTION public.update_fandom_ids()
    RETURNS TRIGGER AS $$
BEGIN
    NEW.fandom_ids = (
        SELECT array_agg(DISTINCT fandom_id)
        FROM unnest(NEW.characters) AS character_id
        JOIN public.character ON character.id = character_id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--RLS
--enable row level security
ALTER TABLE public.relation ENABLE ROW LEVEL SECURITY;
--create policy for CRUD: enable insert, update, delete for service_role only
CREATE POLICY "Enable CRUD for service_role only" ON public.relation
    FOR ALL TO service_role USING (true);

--TRIGGER: update_updated_at_column
CREATE TRIGGER update_updated_at_column
    BEFORE UPDATE ON public.relation
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

--TRIGGER: ensure_relation_unique before insert or update
CREATE TRIGGER ensure_relation_unique
    BEFORE INSERT OR UPDATE ON public.relation
    FOR EACH ROW EXECUTE FUNCTION public.ensure_relation_unique();

--TRIGGER: update_fandom_ids before insert or update
CREATE TRIGGER update_fandom_ids
    BEFORE INSERT OR UPDATE ON public.relation
    FOR EACH ROW EXECUTE FUNCTION public.update_fandom_ids();

--INDEX: relation_characters_idx
CREATE INDEX relation_characters_idx ON public.relation USING GIN (characters);

--INDEX: relation_fandom_ids_idx
CREATE INDEX relation_fandom_ids_idx ON public.relation USING GIN (fandom_ids);

--INDEX: relation_created_by_idx
CREATE INDEX relation_created_by_idx ON public.relation (created_by);

--INDEX: relation_name_idx
CREATE INDEX relation_name_idx ON public.relation (name);
