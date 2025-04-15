import { z } from 'zod'
import {useGeetestGuard} from '~/server/utils/useGeetest';

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  inviteCode: z.string().length(32).optional(),
})

export default defineEventHandler(async (event) => {
  useGeetestGuard(event);
  // TODO: geetest
  const { serviceRoleClient, client } = await useSupabase(event)
  const { email, password, inviteCode } = await readValidatedBody(event, bodySchema.parse)

  // check if invite code is valid
  let isInviteCodeValid = false
  if (inviteCode) {
    const rowId = await serviceRoleClient.from('invitation_code').select('id').eq('code', inviteCode).maybeSingle();
    isInviteCodeValid = !!rowId.data?.id
  }

  if (inviteCode && !isInviteCodeValid) {
    // TODO: throw error
  }

  const signUpResult = await client.auth.signUp({
    email,
    password,
  })

  return signUpResult

})
