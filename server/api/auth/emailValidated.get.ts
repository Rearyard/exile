export default defineEventHandler(async (event) => {
  const { client } = await useSupabase(event);

  const user = await client.auth.getUser()
  return user;
})
