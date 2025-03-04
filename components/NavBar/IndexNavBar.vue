<script setup lang="ts">
import { shallowRef, ref, onMounted, onBeforeUnmount } from 'vue'
import { NCard, NTag, NSpace, NStatistic, NTime } from 'naive-ui'
import { useFilterStore } from '~/stores/filterStore'
const filterStore = useFilterStore()
const handleModeChange = (values: string[]) => {
    filterStore.setModes(values)
}

const handlePlayerRangeChange = (value: any) => {
    filterStore.setPlayerRange(value)
}

const handleTagClick = (tag: string) => {
    filterStore.toggleTag(tag)
}
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
const playerRange = ref<[number, number]>([0, 500])
let intervalId: ReturnType<typeof setInterval> | null = null

onMounted(() => {
    intervalId = setInterval(() => {
        lastUpdated.value = Date.now()
    }, 60000)
})

onBeforeUnmount(() => {
    if (intervalId) clearInterval(intervalId)
})
const filters = ref({
    modes: ['XXX', 'XXX', 'XXX', 'XXX'],
    tags: ['XXX', 'XXX', 'XXX', 'XXX'],
})
</script>

<template>
    <div class="content-wrapper">
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
                        <n-tag :bordered="false" type="success" size="small">
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
                <n-statistic label="在线玩家" :value="stats.onlinePlayers" />
                <n-statistic label="24小时新服" :value="stats.newServers24h" />
                <n-time
                    type="relative"
                    :time="lastUpdated"
                    class="time-display"
                />
            </n-space>
        </n-card>
        <n-card class="section filter-section">
            <template #header>
                <div class="card-title">精准筛选</div>
            </template>
            <n-space vertical>
                <div class="custom-sider">
                    <!-- 游戏模式筛选 -->
                    <n-select
                        :value="filterStore.selectedModes"
                        @update:value="handleModeChange"
                        :options="
                            filters.modes.map((m) => ({ label: m, value: m }))
                        "
                        multiple
                        placeholder="游戏模式"
                    />

                    <!-- 玩家数量范围筛选 -->
                    <n-slider
                        :value="filterStore.playerRange"
                        @update:value="handlePlayerRangeChange"
                        :step="10"
                        range
                        :min="0"
                        :max="500"
                        :format-tooltip="(v: number) => `${v}+玩家`"
                    />

                    <!-- 标签筛选 -->
                    <div class="tag-cloud">
                        <n-tag
                            v-for="tag in filters.tags"
                            :key="tag"
                            :type="
                                filterStore.selectedTags.includes(tag)
                                    ? 'primary'
                                    : 'default'
                            "
                            @click="handleTagClick(tag)"
                            round
                            size="small"
                        >
                            {{ tag }}
                        </n-tag>
                    </div>
                </div>
            </n-space>
        </n-card>
    </div>
</template>

<style scoped lang="less">
.content-wrapper {
    padding: 12px;
}
.section {
    width: 100%;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;

    .card-title {
        font-weight: bold;
        font-size: 16px;
        color: #333;
        padding: 5px 0;
        border-bottom: 1px solid #f0f0f0;
    }
}

.recommend-section {
    .server-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 0;
        font-size: 14px;
        color: #666;

        .server-name {
            font-weight: 500;
            font-size: 14px;
        }
    }
}

.stats-section {
    .n-statistic {
        margin-bottom: 16px;

        &:last-child {
            margin-bottom: 0;
        }
    }

    .time-display {
        font-size: 14px;
        color: #888;
        margin-top: 8px;
    }
}

.filter-section {
    .n-select,
    .n-slider {
        width: 100%;
        margin-bottom: 16px;
    }

    .tag-cloud {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        padding: 8px 0;
    }

    .n-tag {
        margin: 2px;
    }
}
</style>
