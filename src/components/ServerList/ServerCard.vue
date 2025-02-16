<script setup lang="ts">
import '../../style/style.less'
import { NTag, NInput, NSpace, NInputGroup } from 'naive-ui'
import { createAlova } from 'alova';
import adapterFetch from 'alova/fetch';
import { defineProps, ref, watch } from 'vue'

const alovaInstance = createAlova({
    requestAdapter: adapterFetch(),
    responded: response => response.json()
});

interface status {
    online: boolean
    players: {
        online: number
        max: number
    }
    delay: number
    version: string
    motd: {
        plain: string
        html: string
        minecraft: string
        ansi: string
    }
    icon: string
}

const info = defineProps<{
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
}>()

const status = ref<status>()

const fetchStatus = async () => {
    try {
        const host = "https://v2.mscpo.giize.com/?ip=" + info.ip
        const response = await alovaInstance.Get<status>(host);
        status.value = response;
    } catch (error) {
        console.error('Request  failed:', error);
    }
};

fetchStatus()

const statusText = ref("查询")
const statusicon = ref("https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg")

watch(
    () => status.value,
    () => {
        if (status.value?.online) {
            statusText.value = "在线"
            if (status.value != undefined) {
                statusicon.value = status.value.icon
            } else {
                statusicon.value = "https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
            }
        } else {
            statusText.value = "离线"
            statusicon.value = "https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
        }
    }
)
</script>

<template>
    <div class="card">
        <div class="card-cover">
            <div class="card-type" v-text="info.type"></div>
            <img src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg">
        </div>
        <div class="card-split">
            <div class="card-icon">
                <img :src="statusicon">
            </div>
            <div class="card-info">
                <h1 style="line-height: 0;" v-text="info.name"></h1>
                <div>
                    <n-input-group>
                        <NTag size="small" :style="{ width: '20%' }" type="primary" v-text="statusText"></NTag>
                        <n-input :style="{ width: '80%' }" placeholder="Error！QAQ" :value="info.ip" readonly="true"
                            size="tiny" />
                    </n-input-group>
                </div>
            </div>
        </div>
        <div class="card-tags">
            <n-space>
                <n-tag type="success" size="small" :bordered="false" v-for="tag in info.tags" v-text="tag"></n-tag>
            </n-space>
        </div>
    </div>
</template>

<style scoped lang="less">
@border-color: #ddd;

.card {
    width: 100%;
    height: 20rem;
    box-sizing: border-box;
    border: 1px solid @border-color;
    border-radius: 3px;

    .card-cover {
        height: 60%;
        overflow: hidden;
        box-sizing: border-box;
        margin: 0.6rem;
        border: 1px solid @border-color;
        position: relative;

        .card-type {
            box-sizing: border-box;
            position: absolute;
            height: 1.5rem;
            width: 10rem;
            right: -2.1rem;
            top: 1.5rem;
            line-height: 100%;
            text-align: center;
            transform: rotate(38deg);
            font-size: 1.4rem;
            font-weight: bold;
            color: #000;
            background-color: rgba(255, 255, 255, 0.7);
            border: 1px solid @border-color;
        }

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .card-split {
        max-height: 40%;
        display: flex;

        .card-icon {
            overflow: hidden;
            box-sizing: border-box;
            margin: 0.6rem;
            margin-top: 0;
            height: 4rem;
            width: 4rem;
            border: 1px solid @border-color;
            border-radius: 2px;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
    }

    .card-tags {
        margin-left: 0.6rem;
    }
}
</style>