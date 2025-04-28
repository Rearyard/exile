import { Database } from '~/types/database.types'
import {H3Event} from "h3";
import {serverSupabaseClient, serverSupabaseServiceRole, serverSupabaseUser} from "#supabase/server";

export const useSupabase = async () => {
    return {
        user: await serverSupabaseUser(useEvent()).then(user => {
            return {
                user,
                error: null,
            }
        }).catch(e => {
            return {
                user: null,
                error: e,
            }
        }),
        client: await serverSupabaseClient<Database>(useEvent()),
        serviceRoleClient: serverSupabaseServiceRole<Database>(useEvent())
    }
}
