import { z } from 'zod';
import { defaults } from 'lodash-es';

const querySchema = z.object({
    uid: z.string().uuid().optional()
});

const userInfoBase = {
    nickname: '',
    avatarUrl: '',
    signature: '',
    isFollowing: false,
    isFollowingMe: false,
}


export default defineEventHandler(async (event) => {
    const { client, serviceRoleClient, requiredUser } = await useSupabase();
    const user = await requiredUser();

    const { query } = await useParamValidGate({
        query: querySchema,
    });

    const isQueryingSelf = (query.uid === user?.id) || !query.uid;

    const uid = query.uid || user?.id || '';

    let result = defaults({}, userInfoBase);

    if (!uid) {
        return result
    }

    const { data, error } = await serviceRoleClient.auth.admin.getUserById(uid);

    if (!data?.user || error) {
        console.error('Error fetching user info:', error);
        return result;
    }

    result = defaults(result, data?.user?.user_metadata);

    if (!isQueryingSelf) {
        const isFollowingReq = serviceRoleClient.from('follow').select('id').eq('follower_id', user!.id).eq('followee_id', uid).maybeSingle();
        const isFollowingMeReq = serviceRoleClient.from('follow').select('id').eq('follower_id', uid).eq('followee_id', user!.id).maybeSingle();
        const [isFollowingRes, isFollowingMeRes] = await Promise.all([isFollowingReq, isFollowingMeReq]);
        result.isFollowing = !!isFollowingRes.data?.id
        result.isFollowingMe = !!isFollowingMeRes.data?.id
    }

    return result;
})
