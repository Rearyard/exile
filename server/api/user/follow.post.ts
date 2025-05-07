import { z } from "zod"
import {ErrCode} from '~/types/enums/ErrCode';

defineRouteMeta({
  openAPI: {
    tags: ["User", "Follow"],
    summary: "Follow a user",
    description: "Follow a user",
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              user_id: {
                type: "string",
                format: "uuid",
                description: "The user id to follow",
              },
            },
            required: ["user_id"],
          },
        },
      },
    },
    responses: {
      200: {
        description: "Followed successfully",
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

const bodySchema = z.object({
  user_id: z.string().uuid(),
})

export default defineEventHandler(async () => {
  const { body } = await useParamValidGate({
    body: bodySchema,
  })

  const user = await useAuthGate()

  const { serviceRoleClient } = await useSupabase()

  // Check if the user is allowed to be followed

  const { data, error } = await serviceRoleClient
    .from("follow")
    .insert({
      follower_id: body.user_id,
      following_id: user.id,
    })
    .select()

  if (error) {
    return throwLogicError({
      code: ErrCode.DB_ERROR,
      msg: "Follow failed: " + error.message,
    })
  }

  return {
    data,
  }
})
