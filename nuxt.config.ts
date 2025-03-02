import content from '@originjs/vite-plugin-content'
export default defineNuxtConfig({
    devServer: {
        host: '127.0.0.1',
        port: 3000,
    },
    site: {
        url: 'https://mscpo.tblstudio.cn',
        name: 'Minecraft集体宣传组织(MSCPO)',
        description: 'Minecraft集体宣传组织(MSCPO) - 专业的Minecraft服务器宣传与技术交流平台，提供最新服务器资讯、开服教程和集体宣传片',
        defaultLocale: 'zh-cn',
        cacheMaxAgeSeconds: 24 * 3600,
        autoLastmod: true,
    },
    vite: { plugins: [content()] },
    experimental: {
        buildCache: true
    },
    nitro: {
        static: true,
        compressPublicAssets: {
            gzip: true,
            brotli: true,
        },
        prerender: {
            crawlLinks: true,
            routes: [
                '/robots.txt',
            ],
        },
    },
    ssr: true,
    features: {
        inlineStyles: true,
    },
    app: {
        head: {
            title: 'Minecraft集体宣传组织(MSCPO)',
            titleTemplate: '%s | MSCPO',
            viewport: 'width=device-width,initial-scale=1',
            meta: [
                { charset: 'utf-8' },
                { hid: 'keywords', name: 'keywords', content: 'Minecraft服务器,MC服务器宣传,我的世界技术交流,集体宣传片,开服教程' }, { property: 'og:title', content: 'Minecraft集体宣传组织(MSCPO) - 服务器宣传与技术交流平台' },
                { property: 'og:type', content: 'website' },
            ],
            link: [{ rel: 'icon', href: '/logo.webp', sizes: 'any' }],

        },
        pageTransition: {
            name: 'page',
            mode: 'in-out',
        },
    },
    compatibilityDate: '2025-03-03',
    devtools: { enabled: true },
    modules: [
        '@bg-dev/nuxt-naiveui',
        '@nuxtjs/seo'
    ],
})