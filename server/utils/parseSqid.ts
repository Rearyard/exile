// Why use sqids? 
// - I want to encode and decode ids in a way that is not easily guessable
// - I want to encode and decode multiple ids at once

import Sqids from 'sqids'

if (!process.env.SQID_ENCODE_ALPHABET) {
    throw new Error('SQID_ENCODE_ALPHABET is not set')
}

const sqids = new Sqids({
    minLength: 8,
    alphabet: process.env.SQID_ENCODE_ALPHABET,
})

export const encodeSqid = (ids: number[]) => {
    return sqids.encode(ids)
}

export const decodeSqid = (id: string, index: number = 0) => {
    return sqids.decode(id)[index]
}

export const encodeSqidInObject = <T extends { id: number }>(obj: T, _keys?: string[]): T & { id: string } => {
    const keys = _keys || ['id'];
    keys.forEach((key) => {
        // @ts-ignore
        if (obj[key] && Number.isInteger(obj[key])) {
            // @ts-ignore
            obj[key] = encodeSqid([obj[key]]);
        }
    });
    return obj as T & { id: string };
}