<script setup lang="ts">
import { shallowRef, ref, onMounted, onBeforeUnmount } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

const stats = shallowRef({
    onlinePlayers: 0,
    newServers24h: 0,
})
</script>

<template>
    <div class="content-wrapper">
        <!-- 全站状态 -->
        <a-card class="section stats-section">
            <template #title>
                <div class="card-title" role="heading">全站状态</div>
            </template>
            <a-space direction="vertical">
                <a-statistic title="在线玩家" :value="stats.onlinePlayers" />
                <a-statistic title="24小时新服" :value="stats.newServers24h" />
                <span>更新时间: {{ dayjs().fromNow() }}</span>
            </a-space>
        </a-card>
    </div>
</template>

<style scoped lang="less">
@import '@/assets/css/variables.less';

.content-wrapper {
    padding: 12px;
}
.section {
    width: 100%;
    border-radius: 8px;
    background: #fff;
    @media (prefers-color-scheme: dark) {
        background: @card-dark;
        border: 2px solid @border-color-dark;
    }
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;

    .card-title {
        font-weight: bold;
        font-size: 16px;
        color: @text-color-light;
        @media (prefers-color-scheme: dark) {
            color: @text-color-dark;
        }
        padding: 5px 0;
    }
}
.stats-section {
    .a-statistic {
        margin-bottom: 16px;
        @media (prefers-color-scheme: dark) {
            color: @text-color-dark;
        }

        &:last-child {
            margin-bottom: 0;
        }
    }
    .time-display {
        font-size: 14px;
        color: #595959;
        margin-top: 8px;
    }
}
</style>
