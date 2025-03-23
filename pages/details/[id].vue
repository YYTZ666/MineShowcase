<script setup lang="ts">
import { ServerAPI_Token } from '@/api'
import { MdPreview } from 'md-editor-v3'
import { useRequest } from 'alova/client'
import type { ServerManagers, Status } from '@/api/models'
import IMG_noicon from '@/assets/noicon.svg'
import Img404 from '@/assets/error.webp'
import Share from '@/components/Share/Share.vue'
import Comment from '@/components/Comment/Comment.vue'

useNavBar({
    enable: true,
    component: ['Recommend', 'Stats'],
})

const { data: managers } = useRequest(
    () =>
        ServerAPI_Token.Get<ServerManagers>(`/v1/servers/${serverId}/managers`),
    { immediate: true },
)
const route = useRoute()
const serverId = route.params.id
const {
    data: server,
    loading,
    onSuccess,
} = useRequest(
    () =>
        ServerAPI_Token.Get<Status>(`/v1/servers/info/${serverId}`, {
            cacheFor: null,
        }),
    {
        immediate: true,
    },
)
const title = useState<string>('pageTitle')
onSuccess(() => {
    if (server.value?.code === 200) {
        title.value = server.value.name + ' - 服务器详情'
        useHead({
            title: title,
        })
    }
})

type ResultStatus = {
    type:
        | 'error'
        | '404'
        | '403'
        | '500'
        | 'success'
        | 'warning'
        | 'info'
        | '418'
    title: string
    description: string
}
const resultStatus = computed<ResultStatus>(() => {
    if (server.value?.code === 200)
        return { type: '404', title: '', description: '' }
    switch (server.value?.code) {
        case 404:
            return {
                type: '404',
                title: '服务器未找到',
                description: '请检查服务器ID是否正确',
            }
        case 403:
            return {
                type: '403',
                title: '无访问权限',
                description: '该服务器设置了访问限制',
            }
        case 500:
            return {
                type: '500',
                title: '服务器错误',
                description: '服务端发生未知错误',
            }
        default:
            return {
                type: 'error',
                title: '发生错误',
                description: server.value?.detail || '未知错误',
            }
    }
})
watch(resultStatus, (newStatus) => {
    if (newStatus.title) {
        title.value = newStatus.title
        useHead({
            title: title,
        })
    }
})

// 状态颜色
const statusColor = computed(() => {
    if (!server.value?.status) return 'error'
    return server.value.status.delay < 100 ? 'success' : 'warning'
})

// 格式化延迟显示
const formatDelay = (delay?: number) => {
    if (!delay) return 'N/A'
    if (delay < 1) return '<1ms'
    return `${delay.toFixed(2)}ms`
}

