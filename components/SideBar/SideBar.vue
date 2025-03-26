<script setup lang="ts">
import { watch, shallowRef } from 'vue'
import Stats from './components/stats.vue'
import Recommend from './components/recommend.vue'
import Filter from './components/filter.vue'
import { useRoute } from 'vue-router'

// 使用 useRoute 获取当前路由信息
const route = useRoute()

// 导航栏组件映射表
const sidebarComponents: Record<string, Component> = {
    default: Stats,
    Stats: Stats,
    Recommend: Recommend,
    Filter: Filter,
}

// 初始化导航栏类型为数组，默认值从路由元信息获取，若没有则使用 ['default']
let sidebarTypes: string[] = (route.meta.sidebar as string[]) || ['default']

// 浅引用存储当前要显示的导航栏组件，初始化为映射表中第一个导航栏类型对应的组件，若没有则使用默认组件
const SideBarComponents = shallowRef(
    sidebarTypes.map(
        (type) => sidebarComponents[type] || sidebarComponents['default'],
    ),
)

watch(
    () => route.meta.sidebar,
    (newSideBarTypes) => {
        if (newSideBarTypes === false) {
            // 当 route.meta.sidebar  为 false 时，清空导航栏组件数组
            SideBarComponents.value = []
            console.log(
                'Sidebar  is set to false, no components will be rendered.',
            )
        } else {
            // 打印调试日志，记录导航栏类型的变化
            console.log('Sidebar  types changed:', newSideBarTypes)
            // 更新导航栏类型数组，若新值不存在则使用 ['default']
            sidebarTypes = (newSideBarTypes as string[]) || ['default']
            // 更新要显示的导航栏组件数组，将每个导航栏类型映射为对应的组件，若没有则使用默认组件
            SideBarComponents.value = sidebarTypes.map(
                (type) => sidebarComponents[type] || sidebarComponents['default'],
            )
            // 打印调试日志，记录新的导航栏组件数组
            console.log('New  SideBarComponents:', SideBarComponents.value)
        }
    },
)
</script>

<template>
    <div class="content-wrapper">
        <transition-group name="slide" tag="div">
            <component
                v-for="(component, index) in SideBarComponents"
                :is="component"
                :key="index"
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
