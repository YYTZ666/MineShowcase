<script setup lang="ts">
import {
    reactive,
    onMounted,
    ref,
    watch,
    shallowReactive,
    defineAsyncComponent,
} from 'vue'
import { createDiscreteApi } from 'naive-ui'
import { useRequest } from 'alova/client'
import { ServerAPI_Token, fetch_status } from '../../hooks/api'
import type { Fetch_Status, StatusWithUser } from '../../hooks/type_models'
import Img404 from '../../assets/error.webp'
import { useDebounceFn } from '@vueuse/core'

// 异步加载重型组件
const MdEditor = defineAsyncComponent(() =>
    import('md-editor-v3').then((mod) => {
        import('md-editor-v3/lib/style.css')
        return mod.MdEditor
    }),
)

// 按需加载图标
const CloudOffline = defineAsyncComponent(() =>
    import('@vicons/ionicons5').then((mod) => mod.CloudOffline),
)
const CloudDownloadOutline = defineAsyncComponent(() =>
    import('@vicons/ionicons5').then((mod) => mod.CloudDownloadOutline),
)
const CloudDone = defineAsyncComponent(() =>
    import('@vicons/ionicons5').then((mod) => mod.CloudDone),
)

// 路由和通知
const route = useRoute()
const ServerID = route.params.id
const hasDraft = ref(false)
const hasPermission = ref(false)

// 使用浅层响应式对象
const serverInfo = shallowReactive({
    name: '',
    ip: '',
    desc: '加载中...',
    tags: [] as string[],
    version: '',
    link: '',
    loading: true,
    error: undefined as string | undefined,
    code: 200,
})

const { notification, message } = createDiscreteApi(['notification', 'message'])

// 服务器状态检测
const serverStatus = reactive({
    type: 'warning' as 'success' | 'error' | 'warning',
    icon: markRaw(CloudDownloadOutline),
    text: '检测中...',
    loading: false,
})

// 请求缓存配置
const commonRequestConfig = {
    immediate: false,
    initialData: {},
    retry: 3,
    cache: {
        enable: true,
        maxAge: 60 * 1000, // 缓存1分钟
    },
}

const { send: PutServerInfo } = useRequest(
    (payload: typeof serverInfo) =>
        ServerAPI_Token.Put<StatusWithUser>(`/v1/servers/${ServerID}`, payload),
    commonRequestConfig,
)

const {
    send: refreshServerInfo,
    onSuccess,
    onError,
} = useRequest(
    () => ServerAPI_Token.Get<StatusWithUser>(`/v1/servers/${ServerID}/editor`),
    commonRequestConfig,
)

const { send: statusResponse } = useRequest(
    (ip: string) => fetch_status.Get<Fetch_Status>(`?ip=${ip}`),
    { immediate: false },
)

// 优化后的草稿管理
const loadDraft = async () => {
    const key = `draft-${ServerID}`
    const draft = localStorage.getItem(key)
    if (!draft) return

    try {
        const parsed = JSON.parse(draft)
        const response = await refreshServerInfo()

        if (response.code === 200) {
            Object.assign(serverInfo, parsed)
            hasDraft.value = true
            hasPermission.value = true
        } else {
            localStorage.removeItem(key)
        }
    } catch (e) {
        localStorage.removeItem(key)
        console.error('加载草稿失败:', e)
    }
}

const clearDraft = async () => {
    const response = await refreshServerInfo()
    try {
        if (response.code === 200) {
            localStorage.removeItem(`draft-${ServerID}`)
            hasDraft.value = false
            Object.assign(serverInfo, response)
            message.success('草稿已清除，恢复最新数据')
        } else {
            message.error('清除草稿失败：权限验证未通过')
        }
    } catch (error) {
        message.error('清除草稿失败')
    }
}

const saveServerInfo = async () => {
    serverInfo.loading = true
    try {
        const response = await PutServerInfo(serverInfo)
        if (response.code === 200) {
            await clearDraft()
            notification.success({
                title: '保存成功',
                content: '服务器信息已保存',
            })
        } else {
            message.error('保存失败：' + response.detail)
        }
    } catch (error) {
        message.error('保存失败：' + error)
    } finally {
        serverInfo.loading = false
    }
}

