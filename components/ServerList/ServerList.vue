<script setup lang="ts">
import { ref, watch, onMounted, computed, defineAsyncComponent } from 'vue'
import { ServerAPI } from '../../hooks/api'
import type { List, ListItem } from '../../hooks/type_models'

const ServerCard = defineAsyncComponent(() => import('./ServerCard.vue'))

const allData = ref<ListItem[]>([])
const currentPageData = ref<ListItem[]>([])
const loading = ref(true)
const error = ref<Error | null>(null)
const page = ref(1)
const pageSize = 12
const pageCount = ref(0)
const isVisible = ref(true)
const searchQuery = ref('')

interface ServerWithPinyin extends ListItem {
    pinyin?: string // 全拼
    initials?: string // 拼音首字母
}
const serverDataWithPinyin = ref<ServerWithPinyin[]>([])

const convertToPinyin = async (name: string) => {
    const { pinyin } = await import('pinyin-pro')
    const fullPinyin = pinyin(name, { toneType: 'none', type: 'array' }).join(
        '',
    )
    const initials = pinyin(name, {
        pattern: 'first',
        toneType: 'none',
        type: 'array',
    }).join('')
    return { pinyin: fullPinyin, initials }
}

const initPinyinData = async (data: ListItem[]) => {
    const promises = data.map(async (server) => {
        const { pinyin, initials } = await convertToPinyin(server.name)
        return { ...server, pinyin, initials }
    })
    return await Promise.all(promises)
}

const filteredData = computed(() => {
    if (!searchQuery.value) return serverDataWithPinyin.value
    const query = searchQuery.value.toLowerCase()
    return serverDataWithPinyin.value.filter((server) => {
        // 若拼音数据还未加载，则仅匹配中文名称
        if (!server.pinyin || !server.initials) {
            return server.name.toLowerCase().includes(query)
        }
        return (
            server.name.toLowerCase().includes(query) ||
            server.pinyin.includes(query) ||
            server.initials.includes(query)
        )
    })
})

const fetchAllData = async () => {
    try {
        loading.value = true
        const response = await ServerAPI.Get<List>('/v1/servers', {})
        allData.value = response.server_list
        // 先直接显示基础数据，避免等待拼音转换
        serverDataWithPinyin.value = [...allData.value]
        updatePageData()
        // 异步加载拼音数据，加载完成后再更新页面
        initPinyinData(allData.value).then((dataWithPinyin) => {
            serverDataWithPinyin.value = dataWithPinyin
            updatePageData()
        })
    } catch (err) {
        error.value = err as Error
    } finally {
        loading.value = false
    }
}

const updatePageData = () => {
    isVisible.value = false
    setTimeout(() => {
        pageCount.value = Math.ceil(filteredData.value.length / pageSize)
        const start = (page.value - 1) * pageSize
        const end = start + pageSize
        currentPageData.value = filteredData.value.slice(start, end)
        isVisible.value = true
    }, 300)
}

// 随机打乱数据
const random = () => {
    const shuffled = [...filteredData.value]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    serverDataWithPinyin.value = [...shuffled]
    updatePageData()
}

// 监听页码和过滤数据变化
watch([page, filteredData], () => {
    updatePageData()
})

onMounted(() => {
    fetchAllData()
})
</script>

<template>
    <div class="ServerList">
        <h1>服务器列表</h1>
        <div v-if="loading">Loading...</div>
        <div v-else-if="error">加载失败QAQ (code: {{ error.message }})</div>
        <div v-else>
            <!-- 搜索框 -->
            <div class="search-box">
                <n-input
                    v-model:value="searchQuery"
                    placeholder="输入服务器名称、拼音或拼音首字母搜索..."
                    clearable
                    @keyup.enter="page = 1"
                />
            </div>
            <div class="page">
                <n-button @click="random" size="small">随机</n-button>
                <n-pagination
                    v-model:page="page"
                    :page-count="pageCount"
                    simple
                />
            </div>
            <br />
            <NNotificationProvider placement="bottom-right">
                <TransitionGroup
                    tag="div"
                    name="card"
                    class="grid-list"
                    ref="serverList"
                >
                    <ServerCard
                        v-for="server in currentPageData"
                        v-if="isVisible"
                        :key="server.id"
                        :id="server.id"
                        :name="server.name"
                    />
                </TransitionGroup>
            </NNotificationProvider>
            <br />
            <n-pagination
                v-model:page="page"
                :page-count="pageCount"
                v-if="isVisible"
            />
        </div>
    </div>
</template>

<style scoped lang="less">
.ServerList {
    padding: 20px;
}
.search-box {
    margin-bottom: 20px;
    max-width: 300px;
}
.page {
    display: flex;
    gap: 0.4rem;
    align-items: center;
}
.grid-list {
    display: grid;
    box-sizing: border-box;
    grid-template-columns: repeat(auto-fit, minmax(25rem, 1fr));
    gap: 20px;
    /* 开启 GPU 加速 */
    will-change: transform, opacity;
    @media screen and (max-width: 768px) {
        grid-template-columns: 1fr;
    }
}

/* 定义卡片进入与离开的动画 */
.card-enter-active {
    animation: card-enter 0.4s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
}

.card-leave-active {
    animation: card-leave 0.3s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
}

@keyframes card-enter {
    0% {
        opacity: 0;
        transform: translateY(30px) scale(0.95) rotateX(15deg);
    }
    100% {
        opacity: 1;
        transform: translateY(0) scale(1) rotateX(0deg);
    }
}

@keyframes card-leave {
    0% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
    100% {
        opacity: 0;
        transform: translateY(30px) scale(0.95);
    }
}

/* 其他现有的翻页动画样式 */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
