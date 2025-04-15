import {z} from 'zod';

const bodySchema  = z.object({
  uid: z.string()
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, bodySchema.parse);
  const { serviceRoleClient } = await useSupabase(event);

  const {uid} = body;

  console.log(uid);

  const {data: userData} = await serviceRoleClient.auth.admin.getUserById(uid);

  if (!userData) {
    // TODO: throw error
  }

  const {data: resendResult} = await serviceRoleClient.auth.resend({
    type: 'signup',
    email: userData.user?.email!,
    options: {
      emailRedirectTo: 'https://example.com/welcome'
    }
  })

  console.log(`[emailVerificationSend] ${JSON.stringify(resendResult)}`);

  return {
    ...resendResult,
  }
})
