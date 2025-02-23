<script setup lang="ts">
/**
 *
 * 开发中，暂未完成，等待手机端完成
 *
 */

import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router' // 导入 useRoute 函数
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import NavBar from '../../components/NavBar.vue'
import Header from '../../components/Header.vue'
import '../assets/css/index.less'
import { useRequest } from 'alova/client'
import { ServerAPI, fetch_status } from '../../hooks/api'
import type { Status, Fetch_Status } from '../../hooks/type_models'
import Img404 from '../../assets/error.jpg'
import { debounce } from 'lodash'

// 获取当前路由信息
const route = useRoute()
const ServerID = route.params.id

// 获取服务器信息，并使用 useRequest 进行 API 调用
const { data, onSuccess } = useRequest(
    ServerAPI.Get<Status>(`/v1/servers/info/${ServerID}`),
)

const info = ref({
    code: 200,
    text: '获取中...',
    name: '获取中...',
    ip: '获取中...',
})

onSuccess(() => {
    console.log(data.value)
    // 文本内容赋值
    if (data.value.code == 200) {
        info.value.text = data.value.desc
        info.value.name = data.value.name
        if (data.value.ip) {
            info.value.ip = data.value.ip
        } else {
            info.value.ip = '待填写'
        }
    } else {
        info.value.code = data.value.code
        if (data.value.detail != undefined) {
            info.value.name = data.value.detail
            info.value.text = data.value.detail
            console.error(
                `请求失败: Code ${data.value.code} ${data.value.detail}`,
            )
        }
    }
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

const ServerOnline = ref<undefined | string>(undefined)

// 获取服务器状态
const debouncedCallback = debounce(() => {
    const { data, onSuccess } = useRequest(
        fetch_status.Get<Fetch_Status>(`?ip=${info.value.ip}`),
    )
    onSuccess(() => {
        if (data.value.online) {
            ServerOnline.value = 'warning'
        } else {
            ServerOnline.value = 'error'
        }
        if (info.value.ip === '') {
            ServerOnline.value = undefined
        }
    })
}, 1000) // 防抖时间为500毫秒，可以根据需求调整

// 监听 IP 变化，获取服务器状态以检查服务器 IP 可用性
watch(() => info.value.ip, debouncedCallback)
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
                <br />
                <ClientOnly>
                    <h1>服务器信息</h1>
                    <div v-if="info.code == 200">
                        <h2>编辑：{{ info.name }}</h2>
                        服务器名称：
                        <n-input
                            v-model:value="info.name"
                            type="text"
                            placeholder="服务器名称"
                        />
                        服务器地址：
                        <n-input
                            v-model:value="info.ip"
                            type="text"
                            placeholder="服务器地址"
                            :status="ServerOnline"
                        />
                        {{ ServerOnline }}
                        <MdEditor
                            v-model="info.text"
                            style="width: 100%"
                            editor-id="ServerInfo"
                            :inputBoxWidth="inputBoxWidth"
                            noMermaid
                        />
                    </div>
                    <div v-else>
                        <p v-if="info.code == 404">
                            服务器不存在QAQ (Code: {{ info.code }})
                        </p>
                        <p v-else="info.code == 422">
                            请求参数出错QAQ (Code: {{ info.code }})
                        </p>
                        <h2>
                            什么？这不是
                            {{ info.code }} ，这是服务器回老家过年了
                        </h2>
                        <img :src="Img404" />
                    </div>
                </ClientOnly>
            </main>
        </div>
    </div>
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
