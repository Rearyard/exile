import {EventHandler, EventHandlerRequest, H3Event} from "h3";
import type { SupabaseClient, User } from "@supabase/supabase-js";

interface IRearyardHandlerConfig {
    /**
     * @description: If true, anonymous requests will be rejected
     * @default true
     */
    strictAuth?: boolean;
}

const defaultMetaConfig: IRearyardHandlerConfig = {
    strictAuth: true,
}

interface IFeaturedEventHandler<T extends EventHandlerRequest, D> {
    (ctx: {
        event: H3Event<T>
        metaConfig: IRearyardHandlerConfig;
        user: User | null;
        supabaseUserRole: SupabaseClient;
        supabaseServiceRole: SupabaseClient;
    }): D;
}

export const defineRearyardHandler = <T extends EventHandlerRequest, D>(handler: IFeaturedEventHandler<T, D>, _metaConfig?: IRearyardHandlerConfig): EventHandler<T, D> => defineEventHandler<T>(async (event) => {
    const supabase = await useSupabase()
    const metaConfig = Object.assign({}, defaultMetaConfig, _metaConfig);
    const user = metaConfig.strictAuth ? await useAuthGate() : supabase.optionalUser.user;
    return handler({
        event,
        metaConfig,
        user: user,
        supabaseUserRole: supabase.client,
        supabaseServiceRole: supabase.serviceRoleClient,
    });
});
