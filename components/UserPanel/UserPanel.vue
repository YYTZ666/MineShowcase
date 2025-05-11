<script setup lang="ts">
import { useRequest } from 'alova/client'
import type { UserMe } from '@/api/models'
import ServerCard from './ServerCard.vue'
import IMG_noicon from '@/assets/noicon.svg'
import Img404 from '@/assets/error.webp'

const router = useRouter()
const showAdvanced = ref(false)
const toggleAdvanced = () => (showAdvanced.value = !showAdvanced.value)
const token_status = ref(false)
const { $serverAPI_Token } = useNuxtApp()
const isUnauthorized = ref(false)
const title = useState<string>('pageTitle')
const { error, data, send, loading } = useRequest(
    $serverAPI_Token.Get<UserMe>('/v1/me'),
    {
        immediate: true,
    },
).onSuccess(() => {
    if (data.value.code === 401) {
        isUnauthorized.value = true
    }
    if (data.value.code === 200) {
        token_status.value = true
        title.value = `个人信息 - ${data.value.display_name}`
        document.title = title.value
    }
    if (data.value.code === 404) {
        isUnauthorized.value = true
    }
})

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

const goBack = () => router.go(-1)
const gotoLogin = () => router.push('/auth')
</script>

<template>
    <div class="user-panel">
        <a-spin :spinning="loading">
            <a-result
                v-if="isUnauthorized"
                title="未登录"
                subTitle="需要登录才能查看个人信息"
            >
                <template #icon>
                    <img :src="Img404" style="width: 100%; max-width: 10rem" />
                </template>
                <template #extra>
                    <a-space justify="center">
                        <a-button type="primary" @click="gotoLogin">
                            立即登录
                        </a-button>
                        <a-button @click="goBack">返回上一页</a-button>
                    </a-space>
                </template>
            </a-result>
            <a-result
                v-else-if="error"
                title="加载失败"
                subTitle="无法获取用户信息，请检查网络连接"
            >
                <template #icon>
                    <img :src="Img404" style="width: 100%; max-width: 10rem" />
                </template>
                <template #extra>
                    <a-space justify="center">
                        <a-button type="primary" @click="send">重试</a-button>
                        <a-button @click="goBack">返回上一页</a-button>
                    </a-space>
                </template>
            </a-result>

            <a-card v-else-if="token_status" hoverable>
                <div class="profile-header">
                    <a-avatar
                        round
                        :size="160"
                        :src="data.avatar_url || IMG_noicon"
                        class="main-avatar"
                    />
                    <div class="header-info">
                        <h1 class="display-name">
                            {{ data.display_name || data.username }}
                        </h1>
                        <a-space align="center">
                            <!-- 计划个性签名，或者创新的给自己贴标签 -->
                        </a-space>
                    </div>
                </div>

                <a-divider />

                <div class="info-grid">
                    <div class="info-item">
                        <label>用户ID</label>
                        {{ data.id }}
                    </div>

                    <div class="info-item">
                        <label>注册邮箱</label>
                        {{ data.email }}
                    </div>

                    <div class="info-item">
                        <label>创建时间</label>
                        {{ formatDate(data.created_at) }}
                    </div>

                    <div class="info-item">
                        <label>最后登录</label>
                        {{ formatDate(data.last_login) }}
                    </div>
                </div>

                <div class="advanced-info" v-if="showAdvanced">
                    <a-divider dashed>高级信息</a-divider>
                    <div class="info-grid">
                        <div class="info-item">
                            <label>登录账号</label>
                            {{ data.username }}
                        </div>
                        <div class="info-item">
                            <label>账户类型</label>
                            {{
                                data.role === 'admin'
                                    ? '管理员账户'
                                    : '普通账户'
                            }}
                        </div>
                    </div>
                </div>
                <a-divider v-else />

                <div class="action-bar">
                    <a-button type="primary" dashed @click="toggleAdvanced">
                        {{ showAdvanced ? '收起详情' : '展开详情' }}
                    </a-button>
                    <!-- <a-button
                        tag="a"
                        href="/settings"
                        type="primary"
                        class="edit-btn"
                    >
                        编辑资料
                    </a-button> -->
                </div>
            </a-card>

            <div class="server-list" v-if="token_status">
                <h2 style="margin: 24px 0 16px">我的服务器</h2>
                <a-empty
                    v-if="data?.servers?.length === 0"
                    description="您还没有任何服务器"
                    style="margin: 32px 0"
                ></a-empty>
                <!-- <template #extra>
                <a-button size="small" @click="router.push('/create')">
                    创建新服务器
                </a-button>
            </template> -->

                <a-row :gutter="[16, 16]">
                    <a-col
                        v-for="[role, serverId] in data?.servers || []"
                        :key="serverId"
                        :xs="24"
                        :sm="12"
                        :md="8"
                    >
                        <ServerCard
                            :server-id="Number(serverId)"
                            :role="role"
                        />
                    </a-col>
                </a-row>
            </div>
        </a-spin>
    </div>
</template>

<style scoped lang="less">
@import '@/assets/css/variables.less';

.user-panel {
    padding: 20px;
    display: flex;
    flex-direction: column;
    .profile-header {
        display: flex;
        align-items: center;
        gap: 40px;
        padding: 20px 0;

        .main-avatar {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .header-info {
            flex: 1;

            .display-name {
                margin: 0 0 12px;
                font-size: 2.2rem;
                color: @text-color-light;
                @media (prefers-color-scheme: dark) {
                    color: @text-color-dark;
                }
            }
        }
    }

    .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 24px;
        padding: 16px 0;
    }

    .info-item {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 16px;
        background: @border-color-secondary;
        @media (prefers-color-scheme: dark) {
            background: @border-color-secondary-dark;
        }
        border-radius: 8px;
        transition: all 0.3s;

        &:hover {
            background: @hover-primary;
            transform: translateY(-2px);
        }

        label {
            font-size: 0.9rem;
        }
    }

    .action-bar {
        display: flex;
        justify-content: flex-end;
        gap: 16px;
        margin-top: 32px;
        padding-top: 24px;

        .edit-btn {
            min-width: 120px;
        }
    }
    @media screen and (max-width: 768px) {
        .profile-header {
            flex-direction: column;
            text-align: center;
            gap: 20px;

            .header-info .display-name {
                font-size: 1.8rem;
            }
        }

        .info-grid {
            grid-template-columns: 1fr;
        }

        .action-bar {
            flex-direction: column;
        }
    }
}
.server-list {
    color: @text-color-light;
    @media (prefers-color-scheme: dark) {
        color: @text-color-dark;
    }
    margin-top: 24px;

    .a-grid {
        margin-bottom: 24px;
    }

    .a-card {
        height: 100%;
        display: flex;
        flex-direction: column;

        &-footer {
            margin-top: auto;
        }
    }
}
.error-message {
    text-align: center;
    padding: 40px 20px;

    .a-space {
        justify-content: center;
        gap: 16px;
    }
}
</style>
