<script setup lang="ts">
useHead({
    link: [
        {
            rel: 'preconnect',
            href: 'https://mscpoapi.tblstudio.cn',
            crossorigin: 'anonymous',
        },
        { rel: 'dns-prefetch', href: 'https://mscpoapi.tblstudio.cn' },
    ],
})

import { ref, watchEffect, onMounted, onUnmounted } from 'vue'

const dark_theme = ref(false)
const updateTheme = (e?: MediaQueryListEvent) => {
    if (typeof window !== 'undefined') {
        const isDarkMode = e
            ? e.matches
            : window.matchMedia('(prefers-color-scheme:  dark)').matches
        dark_theme.value = isDarkMode
    }
}

watchEffect(() => {
    updateTheme()
})

onMounted(() => {
    if (typeof window !== 'undefined') {
        const mediaQuery = window.matchMedia('(prefers-color-scheme:  dark)')
        updateTheme()
        mediaQuery.addEventListener('change', updateTheme)
    }
})

onUnmounted(() => {
    if (typeof window !== 'undefined') {
        const mediaQuery = window.matchMedia('(prefers-color-scheme:  dark)')
        mediaQuery.removeEventListener('change', updateTheme)
    }
})
</script>

<template>
    <naive-config :dark="dark_theme">
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </naive-config>
</template>
