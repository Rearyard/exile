import type { Database } from '~/types/database.types'
import {serverSupabaseClient, serverSupabaseServiceRole, serverSupabaseUser} from "#supabase/server";
import {ErrCode} from "~/types/enums/ErrCode";

export const useSupabase = async () => {
    return {
        optionalUser: await serverSupabaseUser(useEvent()).then(user => {
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
        requiredUser: () => serverSupabaseUser(useEvent()).catch(e => {
            return throwLogicError({
                code: ErrCode.UNAUTHORIZED,
                msg: 'Unauthorized: No user found',
            })
        }),
        client: await serverSupabaseClient<Database>(useEvent()),
        serviceRoleClient: serverSupabaseServiceRole<Database>(useEvent())
    }
}
