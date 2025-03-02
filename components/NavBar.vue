<script setup lang="ts">
import { NCard, NTag, NSpace, NButton, NStatistic, NTime } from 'naive-ui'
const recommendations = ref([
    { label: 'XXX', value: 1, ping: 0 },
    { label: 'XXX', value: 2, ping: 0 },
    { label: 'XXX', value: 3, ping: 0 },
])

const stats = {
    onlinePlayers: 0,
    newServers24h: 0,
}
</script>

<template>
    <div class="custom-sider">
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
}
</style>
