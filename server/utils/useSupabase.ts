import { Database } from '~/types/database.types'
import {H3Event} from "h3";
import {serverSupabaseClient, serverSupabaseServiceRole} from "#supabase/server";

export const useSupabase = async () => {
    return {
        client: await serverSupabaseClient<Database>(useEvent()),
        serviceRoleClient: serverSupabaseServiceRole<Database>(useEvent())
    }
}
