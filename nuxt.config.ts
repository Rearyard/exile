// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    'nuxt-lodash',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    'motion-v/nuxt',
    'shadcn-nuxt',
    '@nuxtjs/i18n',
    '@nuxtjs/supabase',
    'nuxt-zod-i18n',
    '@vueuse/nuxt',
    '@pinia/nuxt'
  ],
  vite: {
    // hmr via https
    server: {
      allowedHosts: ['dev.rearyard.com'],
      hmr: {
        host: 'dev.rearyard.com',
        protocol: 'wss'
      }
    }
  },
  nitro: {
    experimental: {
      openAPI: true,
      asyncContext: true
    }
  },
  pinia: {
    storesDirs: ['./stores/**'],
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },
  colorMode: {
    classSuffix: '',
  },
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/callback',
      exclude: ['/auth/*', '/api/auth/*']
    }
  },
  i18n: {
    defaultLocale: 'zh-CN',
    locales: [
      {
        code: 'zh-CN',
        name: '简体中文',
        iso: 'zh-CN',
        file: 'zh.ts'
      }
    ]
  }
})