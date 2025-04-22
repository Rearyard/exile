import { createI18n } from 'vue-i18n'

import zh from './locales/zh'

const i18n = createI18n({
    locale: 'zh-CN',
    messages: {
        'zh-CN': zh,
    }
})

export default i18n;