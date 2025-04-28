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

  // // sql: select * from fandom join fandom_meta on fandom.id = fandom_meta.fandom_id where fandom.name ilike '%{q}%' and fandom_meta.visibility = 1
  // const baseQuery = serviceRoleClient.from('fandom').select(`*, fandom_meta(*)`).ilike('name', `%${q}%`);
  // const user =  {id: 'test_user_id'}
  // // if user is not logged in, limit the results to public fandoms
  // if (!user) {
  //   baseQuery.eq('fandom_meta.visibility', FandomVisibility.PUBLIC);
  // } else {
  //   // if user is logged in, query subscriptions first
  //   const { data: subscriptions, error: subscriptionError } = await serviceRoleClient
  //     .from('fandom_subscription').select('fandom_id')
  //     .eq('user_id', user.id);
  //   const fandomIds = subscriptions?.map((subscription) => subscription.fandom_id) || [];
  //   /*
  //     search for fandoms that
  //     - are public
  //     - are limited to logged in users
  //     - are limited to subscribers and the user is a subscriber (fandom_id in fandomIds and visibility = 2)
  //     - TODO: are limited to the user who has worked on it (not implemented yet)
  //     - are limited to the user itself (created_by = user.id and visibility = 4)
  //   */
  //   /*
  //     sql: select * from fandom join fandom_meta on fandom.id = fandom_meta.fandom_id
  //           where fandom.name ilike '%{q}%' and (
  //             fandom_meta.visibility <= 1 or
  //             (fandom_meta.visibility = 2 and fandom.id in ({fandomIds})) or
  //             (fandom_meta.visibility = 4 and created_by = {user.id}))
  //   */
  //   baseQuery.or(`fandom_meta.visibility.lte.1`);
  // }
  // // if lastIdx is provided, use it to limit the results
  // if (lastIdx) {
  //   baseQuery.lt('id', lastIdx);
  // }
  // // limit the results to the specified number
  // baseQuery.limit(Math.max(1, Number(limit) || 10));

  // // Fetch data from Supabase
  // return baseQuery;
  return serviceRoleClient.from('fandom')
    .select('*, fandom_meta!inner(*)')
    .ilike('name', '%test%')
    .or(
      'visibility.lte.1,' +
      'and(visibility.eq.2,id.eq.0),' +
      'and(visibility.eq.4,"fandom.created_by".eq.58ddc236-8b82-4a11-a550-de8fefdde009)'
      , { referencedTable: 'fandom_meta' }
    )
    .limit(10);
})
