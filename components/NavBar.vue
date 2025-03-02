<script setup lang="ts">
import { NCard, NTag, NSpace, NButton, NStatistic, NTime } from 'naive-ui'
const recommendations = ref([
    { label: 'XXX', value: 1, ping: 0 },
    { label: 'XXX', value: 2, ping: 0 },
    { label: 'XXX', value: 3, ping: 0 },
])

const filters = ref({
    modes: ['XXX', 'XXX', 'XXX', 'XXX'],
    tags: ['XXX', 'XXX', 'XXX', 'XXX'],
})

const stats = {
    onlinePlayers: 0,
    newServers24h: 0,
}

import { NIcon } from 'naive-ui'
import { CloseOutline } from '@vicons/ionicons5'

const emit = defineEmits(['close'])
</script>

<template>
    <div class="custom-sider">
        <!-- 移动端关闭按钮 -->
        <div class="mobile-close">
            <n-button text class="close-btn" @click="emit('close')">
                <n-icon :component="CloseOutline" size="24" />
            </n-button>
        </div>

        <!-- 滚动容器 -->
        <div class="content-wrapper">
            <!-- 智能推荐模块 -->
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

            <!-- 实时数据看板 -->
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
                        :time="Date.now()"
                        update-interval="60000"
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
    transition: transform 0.3s ease;

    // 移动端关闭按钮
    .mobile-close {
        display: none;
    }

    // 内容区域
    .content-wrapper {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        scrollbar-width: none;
        &::-webkit-scrollbar {
            display: none;
        }
    }

    // 卡片通用样式
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

    // 推荐服务器列表
    .recommend-section {
        .server-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 2px 0;

            .server-name {
                font-size: 13px;
            }
        }
    }

    // 筛选区域
    .filter-section {
        .mode-select {
            width: 100%;
        }

        .tag-cloud {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            padding: 8px 0;
        }

        .tag-item {
            margin: 2px;
        }
    }

    // 统计面板
    .stats-section {
        .n-statistic {
            margin-bottom: 12px;

            &:last-child {
                margin-bottom: 0;
            }
        }

        .time-display {
            margin-top: 8px;
            font-size: 14px;
            color: #666;
        }
    }

    // 社区讨论
    .community-section {
        .post-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 8px 0;

            .post-content {
                flex: 1;
                min-width: 0;

                .post-title {
                    font-size: 14px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .reply-count {
                    margin-top: 4px;
                }
            }
        }

        .forum-btn {
            margin-top: 12px;
        }
    }

    // 移动端适配
    @media (max-width: 1200px) {
        position: fixed;
        left: 0;
        top: 0;
        z-index: 1001;
        box-shadow: 4px 0 12px rgba(0, 0, 0, 0.15);
        transform: translateX(-100%);

        &.active {
            transform: translateX(0);
        }

        .mobile-close {
            display: block;
            height: 46px;
            padding: 8px;
            text-align: right;
            border-bottom: 1px solid #f0f0f0;
            background: #fff;
            position: sticky;
            top: 0;
            z-index: 1;
        }
    }
}
</style>
