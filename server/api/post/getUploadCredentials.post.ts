import STS from 'qcloud-cos-sts'
import type { GetCredentialOptions } from 'qcloud-cos-sts'
import { z } from "zod/v4";

function generateResource(uid: string, suffix: string) {
    const randomFileId = useNanoId(10)
    console.log(randomFileId)
    return {
        resource: `qcs::cos:ap-guangzhou:uid/1255681256:${process.env.TENCENT_COS_BUCKET}/${uid}/${randomFileId}.${suffix}`,
        fileName: `${uid}/${randomFileId}.${suffix}`
    }
}

// get file extension from file type
function getFileExtension(fileType: string) {
    return fileType.split('/')[1]
}

const config: GetCredentialOptions = {
    secretId: process.env.TENCENT_COS_ID as string,   // 固定密钥
    secretKey: process.env.TENCENT_COS_KEY as string,  // 固定密钥
    proxy: '',  
    host: 'sts.tencentcloudapi.com', // 域名，非必须，默认为 sts.tencentcloudapi.com
    // endpoint: 'sts.internal.tencentcloudapi.com', // 域名，非必须，与host二选一，默认为 sts.tencentcloudapi.com
    durationSeconds: 1800,  // 密钥有效期
    policy: {
        version: '2.0',
        statement: [
            {
                action: ['name/cos:PutObject'],
                effect: 'allow',
                resource: [`qcs::cos:ap-guangzhou:uid/1255681256:${process.env.TENCENT_COS_BUCKET}/*`]
            }
        ]
    },
};

function getOptions(uid: string, suffix: string) {
    const options = { ...config }
    const { resource, fileName } = generateResource(uid, suffix)
    // @ts-ignore
    options.policy.statement[0].resource = [resource]
    return {
        options,
        fileName,
    }
}

export default defineRearyardHandler(async (ctx) => {
    const { body, user } = ctx;
    const { options, fileName } = getOptions(user!.id, getFileExtension(body.fileType))
    const credential = await STS.getCredential(options)
    return {
        success: true,
        data: {
            credential,
            fileName,
        },
    }
}, {
    strictAuth: true,
    bodySchema: z.object({
        fileSize: z.number().min(1).max(1024 * 1024 * 10),
        fileType: z.enum(['image/png', 'image/jpeg']),
    }),
})
