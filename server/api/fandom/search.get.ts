/**
 * @description Fandom search API, with limitations and pagination
 * 
 * @Param {string} q - The search query
 * @Param {number} limit - The number of results to return
 * @Param {number} lastIdx - The index of the last result (for better pagination)
 */

import { FandomVisibility } from "~/types/enums/Visibility";


export default defineEventHandler(async (event) => {
  const { serviceRoleClient } = await useSupabase();
  const { q, limit, lastIdx } = getQuery(event);

})
