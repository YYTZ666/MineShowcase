<script setup lang="ts">
import ServerList from '@/components/ServerList/ServerList.vue'

const title = useState<string>('pageTitle')
title.value = 'MSCPO'
useHead({
    title: title,
})
definePageMeta({
    navbar: 'index',
})
</script>

<template>
    <ServerList />
</template>
