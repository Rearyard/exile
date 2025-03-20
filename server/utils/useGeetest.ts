import crypto from 'crypto'

const GEETEST_CAPTCHA_ID = process.env.GEETEST_CAPTCHA_ID
const GEETEST_CAPTCHA_KEY = process.env.GEETEST_CAPTCHA_KEY
const GEETEST_API = 'http://gcaptcha4.geetest.com/validate'

function hmac_sha256_encode(data: string, key: string) {
    return crypto.createHmac('sha256', key).update(data).digest('hex')
}

function generateSignToken(lotNumber: string) {
    return hmac_sha256_encode(lotNumber || '', GEETEST_CAPTCHA_KEY || '')
}

// 参数名	类型	说明
// lot_number	string	验证流水号
// captcha_output	string	验证输出信息
// pass_token	string	验证通过标识
// gen_time	string	验证通过时间戳
// captcha_id	string	验证 id
// sign_token	string	验证签名
function validate(params: {
    lot_number: string,
    captcha_output: string,
    pass_token: string,
    gen_time: string,
    captcha_id: string,
}) {
    // {"result":"success","reason":"","captcha_args":{"used_type":"slide","user_ip":"113.109.163.86","lot_number":"aa725b0f7f9b46449d630287bbb8fe4d","scene":"注册","referer":"http://localhost:3000/","ip_type":3,"user_info":"","client_type":"web","ua":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit37.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36","fail_count":0},"status":"success"}
    console.log(`[useGeetest] validate: ${JSON.stringify(params)}`)
    const body = new URLSearchParams()
    body.append('lot_number', params.lot_number)
    body.append('captcha_output', params.captcha_output)
    body.append('pass_token', params.pass_token)
    body.append('gen_time', params.gen_time)
    body.append('captcha_id', params.captcha_id)
    body.append('sign_token', generateSignToken(params.lot_number))
    return $fetch<string>(GEETEST_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        query: {
            captcha_id: GEETEST_CAPTCHA_ID,
        },
        body: body.toString(),
    }).then(res => JSON.parse(res) as {
        status: string,
        result: string,
    })
}

export const useGeetest = () => {
    return {
        validate,
    }
}