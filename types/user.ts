export interface User {
    uid: string;
    avatar: string;
    signature: string;
    nickname: string;
}

export type PublicUser = Pick<User, 'uid' | 'avatar' | 'nickname' | 'signature'>;
