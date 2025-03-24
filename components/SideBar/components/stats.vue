<script setup lang="ts">
import { shallowRef, ref } from 'vue'
import Time from '../../Common/Time/Time.vue'

const stats = shallowRef({
    onlinePlayers: 0,
    newServers24h: 0,
})
</script>

<template>
    <!-- 全站状态 -->
    <a-card title="全站状态" class="section stats-section">
        <a-space direction="vertical">
            <a-statistic title="在线玩家" :value="stats.onlinePlayers" />
            <a-statistic title="24小时新服" :value="stats.newServers24h" />
            <Time
                :time="new Date()"
                format="YYYY-MM-DD HH:mm:ss"
                type="relative"
            />
        </a-space>
    </a-card>
</template>

<style scoped lang="less">
@import '@/assets/css/variables.less';

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
