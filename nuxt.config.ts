import content from '@originjs/vite-plugin-content'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  nitro: {
    static: true,
    prerender: {
      crawlLinks: true,
    },
  },
  vite: {
    plugins: [
      content()
    ]
  },
  app: {
    head: {
      viewport: 'width=device-width,initial-scale=1',
      link: [
        { rel: 'icon', href: '/logo.webp', sizes: 'any' }
      ],
    },
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['nuxtjs-naive-ui']
})
