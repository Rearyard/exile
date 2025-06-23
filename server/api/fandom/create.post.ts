import { z } from "zod";
import { ErrCode } from "~/types/enums/ErrCode";

const bodySchema = z.object({
  name: z.string().min(1),
  isRps: z.boolean().optional(),
  isUserOriginal: z.boolean().optional(),
})

export default defineEventHandler(async (event) => {
  const meilisearchClient = useMeilisearch();
  const { serviceRoleClient, requiredUser } = await useSupabase();
  const body = await readValidatedBody(event, bodySchema.parse);

  const { data, error } = await serviceRoleClient.from('fandom').insert({
    name: body.name,
    is_rps: body.isRps,
    is_user_original: body.isUserOriginal,
  }).select('*').single();

  if (error) {
    return throwLogicError({
      code: ErrCode.DB_ERROR
    })
  }

  meilisearchClient.index('fandom').addDocuments([data]);

  return {
    id: encodeSqid([data.id]),
  }
})
