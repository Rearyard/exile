/** 
 *  @description This api is used to get fandom data by id, including the fandom meta data.
 * - with visibility check
 * - if the fandom is limited to logged in users, check if the user is logged in
 * - if the fandom is limited to subscribed users, check if the user is subscribed
 * - if the fandom is limited to creator, check if the user is the creator
 * - if the fandom is limited to works of the fandom, check if the user has created works of the fandom
 * - if the fandom is public or the user has passed the limitation, return the fandom data
 * @CafuChino
 * @param {number} id - The id of the fandom
 * @returns {Promise<Fandom>} - The fandom data
 * @throws {Error} - If the fandom is not found or the user is not allowed to access the fandom
*/


import { FandomVisibility } from "~/types/enums/Visibility";

export default defineEventHandler(async (event) => {
  const { serviceRoleClient, user } = await useSupabase();

  const id = Number(getRouterParam(event, 'id'));
  
  // Parameter validation
  if (!id) {
    return createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Missing id'
    });
  }

  // Fetch data from Supabase
  const { data, error } = await serviceRoleClient.from('fandom').select(`*`).eq('id', id).maybeSingle();
  
  if (error) {
    // TODO: Handle error
    return createError({
      status: 500,
      statusText: 'Internal Server Error',
      data: error.message
    });
  }
  if (!data) {
    return createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      message: 'Fandom not found'
    });
  }
  const { created_by, visibility } = data;

  // if no meta data, set visibility to max safe integer, to avoid unexpected behavior

  if (visibility > FandomVisibility.PUBLIC) {
    // Check if the user is logged in
    if (!user) {
      return createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
        message: 'Fandom is limited to logged in users'
      });
    }
  }

  switch (visibility) {
    case FandomVisibility.LIMITED: {
      // Check if the user is subscribed to the fandom
      const { count: subscriptionCount, error: subscriptionError } = await serviceRoleClient.from('fandom_subscription').select('*', { count: 'exact', head: true }).eq('fandom_id', id).eq('user_id', user!.id);
      if (subscriptionError) {
        return createError({
          statusCode: 500,
          statusMessage: 'Internal Server Error',
          message: subscriptionError.message
        });
      }
      if ((subscriptionCount || 0) <= 0) {
        return createError({
          statusCode: 403,
          statusMessage: 'Forbidden',
          message: 'Fandom is limited to subscribed users'
        });
      }
    }
    case FandomVisibility.SOFT_BAN: {
      // Check if the user has created works of the fandom
      // TODO: Implement this
      console.log('User has created works of the fandom');
    }
    case FandomVisibility.HARD_BAN: {
      // Check if the user is the creator of the fandom
      if (created_by !== user!.id) {
        return createError({
          statusCode: 403,
          statusMessage: 'Forbidden',
          message: 'Fandom is limited to creator'
        });
      }
    }
    default: { 
      // Fandom is public, or limitation passed
      return data!;
    }
  }
})
