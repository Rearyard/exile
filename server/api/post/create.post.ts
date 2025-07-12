import { z } from "zod/v4";
import { ErrCode } from "~/types/enums/ErrCode";

export default defineRearyardHandler(async (ctx) => {
    const { body, supabaseServiceRole, user } = ctx;
    let tagIds: number[] = [];
    if (body.tags.length > 0) {
        // check if the tags are valid
        try {
            const actIds = body.tags.map((tag) => decodeSqid(tag.id));
            const { data, error } = await supabaseServiceRole.from('tag').select('*').in('id', actIds);
            if (error || !data || data.length !== actIds.length) {
                return throwLogicError({
                    code: ErrCode.CONTENT_TAGS_INVALID,
                    msg: 'Invalid tags',
                    data: error,
                })
            }
            tagIds = data.map((tag) => tag.id);
        } catch (error) {
            return throwLogicError({
                code: ErrCode.CONTENT_TAGS_INVALID,
                msg: 'Invalid tags',
                data: error,
            })
        }
    }
    // create a new post
    const { data, error } = await supabaseServiceRole.from('work').insert({
        created_by: user!.id,
        type: 'post',
        title: body.title,
    }).select('*').single();

    const workId = data?.id;
    
    if (error || !workId) {
        return throwLogicError({
            code: ErrCode.DB_ERROR,
            msg: 'Failed to create post',
            data: error,
        })
    }
    
    // create a new content
    const { data: contentData, error: contentError } = await supabaseServiceRole.from('content').insert({
        work_title: body.title,
        work_id: workId,
        plain_text: body.plainContent,
        schema_content: body.content,
        tags: tagIds,
    }).select('*').single();

    const contentId = contentData?.id;

    if (contentError || !contentId) {
        return throwLogicError({
            code: ErrCode.DB_ERROR,
            msg: 'Failed to create content',
            data: contentError,
        })
    }

    const postId = encodeSqid([workId, contentId])

    return {
        success: true,
        data: {
            postId,
        },
    }

}, {
    strictAuth: true,
    bodySchema: z.object({
        title: z.string().min(1),
        plainContent: z.string(),
        content: z.record(z.string(), z.any()),
        tags: z.array(z.object({
            id: z.string(),
            name: z.string(),
            type: z.string(),
        })).optional().default([]),
    }),
})