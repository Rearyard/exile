import { z } from "zod/v4";

const searchSchema = z.object({
    query: z.string().min(1).transform((val) => val.trim()),
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(10),
})


export default defineEventHandler(async (event) => {
    const { query } = await useParamValidGate({
        query: searchSchema,
    });
    const meilisearchClient = useMeilisearch();

    const results = await meilisearchClient.index('tag').search<{
        id: number;
        name: string;
        created_at: string;
        updated_at: string;
    }>(query.query, {
        page: query.page,
        limit: query.limit,
        attributesToSearchOn: ['name'],
        attributesToHighlight: ['name'],
    }).then((res) => {
        return {
            ...res,
            hits: res.hits.map((hit) => {
                return {
                    ...hit,
                    id: encodeSqid([hit.id]),
                    _formatted: {
                        ...hit._formatted,
                        id: encodeSqid([hit.id]),
                    }
                }
            }),
        }
    })
    return results;
})