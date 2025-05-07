import { z } from "zod"
import { ErrCode } from "~/types/enums/ErrCode"

defineRouteMeta({
  openAPI: {
    tags: ['User', "Follow"],
    summary: 'Get user follow list',
    description: 'Get user follow list',
    parameters: [
      {
        in: 'query',
        name: 'offset',
        required: false,
        description: 'The offset of the follow list',
        schema: {
          type: 'number',
        },
      },
      {
        in: 'query',
        name: 'limit',
        required: false,
        description: 'The limit of the follow list',
        schema: {
          type: 'number',
        },
      },
    ],
    responses: {
      200: {
        description: 'The follow list',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                users: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      user_id: { type: 'string' },
                      nickname: { type: 'string' },
                      avatar: { type: 'string' },
                      signature: { type: 'string' },
                    },
                  },
                },
                total: { type: 'number' },
              },
            },
          },
        },
      },
    }
  }
})

const querySchema = z.object({
  offset: z.number().optional().default(0),
  limit: z.number().optional().default(10),
})


export default defineEventHandler(async () => {
  const { query } = await useParamValidGate({
    query: querySchema,
  })
  const user = await useAuthGate()
  const { serviceRoleClient } = await useSupabase()

  const listQuery =  serviceRoleClient.from('follow').select('user_basic!following_id(user_id, nickname, avatar, signature)').eq('follower_id', user.id).range(query.offset!, query.offset! + query.limit!);
  const countQuery = serviceRoleClient.from('follow').select('*', { count: 'exact', head: true }).eq('follower_id', user.id);
  const [{data, error}, {count, error: countErr}] = await Promise.all([listQuery, countQuery]);

  if (error || countErr) {
    return throwLogicError({
      code: ErrCode.DB_ERROR,
      msg: error?.message || countErr?.message,
    })
  }

  return {
    users: data.map((user) => user.user_basic),
    total: count,
  }
})
