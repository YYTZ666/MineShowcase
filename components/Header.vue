<script setup lang="ts">
import lang from '../languages/index'
import Logo from '../assets/logo.webp'
import { ref, onMounted, computed, h } from 'vue'
import { ServerAPI_Token } from '../hooks/api'
import { useRequest } from 'alova/client'
import {
    createDiscreteApi,
    NBadge,
    NDropdown,
    NIcon,
    NInput,
    type NotificationType,
} from 'naive-ui'
import {
    Notifications,
    PersonCircleOutline,
    LogOutOutline,
    SearchOutline,
} from '@vicons/ionicons5'
import type { User } from '../hooks/type_models'
import { useRouter } from 'vue-router'
import { useDebounceFn } from '@vueuse/core'

const { data, onSuccess } = useRequest(ServerAPI_Token.Get<User>('/v1/me'))
const { notification: msgNotification, dialog: msgDialog } = createDiscreteApi([
    'dialog',
    'notification',
])

const avatar = ref(Logo)
const username = ref('')
const token_status = ref(false)
const unreadCount = ref(0)
const searchQuery = ref('')
const searchResults = ref<any[]>([])
const showDropdown = ref(false)
const searchLoading = ref(false)
const router = useRouter()

// 用户信息初始化
onMounted(() => {
    const token = localStorage.getItem('token')
    onSuccess(() => {
        if (token) {
            if (data.value.code == 200) {
                token_status.value = true
                avatar.value = data.value.avatar_url || Logo
                username.value = data.value.display_name
            }
            if (data.value.code == 401) {
                localStorage.removeItem('token')
                Notify({
                    type: 'warning',
                    content: '你的登录失效啦！',
                    duration: 2000,
                    meta: '你是不是需要重新去登录了？',
                })
            }
        }
    })
})

// 通知相关逻辑
const fetchNotifications = () => {
    unreadCount.value = 3
}

onMounted(() => {
    if (token_status.value) {
        fetchNotifications()
        setInterval(fetchNotifications, 60000)
    }
})
interface SearchResult {
    id: string
    name: string
    // 其他字段可以根据后端返回的数据结构添加
}
// 搜索功能
const performSearch = useDebounceFn(async () => {
    if (!searchQuery.value) {
        searchResults.value = []
        showDropdown.value = false
        return
    }

    try {
        searchLoading.value = true
        const response = await ServerAPI_Token.Get<{ results: SearchResult[] }>(
            '/v1/search',
            {
                params: {
                    query: searchQuery.value,
                    limit: 5,
                },
            },
        )
        searchResults.value = response.results
        showDropdown.value = true
    } catch (error) {
        console.error('搜索失败:', error)
        searchResults.value = []
    } finally {
        searchLoading.value = false
    }
}, 300)
const searchOptions = computed(() => {
    return searchResults.value.map((item) => ({
        label: item.name,
        key: item.id,
        props: {
            onClick: () => router.push(`/details/${item.id}`),
            style: { cursor: 'pointer' },
        },
    }))
})

const handleBlur = () => {
    setTimeout(() => {
        showDropdown.value = false
    }, 200)
}

// 通知弹窗
const Notify = (info: {
    type: NotificationType
    content: string
    meta: string
    duration: number
}) =>
    msgNotification[info.type]({
        content: info.content,
        meta: info.meta,
        duration: info.duration,
        keepAliveOnHover: true,
    })

// 登出逻辑
const handleLogout = () => {
    msgDialog.warning({
        title: '确认退出',
        content: '确定要退出当前账号吗？',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: () => {
            localStorage.removeItem('token')
            window.location.reload()
        },
    })
}

// 图标渲染
function renderIcon(icon: Component) {
    return () => {
        return h(NIcon, null, {
            default: () => h(icon),
        })
    }
}

// 下拉菜单选项
const dropdownOptions = [
    {
        label: '个人中心',
        key: 'profile',
        icon: renderIcon(markRaw(PersonCircleOutline)),
        props: {
            onClick: () => router.push('/user'),
            style: { cursor: 'pointer' },
        },
    },
    {
        label: '退出登录',
        key: 'logout',
        icon: renderIcon(markRaw(LogOutOutline)),
        props: {
            onClick: handleLogout,
            style: { cursor: 'pointer' },
        },
    },
]
</script>

