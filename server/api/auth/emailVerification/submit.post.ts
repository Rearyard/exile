import {z} from 'zod';

const bodySchema  = z.object({
  uid: z.string(),
  // six-digit code
  code: z.string().length(6),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, bodySchema.parse);

  const { serviceRoleClient, client } = await useSupabase();

  const {uid, code} = body;

  const user = await serviceRoleClient.auth.admin.getUserById(uid);


  const result = await serviceRoleClient.auth.verifyOtp({
    type: 'email',
    token: code.toString(),
    email: user.data.user?.email || '',
  });
  return {result};
})
