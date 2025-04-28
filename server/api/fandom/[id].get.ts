
export default defineEventHandler(async (event) => {
  const { serviceRoleClient } = await useSupabase();
})
