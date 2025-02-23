<script setup lang="ts">
import ServerCard from './ServerCard.vue'
import { ServerAPI } from '../../hooks/api'
import { usePagination } from 'alova/client'
import { ref, watch } from 'vue'
import type { List } from '../../hooks/type_models'

// 请求分页数据
const { loading, data, page, pageCount, error } = usePagination(
    (page, pageSize) =>
        ServerAPI.Get<List>('/v1/servers', {
            params: {
                offset: (page - 1) * pageSize,
                limit: 12,
            },
        }),
    {
        initialData: [],
        initialPage: 1, // 初始页码，默认为1
        initialPageSize: 12,
        data: (response) => response.server_list,
        total: (response) => response.total,
        debounce: 200,
    },
)

const random = () => {
    for (let i = data.value.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[data.value[i], data.value[j]] = [data.value[j], data.value[i]]
    }
}

// 监听页码变化
const isChangingPage = ref(false)

watch(page, () => {
    isChangingPage.value = true
    setTimeout(() => {
        isChangingPage.value = false
    }, 300)
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
            <Transition name="page-change" mode="out-in">
                <div :key="page" v-if="!isChangingPage">
                    <TransitionGroup tag="div" name="fade" class="grid-list">
                        <ServerCard
                            v-for="server in data"
                            :key="server.id"
                            :id="server.id"
                            :name="server.name"
                        />
                    </TransitionGroup>
                </div>
            </Transition>
        </NNotificationProvider>
        <br />
        <n-pagination v-model:page="page" :page-count="pageCount" />
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
    transition: all 0.3s ease;
}

.page-change-enter-from,
.page-change-leave-to {
    opacity: 0;
    transform: translateY(20px);
}
</style>
