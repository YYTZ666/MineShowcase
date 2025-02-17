<script setup lang="ts">
import { NNotificationProvider } from 'naive-ui';
import ServerCard from './ServerCard.vue'
import { ServerAPI } from '../../hooks/api'
import { useRequest } from 'alova/client'

interface Info {
    id: number
    name: string
    type: 'JAVA' | 'BEDROCK'
    version: string
    desc: string
    link: string
    ip: string | null
    is_member: boolean
    is_hide: boolean
    auth_mode: string
    tags: Array<string>
}

const { loading, error, data } = useRequest(ServerAPI.Get<Info[]>('/servers/random/',
        {
            // params: {
            //     offset: 0,
            //     limit: 10
            // }
        }
    )
)
</script>


<template>
    <h1>ServerList</h1>
    <!-- 创建一个容器，用来包含所有的服务器卡片，并将其布局设置为网格布局 -->
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error.message }}</div>
    <div class="grid-list" v-else>
        <NNotificationProvider placement="bottom-right">
            <ServerCard
                v-for="server in data"
                :key="server.id"
                :id="server.id"
                :name="server.name"
                :type="server.type"
                :version="server.version"
                :desc="server.desc"
                :link="server.link"
                :ip="server.ip"
                :is_member="server.is_member"
                :is_hide="server.is_hide"
                :auth_mode="server.auth_mode"
                :tags="server.tags" />
        </NNotificationProvider>
    </div>
</template>

<style scoped lang="less">
.grid-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(25rem, 1fr));
    gap: 20px;
}
</style>
