import { z } from "zod/v4";
import { ErrCode } from "~/types/enums/ErrCode";
import type { ApiResponse } from "~/types/common";
import type { PostFeedItem } from "~/types/feed";

export default defineRearyardHandler(async (ctx): Promise<ApiResponse<PostFeedItem[]>> => {
    const { query, supabaseServiceRole, user } = ctx;
    // 
    const { data, error } = await supabaseServiceRole
        .from('work')
        .select('id, title, created_at, updated_at, author:user_basic(user_id, avatar, signature, nickname), content(*, tags:tag(id, name, created_at, updated_at))')
        .eq('type', 'post')
        .not('contents', 'eq', '{}')
        .order('created_at', { ascending: false })
        .limit(query.count);
    if (error) {    
        return throwLogicError({
            code: ErrCode.DB_ERROR,
            msg: 'Failed to get feed list',
            data: error,
        })
    }
    return {
        code: 0,
        msg: 'success',
        data: data,
    }
    // // get the content of the post
    // const contentToFetch: number[] = data.map((work) => work.contents!).flat().filter((content): content is number => content !== null);
    // const { data: contentData, error: contentError } = await supabaseServiceRole
    //     .from('content')
    //     .select('*')
    //     .eq('is_deleted', false)
    //     .in('id', contentToFetch);
    // if (contentError) {
    //     return throwLogicError({
    //         code: ErrCode.DB_ERROR,
    //         msg: 'Failed to get content list',
    //         data: contentError,
    //     })
    // }
    // const contentMap = new Map<number, typeof contentData[number]>();
    // contentData.forEach((content) => {
    //     contentMap.set(content.id, content);
    // });
    // const tagsToFetch = new Set([...contentMap.values().map((content) => content.tags)].flat());
    // const { data: tagData, error: tagError } = await supabaseServiceRole
    //     .from('tag')
    //     .select('*')
    //     .in('id', Array.from(tagsToFetch));
    // if (tagError) {
    //     return throwLogicError({
    //         code: ErrCode.DB_ERROR,
    //         msg: 'Failed to get tag list',
    //         data: tagError,
    //     })
    // }
    // const tagMap = new Map<number, typeof tagData[number]>();
    // tagData.forEach((tag) => {
    //     tagMap.set(tag.id, tag);
    // });
    // const result = data.map((work) => {
    //     const content = contentMap.get(work.contents?.[0]!);
    //     return {
    //         id: encodeSqid([work.id, content?.id!]),
    //         title: work.title,
    //         createdAt: work.created_at,
    //         updatedAt: work.updated_at,
    //         auther: {
    //             user_id: work.user_basic.user_id,
    //             avatar: work.user_basic.avatar,
    //             signature: work.user_basic.signature,
    //             nickname: work.user_basic.nickname,
    //         },
    //         content: {
    //             ...encodeSqidInObject(content, ['id', 'work_id']),
    //             tags: content?.tags.map((tag) => tagMap.get(tag)).map(tag => encodeSqidInObject(tag, ['id', ''])),
    //         }
    //     }
    // });
    // return {
    //     success: true,
    //     data: result,
    // }
}, {
    strictAuth: false,
    querySchema: z.object({
        lastSyncKey: z.number().optional().default(0),
        count: z.number().optional().default(20),
    })
})