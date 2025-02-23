<script setup lang="ts">
import ServerCard from './ServerCard.vue'
import { ServerAPI } from '../../hooks/api'
import { usePagination } from 'alova/client'
import { ref, watch, onUnmounted } from 'vue'
import type { Status } from '../../hooks/type_models'

interface Info {
    server_list: List[]
    total_member: number
    total: number
}

interface List {
    id: number
    name: string
}

const { loading, data, page, pageCount, error } = usePagination(
    (page, pageSize) =>
        ServerAPI.Get<Info>('/v1/servers', {
            params: {
                offset: (page - 1) * pageSize,
                limit: 12,
            },
        }),
    {
        initialData: [],
        initialPage: 1,
        initialPageSize: 12,
        data: (response) =>
            (response.server_list || []).map((server) => server.id),
        total: (response) => response.total,
        debounce: 200,
    },
)

const serverDetails = ref<Status[]>([])
const isFetchingDetails = ref(false)
const cache = new Map<number, Status>()
let abortController: AbortController | null = null

onUnmounted(() => {
    abortController?.abort()
})

const fetchServerDetails = async () => {
    abortController?.abort()
    abortController = new AbortController()

    const ids = data.value || []
    serverDetails.value = [] // 立即清空旧数据

    if (!ids.length) return

    isFetchingDetails.value = true
    try {
        const detailsPromises = ids.map((id) => {
            // 强制跳过缓存，每次重新请求
            return ServerAPI.Get<Status>(`/v1/servers/info/${id}`, {
                signal: abortController!.signal,
            }).then((res) => {
                cache.set(id, res) // 更新缓存
                return res
            })
        })

        const details = await Promise.all(detailsPromises)
        serverDetails.value = details
    } catch (error) {
        console.error('获取服务器详情失败', error)
    } finally {
        isFetchingDetails.value = false
    }
}

const random = () => {
    serverDetails.value = [
        ...serverDetails.value.sort(() => Math.random() - 0.5),
    ]
}

const isChangingPage = ref(false)
watch(
    data,
    async () => {
        isChangingPage.value = true
        try {
            await fetchServerDetails()
        } finally {
            isChangingPage.value = false
        }
    },
    { immediate: true },
)
</script>

<template>
    <h1>ServerList</h1>

    <div v-if="loading">加载中...</div>
    <div v-else-if="error">加载失败QAQ (code: {{ error.message }})</div>
    <div v-else>
        <div class="page">
            <n-button @click="random" size="small">随机</n-button>
            <n-pagination v-model:page="page" :page-count="pageCount" simple />
        </div>
        <br />

        <NNotificationProvider placement="bottom-right">
            <Transition name="page-change" mode="out-in">
                <div :key="page">
                    <div v-if="isFetchingDetails" class="loading-text">
                        服务器详情加载中...
                    </div>
                    <TransitionGroup
                        v-else
                        tag="div"
                        name="fade"
                        class="grid-list"
                    >
                        <ServerCard
                            v-for="server in serverDetails"
                            :key="server.id"
                            :id="server.id"
                            :name="server.name"
                            :type="server.type"
                            :version="server.version"
                            :desc="server.desc"
                            :link="server.link"
                            :ip="server.ip"
                            :is_member="server.is_member"
                            :is_hide="server.is_hide"
                            :auth_mode="server.auth_mode"
                            :tags="server.tags"
                            :status="server.status"
                        />
                    </TransitionGroup>
                </div>
            </Transition>
        </NNotificationProvider>
        <br />
        <n-pagination
            v-if="!isFetchingDetails"
            v-model:page="page"
            :page-count="pageCount"
        />
    </div>
</template>

<style scoped lang="less">
.page {
    display: flex;
    gap: 0.4rem;
}
.grid-list {
    display: grid;
    box-sizing: border-box;
    grid-template-columns: repeat(auto-fit, minmax(25rem, 1fr));
    gap: 20px;
    transition: 0.3s all;

    @media screen and (max-width: 768px) {
        grid-template-columns: 1fr;
    }
}

// 翻页动画样式
.page-change-enter-active,
.page-change-leave-active {
    transition: all 0.4s ease;
}

.page-change-enter-from,
.page-change-leave-to {
    opacity: 0;
    transform: translateY(20px);
}
.loading-text {
    text-align: center;
    padding: 20px;
    color: #666;
}
</style>
