import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import content from '@originjs/vite-plugin-content'
import Pages from "vite-plugin-pages";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    Pages({
      dirs: 'src/pages',
      extensions: [
        'vue',
        'md'
      ]
    }),
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
