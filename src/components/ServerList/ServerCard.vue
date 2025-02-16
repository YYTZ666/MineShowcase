<script setup lang="ts">
import IMG_noicon from '../../assets/noicon.svg'
import IMG_noimage from '../../assets/noimage.svg'
import '../../style/style.less'
import { NTag, NInput, NSpace, NInputGroup } from 'naive-ui'
import { createAlova } from 'alova';
import adapterFetch from 'alova/fetch';
import { ref, watch } from 'vue'

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

const statusText = ref("查询中...")
const statusicon = ref(IMG_noicon)

watch(
    () => status.value,
    () => {
        if (status.value?.online) {
            statusText.value = "在线"
            if (status.value != undefined) {
                if (status.value.icon != null) {
                    statusicon.value = status.value.icon
                } else {
                    statusicon.value = IMG_noicon
                }
            } else {
                statusicon.value = IMG_noicon
            }
        } else {
            statusText.value = "离线"
            statusicon.value = IMG_noicon
        }
    }
)
</script>

<template>
    <div class="card">
        <div class="card-cover">
            <div class="card-type" v-text="info.type"></div>
            <img :src="IMG_noimage">
        </div>
        <div class="card-split">
            <div class="card-icon">
                <img :src="statusicon">
            </div>
            <div class="card-info">
                <h1 class="title" v-text="info.name"></h1>
                <div>
                    <n-input-group>
                        <NTag size="small" type="primary" v-text="statusText"></NTag>
                        <n-input placeholder="Error！QAQ" :value="info.ip" readonly="true" size="tiny" />
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
            max-width: 50%;
            max-height: 50%;
            object-fit: contain;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }

    .card-split {
        max-height: 40%;
        display: flex;

        .card-info {
            .title {
                margin: 0;
                text-overflow: ellipsis;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
            }
        }

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