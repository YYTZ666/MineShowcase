import content from '@originjs/vite-plugin-content'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  vite: {
    plugins: [
      content()
    ]
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['nuxtjs-naive-ui']
})
