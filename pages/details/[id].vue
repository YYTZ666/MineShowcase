<script setup lang="ts">
import NavBar from '../../components/NavBar.vue'
import Header from '../../components/Header.vue'
import Details from '../../components/ServerList/Details.vue'
import '../assets/css/index.less'
</script>

<template>
    <div class="layout">
        <header class="header">
            <Header />
        </header>
        <div class="content">
            <aside class="sidebar">
                <NavBar />
            </aside>
            <main class="main-content">
                <Details />
            </main>
        </div>
    </div>
</template>
<style scoped lang="less">
@import '../assets/css/default.less';
</style>
