import { z } from "zod";

const bodySchema = z.object({
  name: z.string().min(1),
  isRps: z.boolean().optional(),
  isUserOriginal: z.boolean().optional(),
  isOfficialManaged: z.boolean().optional(),
  isNsfw: z.boolean().optional(),
  visibility: z.number().optional(),
  tagVisibility: z.number().optional(),
  worksCreationLevel: z.number().optional(),
})

export default defineEventHandler(async (event) => {
  const { serviceRoleClient, requiredUser } = await useSupabase();
  const body = await readValidatedBody(event, bodySchema.parse);

  const { data, error } = await serviceRoleClient.from('fandom').insert({
    name: body.name,
    is_rps: body.isRps,
    is_user_original: body.isUserOriginal,
    is_official_managed: body.isOfficialManaged,
    is_nsfw: body.isNsfw,
    visibility: body.visibility,
    tag_visibility: body.tagVisibility,
    works_creation_level: body.worksCreationLevel,
  })

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    })
  }

  return data;
})
