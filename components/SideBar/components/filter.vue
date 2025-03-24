<script setup lang="ts">
import { ref } from 'vue'

const playerRange = ref<[number, number]>([0, 500])
const filters = ref({
    modes: ['1', '2', '3', '4'],
    tags: ['1', '2', '3', 'XXX'],
})
</script>

<template>
    <!-- 精准筛选 -->
    <a-card class="section filter-section">
        <template #title>
            <div class="card-title" role="heading">精准筛选</div>
        </template>
        <a-space direction="vertical">
            <div class="custom-sider">
                <!-- 游戏模式筛选 -->
                <a-select
                    :options="
                        filters.modes.map((m) => ({ label: m, value: m }))
                    "
                    multiple
                    placeholder="游戏模式"
                    label="选择游戏模式"
                />

                <!-- 玩家数量范围筛选 -->
                <a-slider
                    :step="10"
                    v-model:value="playerRange"
                    range
                    :tip-formatter="
                        (v?: number) => (v !== undefined ? `${v}+ 玩家` : '')
                    "
                />

                <!-- 标签筛选 -->
                <div class="tag-cloud">
                    <a-tag
                        v-for="tag in filters.tags"
                        :key="tag"
                        round
                        size="small"
                    >
                        {{ tag }}
                    </a-tag>
                </div>
            </div>
        </a-space>
    </a-card>
</template>

<style scoped lang="less">
@import '@/assets/css/variables.less';

.filter-section {
    .a-select,
    .a-slider {
        width: 100%;
        margin-bottom: 16px;
    }

    .tag-cloud {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        padding: 8px 0;
    }

    .a-tag {
        margin: 2px;
    }
}
</style>
