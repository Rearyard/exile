import { z } from "zod/v4";
import { ErrCode } from "~/types/enums/ErrCode";

export default defineRearyardHandler(async (ctx) => {
    const { body, supabaseServiceRole, user } = ctx;
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
        schema_content: body.content,
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
        content: z.record(z.string(), z.any()),
    }),
})