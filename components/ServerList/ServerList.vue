<script setup lang="ts">
import {
    ref,
    watch,
    onMounted,
    computed,
    defineAsyncComponent,
    inject,
} from 'vue'
import qs from 'qs'

import type { Status } from '~/api/models'
import ServerCardSkeleton from './ServerCardSkeleton.vue'
import {
    defaultFilterOptions,
    type FilterOptions,
} from '../SideBar/components/filter_type'
const { $serverAPI } = useNuxtApp()
const ServerCard = defineAsyncComponent(() => import('./ServerCard.vue'))

const currentPageData = ref<Status[]>([])
const loading = ref(true)
const error = ref<Error | null>(null)
const page = ref(1)
const pageSize = 12
const ServersTotal = ref(0)
const isVisible = ref(false)
const showAllServers = ref(false)
const seed = ref<number | null>(null)
// 筛选条件
const filterOptions = ref<FilterOptions>(defaultFilterOptions)

// 处理筛选组件发出的筛选事件
const handleFilterChange = (options: any) => {
    filterOptions.value = options
    page.value = 1
    seed.value = null // 重置种子以获取新随机序列
    fetchPageData(1)
}

// 接收从布局组件提供的筛选条件
const injectedFilterOptions = inject<{ value: typeof filterOptions.value }>(
    'filterOptions',
)
// 监听注入的筛选选项变化
if (injectedFilterOptions) {
    watch(
        () => injectedFilterOptions.value,
        (newOptions) => {
            if (newOptions) {
                filterOptions.value = newOptions
                page.value = 1 // 重置页码
            }
        },
        { immediate: true },
    )
}

// 请求参数生成器
const getRequestParams = (pageNum: number) => {
    const params: Record<string, any> = {
        limit: pageSize,
        offset: (pageNum - 1) * pageSize,
    }

    if (seed.value !== null) {
        params.seed = seed.value
    } else {
        params.random = true
    }

    if (filterOptions.value.modes) {
        params.modes = filterOptions.value.modes
    }
    if (
        filterOptions.value.authModes &&
        filterOptions.value.authModes.length > 0
    ) {
        params.authModes = filterOptions.value.authModes
    }
    if (filterOptions.value.tags && filterOptions.value.tags.length > 0) {
        params.tags = filterOptions.value.tags
    }
    params.is_member = !showAllServers.value
    // TODO: 搜索功能
    // if (searchQuery.value) {
    //     params.search = searchQuery.value
    // }
    return params
}
const fetchPageData = async (pageNum: number) => {
    try {
        isVisible.value = false
        loading.value = true
        const response = await $serverAPI.Get<{
            server_list: Status[]
            total: number
            random_seed?: number
        }>(
            '/v1/servers?' +
                qs.stringify(getRequestParams(pageNum), {
                    arrayFormat: 'repeat',
                }),
        )

        // 保存种子用于后续请求
        if (response.random_seed !== undefined && seed.value === null) {
            seed.value = response.random_seed
        }

        currentPageData.value = response.server_list
        ServersTotal.value = response.total
        isVisible.value = true
    } catch (err) {
        error.value = err as Error
        console.error('Error fetching page data:', err)
    } finally {
        loading.value = false
    }
}

import debounce from 'lodash-es/debounce'

// 监听页码和过滤数据变化，添加防抖
const debouncedFetchPageData = debounce(() => {
    fetchPageData(page.value)
}, 300)

watch([page, injectedFilterOptions, showAllServers], () => {
    debouncedFetchPageData()
})

onMounted(() => {
    fetchPageData(1)
})
</script>

<template>
    <div class="ServerList">
        <div class="text">
            <h1>服务器列表</h1>
            <p>搜索服务器，支持名称、拼音、首字母查询，随机推荐与分页浏览。</p>
            <div class="input-line">
                <a-tooltip
                    title="MSCPO 认证服务器更稳定、体验更佳。此选项会显示包括未认证在内的所有服务器"
                    placement="bottom"
                >
                    <a-checkbox
                        v-model:checked="showAllServers"
                        @change="page = 1"
                    >
                        显示未认证服务器
                    </a-checkbox>
                </a-tooltip>
                <a-button
                    type="primary"
                    @click="handleFilterChange"
                    :disabled="!isVisible"
                >
                    随机
                </a-button>
            </div>
        </div>
        <a-divider />
        <div class="text">
            <p v-if="error">加载失败 QAQ (code: {{ error.message }})</p>
            <p v-else-if="currentPageData.length === 0 && isVisible">
                这里是一片荒岛...换一个词搜索罢 QAQ
            </p>
        </div>
        <div v-if="!error && !(currentPageData.length === 0 && isVisible)">
            <TransitionGroup
                tag="div"
                name="fade"
                class="grid-list"
                ref="serverList"
                v-if="isVisible"
            >
                <ServerCard
                    v-for="server in currentPageData"
                    :key="server.id"
                    :id="server.id"
                    :name="server.name"
                    :ip="server.ip"
                    :auth_mode="server.auth_mode"
                    :desc="server.desc"
                    :status="server.status"
                    :link="server.link"
                    :tags="server.tags"
                    :type="server.type"
                    :version="server.version"
                    :is_hide="server.is_hide"
                    :is_member="server.is_member"
                    :permission="server.permission"
                    :detail="server.detail"
                    :cover_url="server.cover_url"
                />
            </TransitionGroup>

            <div v-else class="grid-list">
                <ServerCardSkeleton
                    v-for="n in pageSize"
                    :key="'skeleton-' + n"
                />
            </div>

            <a-divider />
            <a-pagination
                v-model:current="page"
                :page-size="pageSize"
                :total="ServersTotal"
                v-if="isVisible"
            />
        </div>
    </div>
</template>

<style scoped lang="less">
@import '@/assets/css/variables.less';

.ServerList {
    color: @text-color-light;

    @media (prefers-color-scheme: dark) {
        color: @text-color-dark;
    }

    padding: 20px;
}

.text {
    h1 {
        font-weight: normal;
        text-align: center;
    }

    p {
        font-size: 1.2rem;
        text-align: center;
        padding-inline: 2rem;
        color: @text-color-secondary;

        @media (prefers-color-scheme: dark) {
            color: @text-color-secondary-dark;
        }
    }

    .input-line {
        margin: 0 auto;
        max-width: 15rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem;
        border-radius: 8px;
        background-color: rgba(0, 0, 0, 0.02);
        transition: all 0.3s ease;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
        position: relative;
        &:hover {
            background-color: rgba(0, 0, 0, 0.04);
            transform: translateY(-2px);
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);

            @media (prefers-color-scheme: dark) {
                background-color: rgba(255, 255, 255, 0.08);
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
            }
        }
        @media (prefers-color-scheme: dark) {
            background-color: rgba(255, 255, 255, 0.05);
        }
        @media (max-width: 768px) {
            padding: 10px;
            margin-bottom: 14px;
        }
    }

    .filter-options {
        margin-top: 0.8rem;
        text-align: center;
    }
}

.page {
    display: flex;
    gap: 0.4rem;
    align-items: center;

    .pagin {
        display: flex;
    }
}

.grid-list {
    display: grid;
    box-sizing: border-box;
    grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
    gap: 20px;
    will-change: transform, opacity;
    justify-content: center;

    @media screen and (max-width: 768px) {
        grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
    }
}

.fade-enter-active {
    animation: card-enter 0.3s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
}

.fade-leave-active {
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
</style>
