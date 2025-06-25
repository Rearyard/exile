import { z } from "zod/v4";

export default defineRearyardHandler(async (ctx) => {
    const { body, query } = ctx;
    return {
        success: true,
        data: {
            fileSize: body.fileSize,
            fileType: body.fileType,
        },
    }
}, {
    strictAuth: false,
    bodySchema: z.object({
        fileSize: z.number().min(1).max(1024 * 1024 * 10),
        fileType: z.enum(['image/png', 'image/jpeg']),
    }),
})
