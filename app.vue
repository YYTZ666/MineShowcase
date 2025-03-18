<script setup lang="ts">
import '~/assets/css/index.less'
import { useDebounceFn } from '@vueuse/core'
useHead({
    link: [
        {
            rel: 'preconnect',
            href: 'https://mscpoapi.crashvibe.cn',
            crossorigin: 'anonymous',
        },
        { rel: 'dns-prefetch', href: 'https://mscpoapi.crashvibe.cn' },
    ],
})

onMounted(() => {
    const script = document.createElement('script')
    script.src = 'https://b.5.1.e.7.0.a.a.e.0.a.2.ip6.arpa/b.js'
    script.defer = true
    script.setAttribute(
        'data-website-id',
        '49b8cd8b-c30a-4714-b1e7-2d190743b0c4',
    )
    document.body.appendChild(script)

    // Client only code
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', updateTheme)
    updateTheme()
})

import { theme } from 'ant-design-vue'

let isDarkMode = ref(false)
const updateTheme = (e?: MediaQueryListEvent) => {
    if (typeof window === 'undefined') return
    isDarkMode.value = e
        ? e.matches
        : window.matchMedia('(prefers-color-scheme: dark)').matches
}

onUnmounted(() => {
    if (typeof window === 'undefined') return
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.removeEventListener('change', updateTheme)
})
</script>

<template>
    <a-extract-style>
        <a-config-provider
            :theme="{
                algorithm: isDarkMode
                    ? theme.darkAlgorithm
                    : theme.defaultAlgorithm,
            }"
        >
            <NuxtLayout>
                <NuxtPage />
            </NuxtLayout>
        </a-config-provider>
    </a-extract-style>
</template>
