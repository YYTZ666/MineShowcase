<script setup lang="ts">
import { ref } from 'vue'
import {
    useDebounceFn,
    onClickOutside,
} from '@vueuse/core'
import { ServerAPI } from '../../hooks/api'

const router = useRouter()
const inputRef = ref(null)
const activeKey = ref(['1'])
const searchQuery = ref('')
const searchResults = ref<any[]>([])
const showResult = ref(false)
const searchLoading = ref(false)
const target = ref(null)

interface SearchResult {
    id: string
    name: string
    // 根据后端返回可扩展其他字段
}
// 搜索功能
const performSearch = useDebounceFn(async () => {
    if (!searchQuery.value) {
        searchResults.value = []
        showResult.value = false
        return
    }
    try {
        searchLoading.value = true
        const response = await ServerAPI.Get<{ results: SearchResult[] }>(
            '/v1/search',
            {
                params: {
                    query: searchQuery.value,
                    limit: 5,
                },
            },
        )
        searchResults.value = response.results
        showResult.value = true
    } catch (error) {
        console.error('搜索失败:', error)
        searchResults.value = []
    } finally {
        searchLoading.value = false
    }
}, 300)

onClickOutside(target, (event) => (showResult.value = false))

const PushRouter = (id: string) => {
    router.push(`/details/${id}`)
    showResult.value = false
}
</script>

<template>
    <div ref="target" style="position: relative">
        <a-input
            v-model:value="searchQuery"
            ref="inputRef"
            placeholder="全局搜索"
            @change="performSearch"
            @focus="showResult = true"
        >
            <template #prefix>
                <SearchOutlined />
            </template>
        </a-input>
        <div class="search-result" v-show="showResult" @click.stop>
            <a-divider style="border-color: #a6c3ee; height: 1rem" dashed>
                全局搜索
            </a-divider>
            <a-collapse
                v-model:activeKey="activeKey"
                :bordered="false"
                style="background: rgb(255, 255, 255)"
            >
                <template #expandIcon="{ isActive }">
                    <caret-right-outlined :rotate="isActive ? 90 : 0" />
                </template>
                <a-collapse-panel key="1" header="服务器">
                    <div class="info-item" v-for="server in searchResults" @click="PushRouter(server.id)">
                        {{ server.name }}
                    </div>
                </a-collapse-panel>
                <a-collapse-panel key="2" header="文档">
                    <p>开发中...</p>
                </a-collapse-panel>
                <!-- <a-collapse-panel key="3" header="功能">
                    <p>waw</p>
                </a-collapse-panel> -->
            </a-collapse>
        </div>
    </div>
</template>

<style scoped lang="less">
// 引入全局样式变量
@import '../../assets/css/variables.less';

.search-result {
    position: absolute;
    top: 100%;
    background: @background-light;
    border: 1px solid @border-color;
    width: 100%;
    left: 0px;
    border-radius: 0.4rem;
    .info-item {
        display: flex;
        padding-left: 0.5rem;
        flex-direction: column;
        background: @border-color-secondary;
        @media (prefers-color-scheme: dark) {
            background: @border-color-secondary-dark;
        }
        border-radius: 3px;
        transition: all 0.3s;

        &:hover {
            background: @hover-primary;
            transform: translateY(-2px);
        }
    }
}
</style>
