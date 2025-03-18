import type { ModuleOptions } from '@vite-pwa/nuxt'
import process from 'node:process'

const scope = '/'

export const pwa: ModuleOptions = {
    registerType: 'autoUpdate',
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
        globPatterns: ['**/*.{js,css,html,txt,png,ico,svg,webp}'],
        navigateFallbackDenylist: [/^\/api\//],
        navigateFallback: '/',
        cleanupOutdatedCaches: true,
        runtimeCaching: [
            {
                urlPattern: /^https:\/\/fonts.googleapis.com\/.*/i,
                handler: 'CacheFirst',
                options: {
                    cacheName: 'google-fonts-cache',
                    expiration: {
                        maxEntries: 10,
                        maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
                    },
                    cacheableResponse: {
                        statuses: [0, 200],
                    },
                },
            },
            {
                urlPattern: /^https:\/\/fonts.gstatic.com\/.*/i,
                handler: 'CacheFirst',
                options: {
                    cacheName: 'gstatic-fonts-cache',
                    expiration: {
                        maxEntries: 10,
                        maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
                    },
                    cacheableResponse: {
                        statuses: [0, 200],
                    },
                },
            },
        ],
    },
    registerWebManifestInRouteRules: true,
    writePlugin: true,
    devOptions: {
        enabled: process.env.VITE_PLUGIN_PWA === 'true',
        navigateFallback: scope,
    },
}
