<script setup lang="ts">
import '~/assets/css/index.less'
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
})
</script>

<template>
    <a-extract-style>
        <a-config-provider>
            <NuxtLayout>
                <NuxtPage />
            </NuxtLayout>
        </a-config-provider>
    </a-extract-style>
</template>
