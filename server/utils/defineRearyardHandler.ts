import {EventHandler, EventHandlerRequest, H3Event} from "h3";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { z, ZodType } from "zod/v4";
import { Database } from "~/types/database.types";

interface IRearyardHandlerConfig<
    BodySchema extends ZodType = ZodType,
    QuerySchema extends ZodType = ZodType
> {
    /**
     * @description: If true, anonymous requests will be rejected
     * @default true
     */
    strictAuth?: boolean;
    bodySchema?: BodySchema;
    querySchema?: QuerySchema;
}

const defaultMetaConfig: IRearyardHandlerConfig = {
    strictAuth: true,
}

interface IFeaturedEventHandler<
    T extends EventHandlerRequest, 
    D, 
    BodySchema extends ZodType, 
    QuerySchema extends ZodType
> {
    (ctx: {
        event: H3Event<T>
        metaConfig: IRearyardHandlerConfig<BodySchema, QuerySchema>;
        user: User | null;
        supabaseUserRole: SupabaseClient<Database>;
        supabaseServiceRole: SupabaseClient<Database>;
        query: QuerySchema extends ZodType ? z.infer<QuerySchema> : unknown;
        body: BodySchema extends ZodType ? z.infer<BodySchema> : unknown;
    }): D;
}

export const defineRearyardHandler = <
    T extends EventHandlerRequest, 
    D, 
    BodySchema extends ZodType = ZodType,
    QuerySchema extends ZodType = ZodType
>(
    handler: IFeaturedEventHandler<T, D, BodySchema, QuerySchema>, 
    _metaConfig?: IRearyardHandlerConfig<BodySchema, QuerySchema>
): EventHandler<T, D> => defineEventHandler<T>(async (event) => {
    const supabase = await useSupabase()
    const metaConfig = Object.assign({}, defaultMetaConfig, _metaConfig);
    const user = metaConfig.strictAuth ? await useAuthGate() : supabase.optionalUser.user;
    let query: any;
    let body: any;
    if (metaConfig.bodySchema || metaConfig.querySchema) {
        const { query: queryResult, body: bodyResult } = await useParamValidGate({
            ...(metaConfig.querySchema ? { query: metaConfig.querySchema } : {}),
            ...(metaConfig.bodySchema ? { body: metaConfig.bodySchema } : {}),
        });
        query = queryResult;
        body = bodyResult;
    }
    return handler({
        event,
        metaConfig,
        user: user,
        supabaseUserRole: supabase.client,
        supabaseServiceRole: supabase.serviceRoleClient,
        query,
        body,
    });
});
