<script setup lang="ts">
import ServerList from '@/components/ServerList/ServerList.vue'

import Filter from '@/components/NavBar/components/filter.vue'
import Recommend from '@/components/NavBar/components/recommend.vue'
import Stats from '@/components/NavBar/components/stats.vue'
useNavBar({
    enable: true,
    component: [Recommend, Stats, Filter],
})
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
