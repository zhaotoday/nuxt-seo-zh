export default defineNuxtConfig({
  modules: [
    '@nuxtjs/seo',
    '@nuxtjs/i18n',
  ],

  site: {
    url: 'https://example.com',
    name: '精彩站点',
    description: '欢迎来到我的精彩站点。',
  },

  i18n: {
    baseUrl: 'https://example.com',
    defaultLocale: 'zh',
    strategy: 'prefix_except_default',
    locales: [
      { code: 'zh', language: 'zh-CN', file: 'zh.ts', name: '中文' },
      { code: 'en', language: 'en-US', file: 'en.ts', name: 'English' },
      { code: 'es', language: 'es-ES', file: 'es.ts', name: 'Español' },
      { code: 'fr', language: 'fr-FR', file: 'fr.ts', name: 'Français' },
    ],
  },

  compatibilityDate: '2024-08-07',
})
