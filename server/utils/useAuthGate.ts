import { ErrCode } from "~/types/enums/ErrCode"

export const useAuthGate = async () => {
    const { optionalUser } = await useSupabase()
    if (!optionalUser) {
        return throwLogicError({
            code: ErrCode.UNAUTHORIZED,
            msg: 'Unauthorized: No user found',
        })
    }
    if (optionalUser.error) {
        return throwLogicError({
            code: ErrCode.UNAUTHORIZED,
            msg: 'Unauthorized: Supabase error',
        })
    }
    if (!optionalUser.user) {
        return throwLogicError({
            code: ErrCode.UNAUTHORIZED,
            msg: 'Unauthorized: No user found',
        })
    }
    return optionalUser.user!;
}