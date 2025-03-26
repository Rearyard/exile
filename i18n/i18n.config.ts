export default defineI18nConfig(() => ({
    legacy: false,
    locale: 'zh-CN',
    messages: {
        'zh-CN': {
            login: '登 录',
            loginDesc: '使用您的邮箱和密码登录',
            forgotPassword: '忘记密码？',
            email: '邮箱',
            password: '密码',
            dontHaveAccount: '没有账号？',
            alreadyHaveAccount: '已有账号？',
            register: '申请注册',
            directToLogin: '直接登录',
            captcha: '验证码',
            submit: '提交',
            registerPage: {
                inviteCode: '邀请码',
                registerDesc: '申请加入 Rearyard',
                headsUp: '请注意！',
                alertContent: '在注册申请通过前，你可以先行体验部分功能。但如果审核不通过，账号功能将被冻结直到审核通过，所以请认真回答申请问题。',
                submitRequest: '提交申请',
            }
        }
    }
}))
