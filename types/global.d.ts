interface CaptchaConfig {
    captchaId?: string // 验证 id，极验后台申请得到，必填
    product?: 'float' | 'popup' | 'bind' // 设置下一步验证的展现形式，默认为 'float'
    nativeButton?: {
        width: string // 宽度，单位可以是 px, %, em, rem, pt
        height: string // 高度，单位可以是 px, %, em, rem, pt
    } // 极验按钮样式设置，默认为 { width: '260px', height: '50px' }
    rem?: number // 设置验证码整体的缩放比例，默认为 1
    language?:
        | 'zho'
        | 'eng'
        | 'zho-tw'
        | 'zho-hk'
        | 'udm'
        | 'jpn'
        | 'ind'
        | 'kor'
        | 'rus'
        | 'ara'
        | 'spa'
        | 'pon'
        | 'por'
        | 'fra'
        | 'deu' // 设置验证界面文字的语言，默认为浏览器语言设置
    protocol?: 'http://' | 'https://' // 协议头，默认取当前页面协议
    timeout?: number // 设置验证过程中单个请求超时时间，默认为 30000（ms）
    hideBar?: ('close' | 'refresh')[] // 隐藏后续验证界面的关闭按钮、刷新按钮，默认为空数组
    mask?: {
        outside: boolean // 点击验证码区域外是否关闭验证
        bgColor: string // 弹窗背景色
    } // 弹窗相关配置项，默认为 { outside: false, bgColor: '#0000004d' }
    apiServers?: string[] // 控制api请求的地址，默认为 ['gcaptcha4.geetest.com']
    nextWidth?: string // 验证码弹窗的宽度，此参数设置后，验证码弹窗将不会自动根据网页内容宽度调整
    riskType?: string // 结合风控融合，指定验证形式
    hideSuccess?: boolean // 隐藏bind展现形式下的验证成功弹窗，默认为 false
    offlineCb?: () => void // 宕机模式处理函数，设置了此函数代表想自定义宕机逻辑
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError?: (error: any) => void // 初始化验证码之前的错误捕获
    userInfo?: string // 客户端信息，例如用户账号、用户手机号、用户名等
}

interface GeetestResult {
    captcha_id: string;
    captcha_output: string;
    gen_time: string;
    lot_number: string;
    pass_token: string;
}

declare global {
    interface Geetest {
        appendTo: (selector: string) => void
        getValidate: () => GeetestResult | undefined
        reset: () => void
        onStatusChange: (cb: (status: 'success' | 'fail' | 'error') => void) => void
    }
    interface Window {
        initGeetest4: (options: CaptchaConfig, cb: (geetest: Geetest) => void) => void;
    }
}

export {
    CaptchaConfig,
    Geetest
};