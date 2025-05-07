--Table: public.tag
--For tag management

--Note: What is tag?
--Tag is a label that can be added to a work, it is plain, not related to any other table.
--Tag is used to filter the work, and recommend the work.



--create tag table
CREATE TABLE public.tag (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT tag_name_length CHECK (char_length(name) >= 1)
);

--comments
COMMENT ON TABLE public.tag IS 'For tag management';
COMMENT ON COLUMN public.tag.name IS 'The name of the tag';
COMMENT ON COLUMN public.tag.created_at IS 'The timestamp when the tag was created';
COMMENT ON COLUMN public.tag.updated_at IS 'The timestamp when the tag was last updated';

--RLS
--enable row level security
ALTER TABLE public.tag ENABLE ROW LEVEL SECURITY;

--create policy for CRUD: enable insert, update, delete for service_role only
CREATE POLICY "Enable CRUD for service_role only" ON public.tag
    FOR ALL TO service_role USING (true);

--create full text search index for tag
CREATE INDEX tag_name_idx ON public.tag USING pgroonga(name);

--create trigger for updating updated_at
CREATE OR REPLACE FUNCTION update_tag_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tag_updated_at
    BEFORE UPDATE ON public.tag
    FOR EACH ROW
    EXECUTE FUNCTION update_tag_updated_at();

