<script setup lang="ts">
import SideBar from '@/components/SideBar/SideBar.vue'
const isActive = ref(false)
</script>
<template>
    <div class="layout">
        <header class="header">
            <Header />
        </header>
        <div class="content">
            <aside class="sidebar" :class="{ active: isActive }">
                <SideBar />
            </aside>
            <main class="main-content">
                <slot />
            </main>
        </div>
        <a-float-button-group
            class="menu_button"
            shape="square"
            :style="{ right: '20px' }"
        >
            <a-float-button @click="isActive = !isActive">
                <template #icon>
                    <MoreOutlined />
                </template>
            </a-float-button>
        </a-float-button-group>
    </div>
</template>

<style lang="less">
@import '../assets/css/default.less';

.slide-enter-from,
.slide-leave-to {
    transform: translateY(-100%);
    opacity: 0;
}

.slide-enter-to,
.slide-leave-from {
    transform: translateY(0);
    opacity: 1;
}

.active {
    transform: translateX(0) !important;
}
</style>
