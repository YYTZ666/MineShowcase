<script setup lang="ts">
import { ref, watch, shallowRef } from 'vue'
import DefaultNavBar from '~/components/NavBar/DefaultNavBar.vue'
import IndexNavBar from '~/components/NavBar/IndexNavBar.vue'
import Header from '~/components/Header.vue'

const isActive = ref(false)
const route = useRoute()
const navbarComponents: Record<string, Component> = {
    default: DefaultNavBar,
    index: IndexNavBar,
    user: DefaultNavBar,
}
let navbarType: string = (route.meta.navbar as string) || 'default'

const NavBarComponent = shallowRef(
    navbarComponents[navbarType] || navbarComponents['default'],
)

watch(
    () => route.meta.navbar,
    (newNavbarType) => {
        console.log('Navbar type changed:', newNavbarType) // 调试日志
        navbarType = (newNavbarType as string) || 'default'
        NavBarComponent.value =
            navbarComponents[navbarType] || navbarComponents['default']
        console.log('New NavBarComponent:', NavBarComponent.value) // 调试日志
    },
)
</script>
<template>
    <div class="layout">
        <header class="header">
            <Header />
        </header>
        <div class="content">
            <aside class="sidebar" :class="{ active: isActive }">
                <transition name="slide" mode="out-in">
                    <component :is="NavBarComponent"></component>
                </transition>
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
                    <MenuOutlined />
                </template>
            </a-float-button>
        </a-float-button-group>
    </div>
</template>

<style lang="less">
@import '../assets/css/default.less';

.slide-enter-active {
    transition:
        transform 0.5s ease,
        opacity 1s ease;
}
.slide-leave-active {
    transition:
        transform 0.5s ease,
        opacity 0.1s ease;
}

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
