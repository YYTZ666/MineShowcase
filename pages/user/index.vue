<script setup lang="ts">
import UserPanel from '../../components/UserPanel/UserPanel.vue'
definePageMeta({
    navbar: 'user',
})
const title = useState<string>('pageTitle')
title.value = '用户页'
useHead({
    title: title,
})
</script>

<template>
    <UserPanel />
</template>
