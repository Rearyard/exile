import {z} from 'zod';

const querySchema  = z.object({
  uid: z.string()
})

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, querySchema.parse);
  const { client, serviceRoleClient } = await useSupabase();

  const {uid} = query;

  const {data: userData} = await serviceRoleClient.auth.admin.getUserById(uid)

  console.log(`[emailVerificationInfo] ${JSON.stringify(userData)}`);


  return {
    email: userData?.user?.email,
    confirmedAt: userData?.user?.email_confirmed_at,
  }
})
