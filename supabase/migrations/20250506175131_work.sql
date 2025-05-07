--Table: public.work
--For work management
--So, What is work?
--Work is a wrapper of "completely" composed content. But it does not store the content itself. For content, please refer to the content table.
--It can be a single post, a series of posts, or image(s) with text.
--No mater how many posts or images are in a work, it is considered as a single work.
--These metadata stored in the table is used to describe the whole work.
--For example, if a work is a series of posts, the metadata will be used to describe the whole series.
--With character A, B, C and D, the metadata will be used to describe the whole series.Even if the series is not finished yet.Even if in some chapter, the character A is not in the work.
--So this is what "work" is.

--enum work type
CREATE TYPE public.work_type AS ENUM (
    'passage',
    'series',
    'post'
);

--create work table
CREATE TABLE public.work (
    id SERIAL PRIMARY KEY,
    title text NOT NULL,
    description text DEFAULT '',
    type public.work_type NOT NULL,
    fandoms INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    characters INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    relationships INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    contents INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    created_by uuid references public.user_basic(user_id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT work_title_length CHECK (char_length(title) >= 1 AND char_length(title) <= 255),
    CONSTRAINT work_description_length CHECK (char_length(description) <= 5000)
);

--comments
COMMENT ON TABLE public.work IS 'For work management';
COMMENT ON COLUMN public.work.title IS 'The title of the work';
COMMENT ON COLUMN public.work.description IS 'The description of the work';
COMMENT ON COLUMN public.work.type IS 'The type of the work';
COMMENT ON COLUMN public.work.fandoms IS 'The fandoms of the work, references public.fandom.id';
COMMENT ON COLUMN public.work.characters IS 'The characters of the work, references public.character.id';
COMMENT ON COLUMN public.work.relationships IS 'The relationships of the work, references public.relationship.id';
COMMENT ON COLUMN public.work.contents IS 'The contents of the work';
COMMENT ON COLUMN public.work.created_by IS 'The user who created the work';
COMMENT ON COLUMN public.work.created_at IS 'The timestamp when the work was created';
COMMENT ON COLUMN public.work.updated_at IS 'The timestamp when the work was updated';

--enable row level security
ALTER TABLE public.work ENABLE ROW LEVEL SECURITY;

--create policy for CRUD: enable insert, update, delete for service_role only
CREATE POLICY "Enable CRUD for service_role only" ON public.work
    FOR ALL USING (true);

--full text search index for title and description
CREATE INDEX work_fts_idx ON public.work USING pgroonga(title, description);

--create index for fandoms, characters, relationships, contents
CREATE INDEX work_fandoms_idx ON public.work USING gin(fandoms);
CREATE INDEX work_characters_idx ON public.work USING gin(characters);
CREATE INDEX work_relationships_idx ON public.work USING gin(relationships);
CREATE INDEX work_contents_idx ON public.work USING gin(contents);

--create index for created_by
CREATE INDEX work_created_by_idx ON public.work (created_by);

--create trigger for updating updated_at
CREATE OR REPLACE FUNCTION update_work_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER work_updated_at
    BEFORE UPDATE ON public.work
    FOR EACH ROW
    EXECUTE FUNCTION update_work_updated_at();
