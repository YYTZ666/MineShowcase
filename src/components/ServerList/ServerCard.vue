<script setup lang="ts">
import IMG_noicon from '../../assets/noicon.svg'
import IMG_noimage from '../../assets/noimage.svg'
import '../../style/style.less'
import { NTag, NInput, NSpace, NInputGroup, useNotification } from 'naive-ui'
import { createAlova } from 'alova';
import adapterFetch from 'alova/fetch';
import { ref, watch } from 'vue'

const alovaInstance = createAlova({
    requestAdapter: adapterFetch(),
    responded: response => response.json()
});

interface Status {
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

const status = ref<Status | undefined>(undefined)

const fetchStatus = async () => {
    try {
        let host = '';
        // 根据 info.type 动态选择 API 地址
        if (info.type === 'JAVA') {
            host = `https://v2.mscpo.giize.com/java/?ip=${info.ip}`;
        } else if (info.type === 'BEDROCK') {
            host = `https://v2.mscpo.giize.com/bedrock/?ip=${info.ip}`;
        }

        const response = await alovaInstance.Get<Status>(host);
        status.value = response;
    } catch (error) {
        console.error('Request failed:', error);
    }
};

fetchStatus()

const statusText = ref("查询中...")
const statusIcon = ref(IMG_noicon)
const statusColor = ref({ color: '#747d8c', textColor: '#dfe6e9' })
const notification = useNotification()

watch(status, (newStatus) => {
    if (newStatus?.online) {
        statusText.value = "在线"
        statusColor.value = { color: '#E3F3EB', textColor: '#18A058' }
        statusIcon.value = newStatus.icon ?? IMG_noicon
    } else {
        statusText.value = "离线"
        statusIcon.value = IMG_noicon
        statusColor.value = { color: '#747d8c', textColor: '#f1f2f6' }
    }
})

const copyToClipboard = (event: MouseEvent) => {
    const input = event.target as HTMLInputElement
    const text = input.value

    navigator.clipboard.writeText(text)
        .then(() => {
            notification.success({
                content: '复制成功！OwO',
                duration: 2500,
                keepAliveOnHover: true
            })
        })
        .catch(() => {
            notification.error({
                content: '复制失败，请重试！QAQ',
                duration: 2500,
                keepAliveOnHover: true
            })
        })
}
</script>


<template>
    <div class="card">
        <div class="card-cover">
            <div class="card-type" v-text="info.type"></div>
            <img :src="IMG_noimage">
        </div>
        <div class="card-split">
            <div class="card-icon">
                <img :src="statusIcon">
            </div>
            <div class="card-info">
                <h1 class="title" v-text="info.name"></h1>
                <div>
                    <n-input-group>
                        <NTag size="small" :color="statusColor" v-text="statusText">
                        </NTag>

                        <n-input placeholder="Error！QAQ" :value="info.ip" readonly="true" size="tiny"
                            @click="copyToClipboard" />
                    </n-input-group>
                </div>
            </div>
        </div>
        <div class="card-tags">
            <n-space>
                <n-tag size="small" :bordered="false" v-for="tag in info.tags" v-text="tag"></n-tag>
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