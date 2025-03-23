<script setup lang="ts">
import { useNavBarStore } from '@/stores/NavBar'
import { watch, shallowRef } from 'vue'
import { defineAsyncComponent } from 'vue'

const navBarStore = useNavBarStore()
const componentsToRender = shallowRef<Record<string, any>>({})

// 组件映射
const componentMap: Record<string, any> = {
    Stats: defineAsyncComponent(() => import('./components/stats.vue')),
    Recommend: defineAsyncComponent(() => import('./components/recommend.vue')),
    Filter: defineAsyncComponent(() => import('./components/filter.vue')),
}

watch(
    () => navBarStore.navbarComponents,
    (newComponents) => {
        console.log('NavBar  components updated:', newComponents)
        const resolvedComponents: Record<string, any> = {}
        for (const [key, compName] of Object.entries(newComponents)) {
            const comp = getComponentByName(compName as string)
            resolvedComponents[key] = comp
        }
        componentsToRender.value = resolvedComponents
    },
    { immediate: true },
)

function getComponentByName(name: string) {
    const component = componentMap[name]
    if (!component) {
        console.error(`组件"${name}"未在 componentMap 中找到。`)
        return null
    }
    return component
}
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
