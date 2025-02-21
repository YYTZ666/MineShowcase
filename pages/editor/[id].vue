<script setup lang="ts">
/**
 *
 * 开发中，暂未完成，等待手机端完成
 *
 */

import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router' // 导入 useRoute 函数
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import NavBar from '../../components/NavBar.vue'
import Header from '../../components/Header.vue'
import { lightTheme, NConfigProvider } from 'naive-ui'
import '../assets/css/index.less'
import { useRequest } from 'alova/client'
import { ServerAPI } from '../../hooks/api'
import type { Status } from '../../hooks/type_models'

// 获取当前路由信息
const route = useRoute()
const ServerID = route.params.id

// 获取服务器信息，并使用 useRequest 进行 API 调用
const { data, onSuccess } = useRequest(
    ServerAPI.Get<Status>(`/v1/servers/info/${ServerID}`),
)

// 初始化文本内容
const text = ref('待添加')

onSuccess(() => {
    // 文本内容赋值
    text.value = data.value.desc
    console.log(data.value.desc)
})

// 初始化输入框宽度
const inputBoxWidth = ref('50%')

// 初始化输入框宽度
const initInputBoxWidth = () => {
    if (window.innerWidth <= 768) {
        inputBoxWidth.value = '100%'
    } else {
        inputBoxWidth.value = '50%'
    }
}

// 组件挂载时初始化输入框宽度并添加窗口大小监听事件
onMounted(() => {
    initInputBoxWidth()
    window.addEventListener('resize', initInputBoxWidth)
})

// 组件卸载时移除窗口大小监听事件
onUnmounted(() => {
    window.removeEventListener('resize', initInputBoxWidth)
})
</script>

<template>
    <n-config-provider :theme="lightTheme">
        <div class="layout">
            <header class="header">
                <Header />
            </header>
            <div class="content">
                <aside class="sidebar">
                    <NavBar />
                </aside>
                <main class="main-content">
                    <br />
                    <ClientOnly>
                        <MdEditor
                            v-model="text"
                            style="width: 100%; height: 100%"
                            editor-id="ServerInfo"
                            :inputBoxWidth="inputBoxWidth"
                            noMermaid
                        />
                    </ClientOnly>
                </main>
            </div>
        </div>
    </n-config-provider>
</template>

<style scoped lang="less">
@primary-color: #fff;
@header-height: 60px;
@sidebar-width: 280px;
@padding-size: 1rem;
@border-color: #ddd;

.layout {
    display: flex;
    flex-direction: column;
    height: 100vh;

    .header {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background-color: @primary-color;
        height: @header-height;
        box-sizing: border-box;
        padding: @padding-size;
        border-bottom: 1px solid @border-color;
        z-index: 100;
    }

    .content {
        display: flex;
        flex-grow: 1;
        background-color: @primary-color;
        margin-top: @header-height;

        .sidebar {
            position: fixed;
            left: 0;
            box-sizing: border-box;
            width: @sidebar-width;
            padding: @padding-size;
            padding-top: 0;
            padding-right: 0;
            height: calc(100vh - @header-height);
            border-right: 1px solid @border-color;
            z-index: 100;
            transition: 0.3s all;

            @media screen and (max-width: 1200px) {
                transform: translateX(-@sidebar-width);
            }
        }

        .main-content {
            margin-left: @sidebar-width;
            width: 100%;
            box-sizing: border-box;
            max-height: 100%;
            padding: @padding-size;
            padding-top: 0;
            transition: 0.3s all;
            @media screen and (max-width: 1200px) {
                margin-left: 0;
            }
        }
    }
}
</style>