const tabs = ref('detail')
</script>
<template>
    <div class="detail">
        <a-spin tip="加载中..." :spinning="loading">
            <div v-if="server" class="server-detail">
                <template v-if="server.code === 200">
                    <!-- 头部信息 -->
                    <div class="server-header">
                        <a-avatar
                            class="glow-avatar"
                            round
                            :size="120"
                            :src="server.status?.icon ?? IMG_noicon"
                        />
                        <div class="header-info">
                            <div class="header-left">
                                <h1 class="server-name">
                                    {{ server.name }}
                                </h1>
                                <a-space align="center">
                                    <a-tag
                                        :bordered="false"
                                        :color="statusColor"
                                    >
                                        {{ server.status ? '在线' : '离线' }}
                                    </a-tag>
                                    <span class="server-ip">
                                        {{ server.ip || 'IP 未公开' }}
                                    </span>
                                </a-space>
                            </div>
                            <NuxtLink
                                v-if="server.permission !== 'guest'"
                                :to="`/edit/${serverId}`"
                            >
                                <a-button type="primary">编辑服务器</a-button>
                            </NuxtLink>
                        </div>
                    </div>

                    <!-- 关键指标 -->
                    <a-row :gutter="[24, 24]">
                        <a-col :xs="24" :sm="12" :md="8" :lg="6">
                            <a-statistic
                                title="在线玩家"
                                :value="`${server.status?.players.online ?? '-'}/${server.status?.players.max ?? '-'}`"
                            />
                        </a-col>
                        <a-col :xs="24" :sm="12" :md="8" :lg="6">
                            <a-statistic
                                title="延迟"
                                :value="formatDelay(server.status?.delay)"
                            />
                        </a-col>
                        <a-col :xs="24" :sm="12" :md="8" :lg="6">
                            <a-statistic title="版本" :value="server.version" />
                        </a-col>
                        <a-col :xs="24" :sm="12" :md="8" :lg="6">
                            <a-statistic
                                title="认证模式"
                                :value="server.auth_mode"
                            />
                        </a-col>
                    </a-row>
                    <!-- 标签 -->
                    <div class="tag-section">
                        <a-tag
                            v-for="tag in server.tags"
                            :key="tag"
                            bordered
                            round
                        >
                            {{ tag }}
                        </a-tag>
                    </div>
                    <a-divider />
                    <div class="tabs">
                        <!-- Tab分页 -->
                        <div
                            class="tab"
                            :class="{ active: tabs === 'detail' }"
                            @click="tabs = 'detail'"
                        >
                            详情
                        </div>
                        <div
                            class="tab"
                            :class="{ active: tabs === 'comment' }"
                            @click="tabs = 'comment'"
                        >
                            评论
                        </div>
                        <div
                            class="tab"
                            :class="{ active: tabs === 'resource' }"
                            @click="tabs = 'resource'"
                        >
                            资源
                        </div>
                    </div>

                    <Transition name="slide-in">
                        <div class="desc" v-if="tabs === 'detail'">
                            <!-- 描述和MOTD -->
                            <a-card title="服务器描述" class="description-card">
                                <MdPreview
                                    class="markdown-content"
                                    editor-id="preview-only"
                                    :modelValue="server.desc"
                                    noImgZoomIn
                                />
                                <div
                                    v-if="server.status?.motd"
                                    class="motd-section"
                                >
                                    <h3>MOTD</h3>
                                    <pre
                                        class="motd-text"
                                        v-html="server.status.motd.html"
                                    ></pre>
                                </div>
                            </a-card>
                            <a-card class="info-card">
                                <!-- 所有者部分 -->
                                <div v-if="managers?.owners?.length">
                                    <h3 class="section-title">所有者</h3>
                                    <a-space>
                                        <NuxtLink
                                            v-for="owner in managers.owners"
                                            :key="owner.id"
                                            :to="`/user/${owner.id}`"
                                            class="user-item"
                                        >
                                            <a-avatar
                                                :src="
                                                    owner.avatar_url ||
                                                    IMG_noicon
                                                "
                                                round
                                                size="small"
                                            />
                                            <span>
                                                {{ owner.display_name }}
                                            </span>
                                        </NuxtLink>
                                    </a-space>
                                </div>

                                <!-- 管理员部分 -->
                                <div v-if="managers?.admins?.length">
                                    <h3 class="section-title">管理员</h3>
                                    <a-space>
                                        <NuxtLink
                                            v-for="admin in managers.admins"
                                            :key="admin.id"
                                            :to="`/user/${admin.id}`"
                                            class="user-item"
                                        >
                                            <a-avatar
                                                :src="
                                                    admin.avatar_url ||
                                                    IMG_noicon
                                                "
                                                round
                                                size="small"
                                            />
                                            <span>
                                                {{ admin.display_name }}
                                            </span>
                                        </NuxtLink>
                                    </a-space>
                                </div>

                                <!-- 相关链接部分 -->
                                <template v-if="server.link">
                                    <h3 class="section-title">相关链接</h3>
                                    <a
                                        :href="server.link"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="link-url"
                                    >
                                        {{ server.link }}
                                    </a>
                                </template>
                            </a-card>
                        </div>
                    </Transition>
                    <Transition name="slide-in">
                        <div v-if="tabs === 'comment'">
                            <a-card class="description-card" title="评论">
                                <Comment />
                            </a-card>
                        </div>
                    </Transition>
                    <Transition name="slide-in">
                        <div v-if="tabs === 'resource'">
                            <a-card
                                class="description-card"
                                title="相关资源"
                            ></a-card>
                        </div>
                    </Transition>
                    <a-card title="分享" class="info-card">
                        <Share :desc="server.desc" />
                    </a-card>
                </template>
                <a-result
                    v-else
                    class="status-result"
                    :title="resultStatus.title"
                    :subTitle="resultStatus.description"
                >
                    <template #icon>
                        <img
                            :src="Img404"
                            style="width: 100%; max-width: 10rem"
                        />
                    </template>
                    <template #extra>
                        <NuxtLink :to="`/`">
                            <a-button type="primary">返回首页</a-button>
                        </NuxtLink>
                    </template>
                </a-result>
            </div>
        </a-spin>
    </div>
</template>

<style scoped lang="less">
@import '@/assets/css/variables.less';

