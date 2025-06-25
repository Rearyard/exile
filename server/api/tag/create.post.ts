import { z } from "zod/v4";
import { xssFilter } from "~/shared/utils/xssFilter";
import { ErrCode } from "~/types/enums/ErrCode";

const bodySchema = z.object({
    name: z.string().min(1),
})

defineRouteMeta({
    openAPI: {
        tags: ['Tag'],
        summary: 'Create Tag',
        description: 'Create a tag',
        $global: {
            components: {
                schemas: {
                    Tag: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            name: { type: 'string' },
                            created_at: { type: 'string' },
                            updated_at: { type: 'string' },
                        },
                        required: ['id', 'name', 'created_at', 'updated_at'],
                    }
                }
            }
        },
        requestBody: {
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            name: { type: 'string' },
                        },
                        required: ['name'],
                    },
                },
            },
        },
        responses: {
            200: {
                description: 'Success',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                id: { type: 'string' },
                            },
                            required: ['id'],
                        },
                    },
                },
            },
        },
    },
})

export default defineEventHandler(async (event) => {
    // todo: check user
    const { serviceRoleClient } = await useSupabase();
    const meilisearchClient = useMeilisearch();
    const { body } = await useParamValidGate({
        body: bodySchema,
    });

    const { name } = body;
    const safeName = xssFilter(name);

    const { data, error } = await serviceRoleClient.from('tag').insert({
        name: safeName,
    }).select('*').single();
    
    if (error) {
        return throwLogicError({
            code: ErrCode.DB_ERROR,
            msg: error.message,
        })
    }

    // add to meilisearch in background
    meilisearchClient.index('tag').addDocuments([data])

    return {
        id: encodeSqid([data.id]),
    }
})