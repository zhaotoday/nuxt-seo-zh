export default defineNuxtConfig({
  modules: [
    '@nuxtjs/seo',
    '@nuxt/content',
  ],

  site: {
    url: 'https://example.com',
    name: '精彩博客',
    description: '由 Nuxt Content 和 @nuxtjs/seo 驱动的博客。',
  },

  compatibilityDate: '2024-09-11',
})
