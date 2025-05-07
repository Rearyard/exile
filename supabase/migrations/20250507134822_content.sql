--Table: public.content
--For content management

--Note: What is content?
--Content is the "text" of a work, it can be a single passage, or a chapter, or a branch of images with text.
--Content is the core of a work, it is the main part of a work.

--create content table
CREATE TABLE public.content (
    id SERIAL PRIMARY KEY,
    work_title VARCHAR(255) NOT NULL,
    work_id INTEGER NOT NULL REFERENCES public.work(id),
    plain_text TEXT NOT NULL DEFAULT '',
    schema_content JSONB NOT NULL DEFAULT '{}'::jsonb,
    images TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    likes INTEGER NOT NULL DEFAULT 0,
    comments INTEGER NOT NULL DEFAULT 0,
    views INTEGER NOT NULL DEFAULT 0,
    tags INTEGER[] NOT NULL DEFAULT ARRAY[]::INTEGER[],
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT content_work_title_length CHECK (char_length(work_title) >= 1 AND char_length(work_title) <= 255),
    CONSTRAINT content_plain_text_length CHECK (char_length(plain_text) <= 100000),
    CONSTRAINT content_images_limit CHECK (array_length(images, 1) <= 50)
);

--comments
COMMENT ON TABLE public.content IS 'For content management';
COMMENT ON COLUMN public.content.work_title IS 'The title of the work, redundant, but useful for search';
COMMENT ON COLUMN public.content.work_id IS 'The work id of the content';
COMMENT ON COLUMN public.content.plain_text IS 'The plain text of the content';
COMMENT ON COLUMN public.content.schema_content IS 'The schema content of the content';
COMMENT ON COLUMN public.content.images IS 'The images of the content';
COMMENT ON COLUMN public.content.likes IS 'The number of likes of the content';
COMMENT ON COLUMN public.content.comments IS 'The number of comments of the content';
COMMENT ON COLUMN public.content.views IS 'The number of views of the content';
COMMENT ON COLUMN public.content.tags IS 'The tags of the content';
COMMENT ON COLUMN public.content.created_at IS 'The timestamp when the content was created';
COMMENT ON COLUMN public.content.updated_at IS 'The timestamp when the content was updated';

--enable row level security
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;

--create policy for CRUD: enable insert, update, delete for service_role only
CREATE POLICY "Enable CRUD for service_role only" ON public.content
    FOR ALL USING (true);

-- full text search index for plain_text and work_title
CREATE INDEX content_fts_idx ON public.content USING pgroonga(plain_text, work_title);

--create index for work_id
CREATE INDEX content_work_id_idx ON public.content (work_id);

--create index for tags
CREATE INDEX content_tags_idx ON public.content USING gin(tags);

--function when insert a content, update the work's contents if the work's contents does not contain the content's id
CREATE OR REPLACE FUNCTION public.update_work_contents()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if work exists
    IF NOT EXISTS (SELECT 1 FROM public.work WHERE id = NEW.work_id) THEN
        RAISE EXCEPTION 'Work with id % does not exist', NEW.work_id;
    END IF;
    
    -- Update work contents if not already present
    UPDATE public.work 
    SET contents = array_append(contents, NEW.id)
    WHERE id = NEW.work_id 
    AND NOT (contents @> ARRAY[NEW.id]);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--create trigger for update_work_contents
CREATE TRIGGER update_work_contents_trigger AFTER INSERT ON public.content FOR EACH ROW EXECUTE FUNCTION public.update_work_contents();

--function when delete a content, update the work's contents if the work's contents contains the content's id
CREATE OR REPLACE FUNCTION public.update_work_contents_soft_delete()
RETURNS TRIGGER AS $$
BEGIN
    -- Soft delete the content
    UPDATE public.content 
    SET is_deleted = TRUE,
        updated_at = timezone('utc'::text, now())
    WHERE id = OLD.id;
    
    -- Remove content from work's contents array
    UPDATE public.work 
    SET contents = array_remove(contents, OLD.id)
    WHERE id = OLD.work_id 
    AND contents @> ARRAY[OLD.id];
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

--create trigger for update_work_contents_soft_delete, prevent delete the content, soft delete it
CREATE TRIGGER update_work_contents_soft_delete_trigger BEFORE DELETE ON public.content FOR EACH ROW EXECUTE FUNCTION public.update_work_contents_soft_delete();

--create trigger for updating updated_at
CREATE OR REPLACE FUNCTION update_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER content_updated_at
    BEFORE UPDATE ON public.content
    FOR EACH ROW
    EXECUTE FUNCTION update_content_updated_at();
