/**
 * @description Fandom search API, with limitations and pagination
 * 
 * @Param {string} q - The search query
 * @Param {number} limit - The number of results to return
 * @Param {number} lastIdx - The index of the last result (for better pagination)
 */

import { z } from "zod";

const querySchema = z.object({
  q: z.string(),
  limit: z.number({ coerce: true }).min(1).max(100),
  offset: z.number({ coerce: true }).min(0),
})


export default defineRearyardHandler(async (ctx) => {
  const { query } = await useParamValidGate({
    query: querySchema
  })
  const meilisearchClient = useMeilisearch();
  const { q, limit, offset } = query;


  const res = await meilisearchClient.index('fandom').search(q, {
    limit,
    offset,
  })

  return res;
})
