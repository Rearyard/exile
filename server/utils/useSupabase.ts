import { Database } from '~/types/database.types'
import {H3Event} from "h3";
import {serverSupabaseClient, serverSupabaseServiceRole} from "#supabase/server";

export const useSupabase = async (event: H3Event) => {
    return {
        client: await serverSupabaseClient<Database>(event),
        serviceRoleClient: await serverSupabaseServiceRole<Database>(event)
    }
}
