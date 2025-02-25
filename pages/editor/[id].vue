<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { NNotificationProvider, useNotification } from 'naive-ui'
import {
    MenuOutline as MenuIcon,
    CloudOffline,
    CloudDownloadOutline,
    CloudDone,
} from '@vicons/ionicons5'
import NavBar from '../../components/NavBar.vue'
import Header from '../../components/Header.vue'
import { useRequest } from 'alova/client'
import { ServerAPI, fetch_status } from '../../hooks/api'
import type { Fetch_Status, StatusWithUser } from '../../hooks/type_models'
import Img404 from '../../assets/error.webp'
import { useDebounceFn } from '@vueuse/core'

// 路由和通知
const route = useRoute()
const notification = useNotification()
const ServerID = route.params.id

// 服务器信息状态
const serverInfo = reactive({
    name: '',
    ip: '',
    desc: '加载中...',
    loading: true,
    error: null as Error | null,
})

// 服务器状态检测
const serverStatus = reactive({
    type: 'warning' as 'success' | 'error' | 'warning',
    icon: CloudDownloadOutline,
    text: '检测中...',
    loading: false,
})

// 获取服务器信息
const {
    send: refreshServerInfo, // Alova 使用 send 方法重新请求
    onSuccess,
} = useRequest(
    () => ServerAPI.Get<StatusWithUser>(`/v1/servers/info/${ServerID}`),
    {
        immediate: false, // 禁用自动请求
        initialData: {},
        retry: 3,
    },
)
onSuccess(({ data }) => {
    Object.assign(serverInfo, {
        name: data.name,
        ip: data.ip,
        desc: data.desc,
        loading: false,
    })
    checkServerStatus(data.ip)
})

const { send: statusResponse } = useRequest(
    (ip) => fetch_status.Get<Fetch_Status>(`?ip=${ip}`),
    { immediate: false },
)

const checkServerStatus = useDebounceFn(async (ip: string) => {
    if (!ip) return

    serverStatus.loading = true
    try {
        serverStatus.type = 'warning'
        serverStatus.icon = CloudDownloadOutline
        serverStatus.text = '检测中...'
        updateServerStatus(await statusResponse(serverInfo.ip))
    } catch (err) {
        serverStatus.type = 'error'
        serverStatus.text = '检测失败'
    } finally {
        serverStatus.loading = false
    }
}, 1000)

const updateServerStatus = (data: Fetch_Status) => {
    if (data.online) {
        serverStatus.type = 'success'
        serverStatus.icon = CloudDone
        serverStatus.text = `在线 - ${data.players.online}/${data.players.max} 玩家`
    } else {
        serverStatus.type = 'error'
        serverStatus.icon = CloudOffline
        serverStatus.text = '离线'
    }
}

const autoSave = useDebounceFn(async () => {
    try {
        notification.success({ content: '修改已自动保存', duration: 1000 })
    } catch (err) {
        notification.error({ content: '保存失败', duration: 1000 })
    }
}, 3000)

watch([() => serverInfo.name, () => serverInfo.desc], autoSave)

watch(
    () => serverInfo.ip,
    useDebounceFn((newIp) => {
        checkServerStatus(newIp)
    }, 1000),
)

onMounted(() => {
    refreshServerInfo()
})
</script>

<template>
    <div class="layout">
        <header class="header">
            <n-notification-provider>
                <Header title="服务器管理" />
            </n-notification-provider>
        </header>
        <main class="main-content">
            <aside class="sidebar">
                <NavBar />
            </aside>
            <n-spin :show="serverInfo.loading">
                <div class="content-container">
                    <div v-if="serverInfo.error" class="error-container">
                        <n-result
                            status="500"
                            title="加载失败"
                            :description="serverInfo.error.message"
                        >
                            <template #footer>
                                <n-button @click="refreshServerInfo">
                                    重试
                                </n-button>
                            </template>
                        </n-result>
                    </div>

                    <div v-else class="form-section">
                        <h1 class="page-title">服务器配置</h1>

                        <div class="status-indicator">
                            <n-tag :type="serverStatus.type" :bordered="false">
                                <template #icon>
                                    <n-icon :component="serverStatus.icon" />
                                </template>
                                {{ serverStatus.text }}
                            </n-tag>
                        </div>

                        <div class="form-item">
                            <label>服务器名称</label>
                            <n-input
                                v-model:value="serverInfo.name"
                                placeholder="输入服务器名称"
                                :maxlength="32"
                                clearable
                            />
                        </div>

                        <div class="form-item">
                            <label>服务器地址</label>
                            <n-input
                                v-model:value="serverInfo.ip"
                                placeholder="输入IP地址和端口"
                                :status="serverStatus.type"
                                clearable
                            />
                        </div>

                        <div class="form-item">
                            <label>服务器描述</label>
                            <MdEditor
                                v-model="serverInfo.desc"
                                editor-id="serverDesc"
                                :preview="true"
                                noKatex
                                noMermaid
                                class="md-editor"
                            />
                        </div>
                    </div>
                </div>
            </n-spin>
        </main>
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
    min-height: 100vh;
    background-color: @primary-color;

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
        padding: 24px;
        padding-top: calc(@header-height + 24px);
        transition: margin 0.3s ease;

        @media screen and (max-width: 1200px) {
            margin-left: 0;
        }

        .content-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .page-title {
            margin-bottom: 24px;
            font-size: 1.5rem;
            color: #1f2937;
        }

        .status-indicator {
            margin-bottom: 24px;
            text-align: center;

            .n-tag {
                font-size: 0.95rem;
                padding: 8px 16px;
                border-radius: 20px;
            }
        }

        .form-item {
            margin-bottom: 24px;

            label {
                display: block;
                margin-bottom: 8px;
                font-weight: 500;
                color: #374151;
            }

            .md-editor {
                border-radius: 8px;
                border: 1px solid #e5e7eb;
                overflow: hidden;

                &:hover {
                    border-color: #d1d5db;
                }
            }
        }
    }
}
</style>
