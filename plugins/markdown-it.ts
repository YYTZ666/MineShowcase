import MarkdownIt from 'markdown-it'
import { full as emoji } from 'markdown-it-emoji'

export default defineNuxtPlugin((nuxtApp) => {
    const mdIt = new MarkdownIt()

    // 插件区
    mdIt.use(emoji)

    nuxtApp.provide('markdown', mdIt)
})
