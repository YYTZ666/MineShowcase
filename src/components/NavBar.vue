<script setup>
import lang from '../languages/index'
</script>

<template>
    <div class="navbar">
        {{ lang }}
    </div>
</template>

<style scoped lang="less">
.navbar {
    display: flex;
    height: 100%;
    width: 100%;
}
</style>