// 合并watch监听
const autoSave = useDebounceFn(() => {
    localStorage.setItem(`draft-${ServerID}`, JSON.stringify(serverInfo))
    message.success('草稿已自动保存', { duration: 1000 })
    hasDraft.value = true
}, 2000)

// 状态检测优化
const checkServerStatus = useDebounceFn(async (ip: string) => {
    if (!ip) return

    serverStatus.loading = true
    try {
        const data = await statusResponse(ip)
        serverStatus.type = data.online ? 'success' : 'error'
        serverStatus.icon = markRaw(data.online ? CloudDone : CloudOffline)
        serverStatus.text = data.online
            ? `在线 - ${data.players.online}/${data.players.max} 玩家`
            : '离线'
    } catch {
        serverStatus.type = 'error'
        serverStatus.text = '检测失败'
    } finally {
        serverStatus.loading = false
    }
}, 1000)

onMounted(async () => {
    await Promise.all([loadDraft(), refreshServerInfo()])

    if (!hasDraft.value) {
        checkServerStatus(serverInfo.ip)
    }

    if (hasPermission.value) {
        watch(() => serverInfo.ip, useDebounceFn(checkServerStatus, 1000))

        watch(() => ({ ...serverInfo }), autoSave, { deep: true })
    }
})
</script>

<template>
    <div class="edit" v-once>
        <n-spin :show="serverInfo.loading">
            <div class="content-container">
                <div v-if="serverInfo.error" class="error-container">
                    <n-result status="404" :description="serverInfo.error">
                        <template #footer>
                            <n-button
                                @click="$router.back()"
                                v-if="serverInfo.code == 401"
                            >
                                返回
                            </n-button>
                            <n-button @click="refreshServerInfo" v-else>
                                重试
                            </n-button>
                        </template>
                        <template #icon>
                            <img
                                :src="Img404"
                                style="width: 50%; height: 50%"
                                loading="lazy"
                            />
                        </template>
                    </n-result>
                </div>

                <div v-else>
                    <h1 class="page-title">服务器信息</h1>
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
                        <label>网站链接（可留空）</label>
                        <n-input
                            v-model:value="serverInfo.link"
                            placeholder="可留空"
                            :maxlength="25"
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
                        <label>服务器版本</label>
                        <n-input
                            v-model:value="serverInfo.version"
                            placeholder="输入服务器版本（如 1.20.1）"
                            :maxlength="32"
                            clearable
                        />
                    </div>
                    <div class="form-item">
                        <label>服务器描述</label>
                        <MdEditor
                            v-model="serverInfo.desc"
                            editor-id="serverDesc"
                            :preview="true"
                            @on-save="autoSave"
                            noKatex
                            noMermaid
                            noUploadImg
                            class="md-editor"
                        />
                    </div>
                    <div class="form-item">
                        <label>标签</label>
                        <n-dynamic-tags v-model:value="serverInfo.tags" />
                    </div>
                    <div class="form-item" style="text-align: right">
                        <n-button
                            type="primary"
                            @click="saveServerInfo"
                            :loading="serverInfo.loading"
                        >
                            保存
                        </n-button>
                        <n-button
                            @click="clearDraft"
                            style="margin-left: 10px"
                            :disabled="!hasDraft"
                        >
                            清除草稿
                        </n-button>
                    </div>
                </div>
            </div>
        </n-spin>
    </div>
</template>

<style scoped lang="less">
.edit {
    padding: 20px;

    .content-container {
        margin: 0 auto;
        background: white;
        border-radius: 12px;
        img {
            max-width: 500px;
        }
    }

    .page-title {
        margin-bottom: 24px;
        font-size: 1.5rem;
        color: #1f2937;
    }

    .status-indicator {
        margin-bottom: 24px;

        .n-tag {
            font-size: 0.95rem;
            padding: 8px 16px;
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
</style>
