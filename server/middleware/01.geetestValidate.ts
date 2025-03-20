import {useGeetest} from "~/server/utils/useGeetest";

declare module 'h3' {
    interface H3EventContext {
        geetestValidated?: boolean
    }
}

export default defineEventHandler(async (event) => {
    const headers = getHeaders(event)
    const requiredHeaders = ['x-geetest-lot_number', 'x-geetest-captcha_output', 'x-geetest-pass_token', 'x-geetest-gen_time', 'x-geetest-captcha_id']
    if (requiredHeaders.every(header => header in headers)) {
        const geetest = useGeetest()
        const validate = await geetest.validate({
            lot_number: headers['x-geetest-lot_number']!,
            captcha_output: headers['x-geetest-captcha_output']!,
            pass_token: headers['x-geetest-pass_token']!,
            gen_time: headers['x-geetest-gen_time']!,
            captcha_id: headers['x-geetest-captcha_id']!,
        })
        console.log(`[geetestValidate] ${JSON.stringify(validate)}`)
        if (validate.status === 'success' && validate.result === 'success') {
            event.context.geetestValidated = true
        }
    } else {
        console.error('[geetestValidate] Missing required headers')
    }
})