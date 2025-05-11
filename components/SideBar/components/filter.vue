<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { List, Status } from '@/api/models'
import { defaultFilterOptions, type FilterOptions } from './filter_type'

// 筛选相关状态
const { $serverAPI } = useNuxtApp()

// 服务器数据
const serverList = ref<Status[]>([])
const loading = ref(true)

// 从API获取的筛选选项
const filters = computed(() => {
    // 游戏类型选项
    const modes = ['JAVA', 'BEDROCK']

    // 认证模式选项
    const authModes = ['OFFLINE', 'YGGDRASIL', 'OFFICIAL']

    // 标签选项 - 收集所有服务器的所有标签并去重
    const allTags = serverList.value.flatMap((server) => server.tags || [])
    const tags = Array.from(new Set(allTags))

    return {
        modes: modes.map((mode) => ({
            label: mode === 'JAVA' ? 'Java 版' : '基岩版',
            value: mode,
        })),
        authModes: authModes.map((mode) => ({
            label:
                mode === 'OFFLINE'
                    ? '离线模式'
                    : mode === 'OFFICIAL'
                      ? '正版验证'
                      : mode === 'YGGDRASIL'
                        ? '外置登录'
                        : '未知',
            value: mode,
        })),
        tags: tags,
    }
})

// 获取服务器列表数据
const fetchServerList = async () => {
    try {
        loading.value = true
    } catch (error) {
        console.error('获取服务器列表失败:', error)
    } finally {
        loading.value = false
    }
}

const filterOptions = ref<FilterOptions>(defaultFilterOptions)

// 发送筛选事件
const emitFilterChange = () => {
    // 使用自定义事件将筛选条件发送给父组件
    console.log('筛选条件:', filterOptions.value)
    emit('filter-change', filterOptions)
}

// 定义事件
const emit = defineEmits(['filter-change'])

// 重置筛选条件
const resetFilters = () => {
    filterOptions.value = defaultFilterOptions
    emitFilterChange()
}

// 组件挂载时获取数据
onMounted(() => {
    fetchServerList()
})
</script>

<template>
    <!-- 精准筛选 -->
    <a-card title="精准筛选" class="section filter-section">
        <a-spin :spinning="loading">
            <a-space direction="vertical" style="width: 100%">
                <div class="custom-sider">
                    <!-- 游戏版本筛选 -->
                    <div class="filter-item">
                        <div class="filter-label">服务器类型</div>
                        <a-select
                            v-model:value="filterOptions.modes"
                            :options="filters.modes"
                            multiple
                            allow-clear
                            placeholder="选择游戏版本"
                            style="width: 100%"
                            @change="emitFilterChange"
                        />
                    </div>

                    <!-- 认证模式筛选 -->
                    <div class="filter-item">
                        <div class="filter-label">认证模式</div>
                        <a-select
                            v-model:value="filterOptions.authModes"
                            :options="filters.authModes"
                            mode="multiple"
                            placeholder="选择认证模式"
                            style="width: 100%"
                            @change="emitFilterChange"
                        />
                    </div>

                    <!-- 标签筛选 -->
                    <div class="filter-item">
                        <div class="filter-label">服务器标签</div>
                        <div class="tag-cloud">
                            <a-tag
                                v-for="tag in filters.tags"
                                :key="tag"
                                :color="
                                    (filterOptions.tags || []).includes(tag)
                                        ? 'blue'
                                        : undefined
                                "
                                style="cursor: pointer; margin-bottom: 5px"
                                @click="
                                    () => {
                                        if (
                                            (filterOptions.tags || []).includes(
                                                tag,
                                            )
                                        ) {
                                            filterOptions.tags = (
                                                filterOptions.tags || []
                                            ).filter((t) => t !== tag)
                                        } else {
                                            filterOptions.tags = [
                                                ...(filterOptions.tags || []),
                                                tag,
                                            ]
                                        }
                                        emitFilterChange()
                                    }
                                "
                            >
                                {{ tag }}
                            </a-tag>
                        </div>
                    </div>

                    <!-- 重置按钮 -->
                    <a-button
                        type="primary"
                        block
                        @click="resetFilters"
                        style="margin-top: 16px"
                    >
                        重置筛选
                    </a-button>
                </div>
            </a-space>
        </a-spin>
    </a-card>
</template>

<style scoped lang="less">
@import '@/assets/css/variables.less';

.filter-section {
    .a-select,
    .a-slider {
        width: 100%;
        margin-bottom: 10px;
    }

    .filter-item {
        margin-bottom: 18px;
        background-color: rgba(0, 0, 0, 0.02);
        padding: 12px;
        border-radius: 8px;
        transition: all 0.3s ease;

        @media (prefers-color-scheme: dark) {
            background-color: rgba(255, 255, 255, 0.05);
        }

        @media (max-width: 768px) {
            padding: 10px;
            margin-bottom: 14px;
        }
    }

    .filter-label {
        font-weight: 600;
        margin-bottom: 10px;
        color: @text-color-light;
        font-size: 15px;
        display: flex;
        align-items: center;

        &::before {
            content: '';
            display: inline-block;
            width: 4px;
            height: 14px;
            background-color: @primary;
            margin-right: 8px;
            border-radius: 2px;
        }

        @media (prefers-color-scheme: dark) {
            color: @text-color-dark;
        }

        @media (max-width: 768px) {
            font-size: 14px;
        }
    }

    .tag-cloud {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        padding: 6px 0;
    }

    .a-tag {
        margin: 2px;
        transition: all 0.3s;
        border-radius: 4px;
        padding: 4px 8px;

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

            @media (prefers-color-scheme: dark) {
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            }
        }

        @media (max-width: 768px) {
            padding: 3px 6px;
            font-size: 12px;
        }
    }

    /* 重置按钮样式优化 */
    .a-button {
        transition: all 0.3s ease;
        height: 36px;
        border-radius: 6px;

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

            @media (prefers-color-scheme: dark) {
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            }
        }

        @media (max-width: 768px) {
            height: 40px;
            font-size: 15px;
        }
    }
}
</style>
