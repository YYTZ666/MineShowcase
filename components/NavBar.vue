<script setup lang="ts">
import { shallowRef, ref, onMounted, onBeforeUnmount } from 'vue'
import { NCard, NTag, NSpace, NStatistic, NTime } from 'naive-ui'

const recommendations = shallowRef([
    { label: 'XXX', value: 1, ping: 0 },
    { label: 'XXX', value: 2, ping: 0 },
    { label: 'XXX', value: 3, ping: 0 },
])

const stats = shallowRef({
    onlinePlayers: 0,
    newServers24h: 0,
})

const lastUpdated = ref(Date.now())

// 方式 1：使用 ReturnType<typeof setInterval>
let intervalId: ReturnType<typeof setInterval> | null = null

onMounted(() => {
    intervalId = setInterval(() => {
        lastUpdated.value = Date.now()
    }, 60000)
})

onBeforeUnmount(() => {
    if (intervalId) clearInterval(intervalId)
})
</script>

<template>
    <div class="custom-sider">
        <div class="content-wrapper">
            <!-- 推荐服务器 -->
            <div v-memo="[recommendations]">
                <n-card class="section recommend-section">
                    <template #header>
                        <div class="card-title">为您推荐</div>
                    </template>
                    <n-space vertical>
                        <div
                            v-for="server in recommendations"
                            :key="server.value"
                            class="server-item"
                        >
                            <n-tag
                                :bordered="false"
                                type="success"
                                size="small"
                            >
                                {{ server.ping }}ms
                            </n-tag>
                            <span class="server-name">{{ server.label }}</span>
                        </div>
                    </n-space>
                </n-card>
            </div>

            <!-- 实时数据 -->
            <n-card class="section stats-section">
                <template #header>
                    <div class="card-title">全站状态</div>
                </template>
                <n-space vertical>
                    <n-statistic
                        label="在线玩家"
                        :value="stats.onlinePlayers"
                    />
                    <n-statistic
                        label="24小时新服"
                        :value="stats.newServers24h"
                    />
                    <n-time
                        type="relative"
                        :time="lastUpdated"
                        class="time-display"
                    />
                </n-space>
            </n-card>
        </div>
    </div>
</template>

<style scoped lang="less">
.custom-sider {
    height: 100vh;
    position: sticky;
    top: 0;
    display: flex;
    flex-direction: column;

    .content-wrapper {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        scrollbar-width: none;
        will-change: transform;
        &::-webkit-scrollbar {
            display: none;
        }
    }

    .section {
        border-radius: 4px;
        margin-bottom: 16px;
        width: 100%;

        &:last-child {
            margin-bottom: 0;
        }

        .card-title {
            font-size: 16px;
            font-weight: 500;
            color: var(--n-title-text-color);
        }
    }

    .recommend-section .server-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 2px 0;
        .server-name {
            font-size: 13px;
        }
    }

    .stats-section .n-statistic {
        margin-bottom: 12px;
        &:last-child {
            margin-bottom: 0;
        }
    }

    .stats-section .time-display {
        margin-top: 8px;
        font-size: 14px;
        color: #666;
    }
}
</style>
