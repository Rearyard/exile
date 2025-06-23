import {z} from 'zod';

const querySchema  = z.object({
  uid: z.string()
})

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, querySchema.parse);
  const { serviceRoleClient } = await useSupabase();

  const {uid} = query;

  const {data: userData, error} = await serviceRoleClient.auth.admin.getUserById(uid)

  if (error || !userData) {
    return {
      success: false,
      error: error?.message || 'Unknown error',
      data: {
        email: null,
        confirmedAt: null,
      }
    }
  }

  // mask email name, keep domain, and first 3 characters, and last 3 characters, if less than 6 characters, keep first and last character
  const email = userData.user.email!;
  const emailParts = email.split('@');
  const emailName = emailParts[0];
  const emailDomain = emailParts[1];
  const maskedEmail = emailName.length > 6 ? `${emailName.slice(0, 3)}${'*'.repeat(emailName.length - 6)}${emailName.slice(-3)}@${emailDomain}` : `${emailName.slice(0, 1)}${'*'.repeat(emailName.length - 2)}${emailName.slice(-1)}@${emailDomain}`;

  return {
    success: true,
    error: null,
    data: {
      email: maskedEmail,
      confirmedAt: userData.user.email_confirmed_at,
    }
  }
})
