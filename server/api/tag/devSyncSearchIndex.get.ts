export default defineDevOnlyHandler( async (event) => {
    const meilisearch = useMeilisearch();
    const { serviceRoleClient } = await useSupabase();

    const { data: tags, error } = await serviceRoleClient.from('tag').select('*');

    if (error) {
        throw createError({
            statusCode: 500,
            statusMessage: error.message,
        })
    }
    // clear the index
    await meilisearch.index('tag').delete();

    const res = await meilisearch.index('tag').addDocuments(tags);

    return res;
})