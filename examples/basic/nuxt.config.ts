export default defineNuxtConfig({
  modules: ['@nuxtjs/seo'],

  site: {
    url: 'https://example.com',
    name: '精彩站点',
    description: '欢迎来到我的精彩站点。',
    defaultLocale: 'zh',
  },

  compatibilityDate: '2024-08-07',
})
