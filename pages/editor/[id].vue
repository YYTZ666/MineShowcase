<script setup lang="ts">
import NavBar from '../../components/NavBar.vue'
import Header from '../../components/Header.vue'
import Edit from '../../components/Edit/Edit.vue'
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
                <Edit />
            </main>
        </div>
    </div>
</template>

<style scoped lang="less">
@import '../assets/css/default.less';
</style>
