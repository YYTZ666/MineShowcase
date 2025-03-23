<script setup lang="ts">
import { useNavBarStore } from '@/stores/NavBar'
import { watch, ref } from 'vue'

const navBarStore = useNavBarStore()
const componentsToRender = ref<Record<string, any>>({})

watch(
    () => navBarStore.navbarComponents,
    (newComponents) => {
        console.log('NavBar  components updated:', newComponents)
        componentsToRender.value = newComponents
    },
    { immediate: true },
)
</script>

<template>
    <div class="content-wrapper">
        <transition-group name="slide" tag="div">
            <component
                v-for="(comp, key) in componentsToRender"
                :key="key"
                :is="comp"
                class="section"
            />
        </transition-group>
    </div>
</template>

<style scoped lang="less">
@import '@/assets/css/variables.less';

.content-wrapper {
    padding: 0.5rem;
}

.section {
    width: 100%;
    border: 0px;
    background: #fff;
    @media (prefers-color-scheme: dark) {
        background: @surface-dark;
    }
    margin-bottom: 20px;

    .card-title {
        font-weight: bold;
        font-size: 16px;
        color: @text-color-light;
        @media (prefers-color-scheme: dark) {
            color: @text-color-dark;
        }
        padding: 5px 0;
    }
}

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
</style>