<template>
    <div class="c_header">
        <div class="logo">
            <NuxtLink to="/">
                <img :src="Logo" class="logo-img" />
            </NuxtLink>
            <h2>{{ lang.NavBar.title }}</h2>
        </div>
        <div class="search-container">
            <n-input
                v-model:value="searchQuery"
                placeholder="搜索服务器..."
                clearable
                @update:value="performSearch"
                @focus="showDropdown = true"
                @blur="handleBlur"
            >
                <template #prefix>
                    <n-icon :component="SearchOutline" />
                </template>
            </n-input>

            <n-dropdown
                placement="bottom"
                trigger="manual"
                :options="searchOptions"
                :show="showDropdown && searchOptions.length > 0"
                :loading="searchLoading"
            >
                <div></div>
                <!-- 确保有一个根元素 -->
            </n-dropdown>
        </div>

        <div class="account">
            <n-badge :value="unreadCount" :max="99" v-if="token_status">
                <n-icon size="20" class="notify-icon">
                    <Notifications />
                </n-icon>
            </n-badge>
            <n-dropdown
                v-if="token_status"
                placement="bottom-end"
                trigger="hover"
                :options="dropdownOptions"
            >
                <div class="avatar-wrapper">
                    <n-avatar size="medium" :src="avatar" />
                    <span class="username">{{ username }}</span>
                </div>
            </n-dropdown>
            <NuxtLink v-else class="login" to="/auth">登录</NuxtLink>
        </div>
    </div>
</template>

<style scoped lang="less">
.c_header {
    display: flex;
    align-items: center;
    height: 100%;
    justify-content: space-between;
    padding: 0 1rem;

    .logo {
        display: flex;
        gap: 1rem;
        align-items: center;

        .logo-img {
            height: 2.4rem;
            transition: transform 0.3s;

            &:hover {
                transform: rotate(-15deg);
            }
        }

        h2 {
            background: linear-gradient(135deg, #4b6e91, #48a3e0);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }
    }

    .search-container {
        flex: 1;
        max-width: 400px;
        margin: 0 2rem;
        position: relative;

        .n-input {
            width: 100%;
            border-radius: 15px;
        }

        .n-dropdown {
            width: 100%;
            position: absolute;
            top: 100%;
            z-index: 1000;
            margin-top: 4px;
        }
    }

    .account {
        display: flex;
        gap: 1.5rem;
        align-items: center;
        height: 2rem;

        .notify-icon {
            cursor: pointer;
            padding: 4px;
            border-radius: 50%;
            transition: all 0.3s;

            &:hover {
                background: #f5f5f5;
                transform: scale(1.1);
            }
        }

        .avatar-wrapper {
            display: flex;
            align-items: center;
            gap: 0.8rem;
            padding: 4px 8px;
            border-radius: 20px;
            transition: all 0.3s;
            cursor: pointer;

            &:hover {
                background: #f5f5f5;

                .username {
                    color: #2c3e50;
                }
            }

            .username {
                max-width: 120px;
                overflow: hidden;
                text-overflow: ellipsis;
                color: #666;
                transition: color 0.3s;
            }
        }

        .login {
            font-size: 1rem;
            color: #2c3e50;
            padding: 6px 16px;
            border-radius: 20px;
            background: #f0f2f5;
            transition: all 0.3s;

            &:hover {
                background: #e0e2e5;
                color: #2c3e50;
            }
        }
    }
}

@media (max-width: 1200px) {
    .c_header {
        padding: 0 1rem;

        .logo h2 {
            display: none;
        }

        .search-container {
            margin: 0 1rem;
            max-width: 300px;
        }

        .account {
            .username {
                display: none;
            }

            .avatar-wrapper {
                padding: 4px;
            }
        }
    }
}

@media (max-width: 768px) {
    .c_header {
        .search-container {
            display: none;
        }
    }
}
</style>
