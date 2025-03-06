<script setup lang="ts">
import ServerList from '@/components/ServerList/ServerList.vue'
definePageMeta({
    navbar: 'index',
})
useHead({
    title: '主页',
})
</script>

<template>
    <ServerList />
</template>
