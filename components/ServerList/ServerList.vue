<script setup lang="ts">
import ServerCard from './ServerCard.vue'
import { ServerAPI } from '../../hooks/api'
import { ref, watch, onMounted } from 'vue'
import type { List, ListItem } from '../../hooks/type_models'

const allData = ref<ListItem[]>([])
const currentPageData = ref<ListItem[]>([])
const loading = ref(true)
const error = ref<Error | null>(null)
const page = ref(1)
const pageSize = 12
const pageCount = ref(0)
const isVisible = ref(true) // 新增：控制显示的状态

const fetchAllData = async () => {
    try {
        loading.value = true
        const response = await ServerAPI.Get<List>('/v1/servers', {})
        allData.value = response.server_list
        pageCount.value = Math.ceil(allData.value.length / pageSize)
        random()
    } catch (err) {
        error.value = err as Error
    } finally {
        loading.value = false
    }
}

// 洗牌算法随机打乱所有数据
const random = async () => {
    for (let i = allData.value.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[allData.value[i], allData.value[j]] = [
            allData.value[j],
            allData.value[i],
        ]
    }
    updatePageData() // 更新当前页数据
}

// 更新当前页数据
const updatePageData = async () => {
    isVisible.value = false // 先隐藏数据
    await new Promise((resolve) => setTimeout(resolve, 310)) // 等待动画结束
    const start = (page.value - 1) * pageSize
    const end = start + pageSize
    currentPageData.value = allData.value.slice(start, end)
    isVisible.value = true // 显示新数据
}

// 监听页码变化
watch(page, () => {
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
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
