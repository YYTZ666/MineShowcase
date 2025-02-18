import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueRouter from "unplugin-vue-router/vite"
import content from '@originjs/vite-plugin-content'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    VueRouter({}),
    vue(),
    content()
  ],
  ssr: {
    noExternal: ['naive-ui', 'vueuc', 'date-fns']
  },
  ssgOptions: {
    script: "async",
    formatting: "prettify",
  },
})
