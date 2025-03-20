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
                registerDesc: '申请加入 Rearyard',
                headsUp: '请注意！',
                alertContent: '我们目前只接受申请注册。填写以下表格后，如果审核通过，我们将向你的邮箱发送注册邮件。',
                submitRequest: '提交申请',
            }
        }
    }
}))
