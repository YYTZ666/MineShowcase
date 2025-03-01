<script setup lang="ts">
import ServerCard from './ServerCard.vue'
import { ServerAPI } from '../../hooks/api'
import { ref, watch, onMounted, computed } from 'vue'
import type { List, ListItem } from '../../hooks/type_models'
import { pinyin } from 'pinyin-pro' // 引入拼音库

const allData = ref<ListItem[]>([])
const currentPageData = ref<ListItem[]>([])
const loading = ref(true)
const error = ref<Error | null>(null)
const page = ref(1)
const pageSize = 12
const pageCount = ref(0)
const isVisible = ref(true)
const searchQuery = ref('')

// 新增：缓存拼音和拼音首字母
interface ServerWithPinyin extends ListItem {
    pinyin: string // 全拼
    initials: string // 拼音首字母
}

const serverDataWithPinyin = ref<ServerWithPinyin[]>([])

// 将中文名称转换为拼音和拼音首字母
const convertToPinyin = (name: string) => {
    const fullPinyin = pinyin(name, { toneType: 'none', type: 'array' }).join(
        '',
    ) // 全拼
    const initials = pinyin(name, {
        pattern: 'first',
        toneType: 'none',
        type: 'array',
    }).join('') // 首字母
    return { pinyin: fullPinyin, initials }
}

// 初始化时缓存拼音数据
const initPinyinData = (data: ListItem[]) => {
    return data.map((server) => ({
        ...server,
        ...convertToPinyin(server.name),
    }))
}

// 过滤数据（支持中文、拼音、拼音首字母）
const filteredData = computed(() => {
    if (!searchQuery.value) return serverDataWithPinyin.value
    const query = searchQuery.value.toLowerCase()
    return serverDataWithPinyin.value.filter(
        (server) =>
            server.name.toLowerCase().includes(query) || // 匹配中文
            server.pinyin.includes(query) || // 匹配全拼
            server.initials.includes(query), // 匹配拼音首字母
    )
})

const fetchAllData = async () => {
    try {
        loading.value = true
        const response = await ServerAPI.Get<List>('/v1/servers', {})
        allData.value = response.server_list
        serverDataWithPinyin.value = initPinyinData(allData.value) // 初始化拼音数据
        random()
    } catch (err) {
        error.value = err as Error
    } finally {
        loading.value = false
    }
}

// 更新分页数据
const updatePageData = async () => {
    isVisible.value = false
    await new Promise((resolve) => setTimeout(resolve, 310))
    pageCount.value = Math.ceil(filteredData.value.length / pageSize)
    const start = (page.value - 1) * pageSize
    const end = start + pageSize
    currentPageData.value = filteredData.value.slice(start, end)
    isVisible.value = true
}

// 随机打乱数据
const random = () => {
    const shuffled = [...filteredData.value]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    serverDataWithPinyin.value = [...shuffled] // 保持数据引用更新
    updatePageData()
}

// 监听页码和搜索词变化
watch([page, filteredData], () => {
    updatePageData()
})

onMounted(() => {
    fetchAllData()
})
</script>

<template>
    <h1>ServerList</h1>
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
            <n-pagination v-model:page="page" :page-count="pageCount" simple />
        </div>

        <br />
        <NNotificationProvider placement="bottom-right">
            <TransitionGroup tag="div" name="fade" class="grid-list">
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
</template>

<style scoped lang="less">
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
    transition: 0.3s all;

    @media screen and (max-width: 768px) {
        grid-template-columns: 1fr;
    }
}

// 翻页动画样式
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