.slide-in-enter-active {
    animation: slideIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

@keyframes slideIn {
    from {
        transform: translateY(20px) rotateX(-30deg);
        opacity: 0;
        filter: blur(2px);
    }
    to {
        transform: translateY(0) rotateX(0);
        opacity: 1;
        filter: blur(0);
    }
}
.detail {
    padding: 20px;
    display: flex;
    flex-direction: column;
    .status-result {
        margin-top: 20vh;
        max-width: 500px;
        margin-left: auto;
        margin-right: auto;
    }

    .server-detail {
        max-width: 1200px;
        margin: 0 auto;
        padding: 24px;

        .server-header {
            display: flex;
            align-items: center;
            gap: 32px;
            margin-bottom: 40px;

            .glow-avatar {
                background: #fff;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 0 0 0 #1a76ff81;
                border: 2px solid rgba(0, 0, 0, 0.315);

                &:hover {
                    transform: scale(1.05);
                    box-shadow: 0 0 20px 8px #1a76ff81;

                    &::after {
                        opacity: 0.15;
                    }
                }

                // 暗色模式适配
                @media (prefers-color-scheme: dark) {
                    border: 2px solid rgba(255, 255, 255, 0.185);

                    &:hover {
                        box-shadow: 0 0 25px 10px #1a76ff81;

                        &::after {
                            opacity: 0.2;
                        }
                    }
                }
            }
            .glow-avatar:active {
                transform: scale(0.98);
                box-shadow: 0 0 15px 3px #1a76ff6b;
            }
            .header-info {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                flex: 1;
                gap: 20px;

                .header-left {
                    flex: 1;

                    .server-name {
                        margin: 0 0 12px;
                        font-size: 2.4rem;
                        color: @text-color-light;
                        @media (prefers-color-scheme: dark) {
                            color: @text-color-dark;
                        }
                    }

                    .server-ip {
                        color: @text-color-secondary;
                        @media (prefers-color-scheme: dark) {
                            color: @text-color-secondary-dark;
                        }
                        font-family: monospace;
                    }
                }

                .a-button {
                    flex-shrink: 0;
                }
            }
        }

        .tag-section {
            margin: 24px 0;
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
        }

        .tabs {
            display: flex;
            gap: 0.5rem;
            .tab {
                flex-grow: 1;
                height: 2rem;
                border-radius: 1rem;
                border: 1px solid @border-color;
                text-align: center;
                line-height: 2rem;
                cursor: pointer;
                transition: background 0.5s;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                @media (prefers-color-scheme: dark) {
                    border: 0px;
                    color: @text-color-secondary-dark;
                    background-color: @background-dark;
                }
                &.active {
                    border: 0px;
                    background-color: @active-primary;
                    color: white;
                }
            }
        }

        .description-card {
            margin-top: 24px;
            color: @text-color-light;
            @media (prefers-color-scheme: dark) {
                --n-title-text-color: @text-color-dark;
                color: @text-color-dark;
            }

            .markdown-content {
                font-family: monospace;
                padding: 12px;
                border-radius: 6px;
                background-color: @border-color-secondary;
                color: @text-color-light;
                :deep(img) {
                    max-width: 100%;
                    height: auto;
                    border-radius: 6px;
                }

                @media (prefers-color-scheme: dark) {
                    background-color: @border-color-secondary-dark;
                    color: @text-color-dark;
                    --md-color: @text-color-secondary-dark;
                }
            }
            .motd-section {
                margin-top: 24px;
                padding-top: 24px;
                border-top: 1px solid @border-color-dark;

                h3 {
                    margin: 0 0 12px;
                }

                .motd-text {
                    font-family: monospace;
                    color: @primary-light;
                    background-color: #567bb359;

                    @media (prefers-color-scheme: dark) {
                        background-color: @border-color-secondary-dark;
                    }
                    padding: 12px;
                    border-radius: 6px;
                    white-space: pre-wrap;
                }
            }
        }
        .info-card {
            margin-top: 16px;

            .section-title {
                font-size: 1.1em;
                color: @text-color-light;
                @media (prefers-color-scheme: dark) {
                    color: @text-color-dark;
                }
            }

            .user-item {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 4px 8px;
                background-color: @border-color-secondary;
                @media (prefers-color-scheme: dark) {
                    background-color: @border-color-secondary-dark;
                }
                border-radius: 4px;

                span {
                    font-size: 0.9em;
                    color: @text-color-light;
                    @media (prefers-color-scheme: dark) {
                        color: @text-color-dark;
                    }
                }
            }

            .link-url {
                word-break: break-all;

                color: @accent;
                text-decoration: none;
                display: inline-block;
                padding: 4px 0;

                &:hover {
                    text-decoration: underline;
                }
            }
        }
    }
    @media (max-width: 768px) {
        .server-detail {
            padding: 16px;

            .server-header {
                flex-direction: column;
                text-align: center;

                .header-info {
                    align-items: center;
                    flex-direction: column;

                    .header-left {
                        text-align: center;
                    }

                    .a-button {
                        width: 100%;
                        margin-top: 12px;
                    }
                }

                .server-name {
                    font-size: 1.8rem;
                }
            }
        }
    }
}
</style>
