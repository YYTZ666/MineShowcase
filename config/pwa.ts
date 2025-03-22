import type { ModuleOptions } from '@vite-pwa/nuxt'

const scope = '/'

export const pwa: ModuleOptions = {
    registerType: 'autoUpdate',
    strategies: 'generateSW',
    scope,
    base: scope,
    manifest: {
        name: 'Minecraft Server Collective Promotion Organization',
        short_name: 'MSCPO',
        description:
            'The Minecraft Server Collective Promotion Organization (MSCPO) is an up-and-coming organization dedicated to the propaganda and technical communication of Minecraft servers (x) Fellow server owners group (√)',
        theme_color: '#06f',
        icons: [
            {
                src: '/logo-120x120.webp',
                sizes: '120x120',
                type: 'image/webp',
            },
            {
                src: '/logo-192x192.webp',
                sizes: '192x192',
                type: 'image/webp',
            },
            {
                src: '/logo-512x512.webp',
                sizes: '512x512',
                type: 'image/webp',
            },
        ],
    },
    workbox: {
        navigateFallback: null,
        navigateFallbackDenylist: [/./],
        globPatterns: ['**/*.{js,css,html,txt,png,ico,svg,webp}'],
        cleanupOutdatedCaches: true,
        runtimeCaching: [
            {
                urlPattern: /^https:\/\/.*/i,
                handler: 'StaleWhileRevalidate',
                options: {
                    cacheName: 'cross-origin-assets',
                    expiration: {
                        maxEntries: 64,
                        maxAgeSeconds: 24 * 60 * 60,
                    },
                },
            },
        ],
    },
    registerWebManifestInRouteRules: true,
    writePlugin: true,
    devOptions: {
        enabled: true,
        navigateFallback: scope,
    },
}
