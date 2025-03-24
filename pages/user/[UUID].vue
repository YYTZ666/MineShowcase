<script setup lang="ts">
import UserPanel from '@/components/UserPanel/UserPanel.vue'
import UserProfile from '@/components/UserPanel/UserProfile.vue'
const route = useRoute()
const UserType = route.params.UUID

definePageMeta({
    sidebar: ['Stats', 'Recommend'],
})

useHead({
    title: '用户页',
})
</script>

<template>
    <UserPanel v-if="UserType === 'me'" />
    <UserProfile v-else />
</template>
