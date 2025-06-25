import { z } from "zod/v4";

export default defineRearyardHandler(async (ctx) => {}, {
    strictAuth: false,
    querySchema: z.object({
        lastSyncKey: z.number().optional().default(0),
        count: z.number().optional().default(20),
    })
})