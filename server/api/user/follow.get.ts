import { z } from "zod"
import { ErrCode } from "~/types/enums/ErrCode"

defineRouteMeta({
  openAPI: {
    tags: ['User'],
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
  }
})

const querySchema = z.object({
  offset: z.number().optional().default(0),
  limit: z.number().optional().default(10),
})


export default defineEventHandler(async (event) => {
  const { query, body } = await useParamValidGate({
    query: querySchema,
  })
  const user = await useAuthGate()
  const { serviceRoleClient } = await useSupabase()

  const { data, error } = await serviceRoleClient.from('follow').select('*').eq('follower_id', user.id).range(query.offset!, query.offset! + query.limit!);
  if (error) {
    return throwLogicError({
      code: ErrCode.DB_ERROR,
      msg: error.message,
    })
  }
  
  return data
  return 'Hello Nitro'
})
