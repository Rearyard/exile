import {z} from 'zod';

const bodySchema  = z.object({
  uid: z.string(),
  // six-digit code
  code: z.number().int().min(100000).max(999999),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, bodySchema.parse);

  const { serviceRoleClient, client } = await useSupabase(event);

  const {uid, code} = body;

  const user = await serviceRoleClient.auth.admin.getUserById(uid);


  const result = await serviceRoleClient.auth.verifyOtp({
    type: 'email',
    token: code.toString(),
    email: user.data.user?.email || '',
  });
  return {result};
})
