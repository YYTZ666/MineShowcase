<script setup lang="ts">
import Edit from '../../components/Edit/Edit.vue'
const title = useState<string>('pageTitle')
title.value = '编辑'
useHead({
    title: title,
})
</script>

<template>
    <Edit />
</template>
