<script setup lang="ts">
// 空的首页布局，不包含导航栏和侧边栏
</script>

<template>
    <div class="layout">
        <header class="header">
            <Header />
        </header>
        <main class="main-content">
            <slot />
        </main>
    </div>
</template>

<style lang="less" scoped>
@import '../assets/css/default.less';

main-content {
    overflow-y: auto !important;
}
</style>
