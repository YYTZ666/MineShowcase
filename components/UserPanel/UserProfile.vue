<script setup lang="ts">
import { useRequest } from 'alova/client'
import { ServerAPI_Token } from '@/api'
import type { User } from '@/api/models'
import ServerCard from './ServerCard.vue'
import IMG_noicon from '@/assets/noicon.svg'
import Img404 from '@/assets/error.webp'

const router = useRouter()
const route = useRoute()
const title = useState<string>('pageTitle')
const user_status = ref(false)

const UUID = route.params.UUID

const { error, data, send, loading } = useRequest(
    ServerAPI_Token.Get<User>(`/v1/user/${UUID}/public`),
    {
        immediate: true,
    },
).onSuccess(() => {
    if (data.value.code === 200) {
        user_status.value = true
        title.value = `个人信息 - ${data.value.display_name}`
        document.title = title.value
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
</script>

<template>
    <div class="user-panel">
        <a-spin :spinning="loading">
            <a-result
                v-if="error"
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

            <a-card v-if="user_status" hoverable>
                <div class="profile-header">
                    <a-avatar
                        round
                        :size="160"
                        :src="data.avatar_url || IMG_noicon"
                        class="main-avatar"
                    />
                    <div class="header-info">
                        <h1 class="display-name">
                            {{ data.display_name }}
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
                        <label>创建时间</label>
                        {{ formatDate(data.created_at) }}
                    </div>

                    <div class="info-item">
                        <label>最后登录</label>
                        {{ formatDate(data.last_login) }}
                    </div>
                </div>
            </a-card>

            <div class="server-list">
                <h2 style="margin: 24px 0 16px">服务器</h2>
                <a-empty
                    v-if="data?.servers?.length === 0"
                    description="Ta 还没有任何服务器"
                    style="margin: 32px 0"
                ></a-empty>

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
        border-top: 1px solid #e5e7eb;

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
