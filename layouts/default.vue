<script setup lang="ts">
import NavBar from '@/components/NavBar/NavBar.vue'

const isActive = ref(false)
</script>
<template>
    <div class="layout">
        <header class="header">
            <Header />
        </header>
        <div class="content">
            <aside v-if="useNavBar().isEnable" class="sidebar" :class="{ active: isActive }">
                <NavBar />
            </aside>
            <main class="main-content">
                <slot />
            </main>
        </div>
        <a-float-button-group
            v-if="useNavBar().isEnable"
            class="menu_button"
            shape="square"
            :style="{ right: '20px' }"
        >
            <a-float-button @click="isActive = !isActive">
                <template #icon>
                    <MenuOutlined />
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
