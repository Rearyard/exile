import { z } from "zod"
import { ErrCode } from "~/types/enums/ErrCode"

defineRouteMeta({
  openAPI: {
    tags: ["User", "Follow"],
    summary: "Unfollow a user",
    description: "Unfollow a user",
    parameters: [
      {
        in: "query",
        name: "user_id",
        required: true,
        description: "The user id to unfollow",
        schema: {
          type: "string",
        },
      },
    ],
    responses: {
      200: {
        description: "Unfollowed successfully",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                data: { type: "array" },
              },
            },
          },
        },
      },
    },
  },
})

const querySchema = z.object({
  user_id: z.string().uuid(),
})

export default defineEventHandler(async () => {
  const { query } = await useParamValidGate({
    query: querySchema,
  })

  const user = await useAuthGate()

  const { serviceRoleClient } = await useSupabase()

  const { data, error } = await serviceRoleClient
    .from("follow")
    .delete()
    .eq("follower_id", user.id)
    .eq("following_id", query.user_id)
    .select()

  if (error) {
    return throwLogicError({
      code: ErrCode.DB_ERROR,
      msg: "Unfollow failed: " + error.message,
    })
  }

  return {
    data,
  }
})
