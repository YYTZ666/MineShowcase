<script setup lang="ts">
import { shallowRef, ref } from 'vue'

const recommendations = shallowRef([
    { label: 'XXX', value: 1, ping: 0 },
    { label: 'XXX', value: 2, ping: 0 },
    { label: 'XXX', value: 3, ping: 0 },
])
</script>

<template>
    <!-- 为您推荐 -->
    <a-card title="为您推荐" class="section recommend-section">
        <a-space direction="vertical">
            <div
                v-for="server in recommendations"
                :key="server.value"
                class="server-item"
            >
                <a-tag :bordered="false" type="success" size="small">
                    {{ server.ping }}ms
                </a-tag>
                <span class="server-name">{{ server.label }}</span>
            </div>
        </a-space>
    </a-card>
</template>

<style scoped lang="less">
@import '@/assets/css/variables.less';

.recommend-section {
    .server-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 0;
        font-size: 14px;
        color: @text-color-light;
        @media (prefers-color-scheme: dark) {
            color: @text-color-dark;
        }
        .server-name {
            font-weight: 500;
            font-size: 14px;
        }
    }
}
</style>
