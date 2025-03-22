<script setup lang="ts">
import { watchEffect } from 'vue'
import { ServerAPI_Token } from '@/api'
import type { Status } from '@/api/models'
import { useRequest } from 'alova/client'
import { useRouter } from 'vue-router'
import { MdPreview } from 'md-editor-v3'

const router = useRouter()
const props = defineProps<{
    serverId: number
}>()

// 使用 useRequest 获取服务器详情
const { data, loading, error, send } = useRequest(
    () =>
        ServerAPI_Token.Get<Status>(`/v1/servers/info/${props.serverId}`, {
            cacheFor: null,
        }),
    {
        immediate: false,
        initialData: {
            code: 0,
            name: '加载中...',
            desc: '',
            type: 'JAVA',
            ip: null,
            status: null, // 初始状态为 null
        } as unknown as Status,
    },
)

// 监听 serverId 变化，自动发起请求
watchEffect(() => {
    if (props.serverId) {
        send()
    }
})

onMounted(() => {
    send()
})

// 简介字数限制
const truncateText = (text: string, maxLength = 50) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}
const descContent = computed(() => {
    const sanitizedDesc = (data.value.desc || '暂无简介').replace(
        /\r?\n|\r/g,
        ' ',
    )
    return truncateText(sanitizedDesc)
})
// 点击管理按钮
const handleManage = () => {
    router.push(`/details/${props.serverId}`)
}

import {
    CheckmarkCircleOutline, // 在线图标
    AlertCircleOutline, // 离线图标
    CloseCircleOutline, // 错误图标
} from '@vicons/ionicons5'

const getOnlineStatusTag = computed(() => {
    if (error.value) {
        return {
            text: '连接错误',
            color: 'error' as 'success' | 'error' | 'warning',
            icon: CloseCircleOutline,
            statusClass: 'error-pulse',
        }
    }

    if (data.value?.status !== null) {
        return {
            text: `在线（${data.value?.status?.players.online || 0}人在线）`,
            color: 'success' as 'success' | 'error' | 'warning',
            icon: CheckmarkCircleOutline,
            statusClass: 'online-pulse',
        }
    }

    return {
        text: '离线',
        color: 'warning' as 'success' | 'error' | 'warning',
        icon: AlertCircleOutline,
        statusClass: 'offline',
    }
})
</script>

<template>
    <a-card hoverable>
        <a-spin :spinning="loading">
            <div class="server-card">
                <!-- 服务器名称和IP -->
                <div class="server-name">
                    <span style="font-weight: bold">
                        {{ data?.name || `服务器 ${props.serverId}` }}
                    </span>
                    <a-tag v-if="data?.ip" size="small" :bordered="false">
                        {{ data.ip }}
                    </a-tag>
                </div>

                <div class="status-indicator">
                    <a-tag
                        :color="getOnlineStatusTag.color"
                        size="small"
                        :bordered="false"
                        class="status-tag"
                    >
                        <template #icon>
                            <component
                                style="
                                    height: 1em;
                                    width: 1em;
                                    line-height: 1em;
                                    text-align: center;
                                    display: inline-block;
                                    position: relative;
                                    fill: currentColor;
                                "
                                :is="getOnlineStatusTag.icon"
                            />
                        </template>
                        {{ getOnlineStatusTag.text }}
                    </a-tag>
                    <div
                        class="status-dot"
                        :class="getOnlineStatusTag.statusClass"
                    />
                </div>
                <!-- 服务器类型 -->
                <a-tag :bordered="false" class="status-tag">
                    {{ data?.type || '未知' }}
                </a-tag>
                <!-- 服务器简介 -->
                <MdPreview
                    class="server-desc"
                    editor-id="preview-only"
                    :modelValue="descContent"
                    :key="descContent"
                    noImgZoomIn
                />
                <!-- 操作按钮 -->
                <a-space justify="end">
                    <a-button
                        size="small"
                        :disabled="!data"
                        @click="handleManage"
                    >
                        查看
                    </a-button>
                </a-space>
            </div>
        </a-spin>
    </a-card>
</template>

<style scoped lang="less">
@import '@/assets/css/variables.less';

.server-card {
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-height: 120px;

    .server-name {
        font-size: 1.1rem;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .server-type {
        font-size: 0.9rem;
    }

    .status-indicator {
        position: relative;
        display: inline-flex;
        align-items: center;
        gap: 8px;

        .status-tag {
            border-radius: 6px;
            transition: all 0.3s ease;
            padding-right: 8px;
        }

        .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            position: relative;

            &::after {
                content: '';
                position: absolute;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                animation: pulse 1.5s infinite;
            }
        }
    }

    .online-pulse {
        background: #19be6b;

        &::after {
            background: rgba(25, 190, 107, 0.3);
        }
    }

    .offline {
        background: #ff9900;
    }

    .error-pulse {
        background: #ed4014;

        &::after {
            background: rgba(237, 64, 20, 0.3);
        }
    }

    .server-desc {
        flex: 1;
        line-height: 1.5;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        line-clamp: 2;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;

        --md-bk-color: none !important;
        color: @text-color-light;

        @media (prefers-color-scheme: dark) {
            color: @text-color-dark;
            --md-color: @text-color-secondary-dark;
        }
    }
}

.a-card-footer {
    padding-top: 12px;
    border-top: 1px solid var(--a-border-color);
}

@keyframes pulse {
    0% {
        transform: scale(1);
        opacity: 1;
    }
    100% {
        transform: scale(2.5);
        opacity: 0;
    }
}
</style>
