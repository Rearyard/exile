import { z } from "zod";

const bodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
})

export default defineEventHandler(async (event) => {
    useGeetestGuard(event);
    
    const body = await readValidatedBody(event, bodySchema.parse);

    const { client } = await useSupabase(event)

    const { data, error } = await client.auth.signInWithPassword({
        email: body.email,
        password: body.password,
    })
    
    if (error) {
        throw createError({
            statusCode: 401,
            statusMessage: error.message,
        })
    }

    return {
        data: data.user,
    }
})