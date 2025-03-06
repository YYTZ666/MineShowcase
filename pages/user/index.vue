<script setup lang="ts">
import UserPanel from '../../components/UserPanel/UserPanel.vue'
definePageMeta({
    navbar: 'user',
})
useHead({
    title: '用户页',
})
</script>

<template>
    <UserPanel />
</template>
