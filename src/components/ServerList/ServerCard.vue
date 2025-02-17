<script setup lang="ts">
import IMG_noicon from '../../assets/noicon.svg'
import IMG_noimage from '../../assets/noimage.svg'
import '../../style/style.less'
import { ref } from 'vue'
import { NTag, NInput, NSpace, NInputGroup, useNotification } from 'naive-ui'
import { fetch_status } from '../../hooks/api'
import { useRequest } from 'alova/client'
import { invalidateCache } from 'alova'

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
    id: number
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

const host = () => {
    // 根据 info.type 动态选择 API 地址
    if (info.type === 'JAVA') {
        return "/java/"
    } else if (info.type === 'BEDROCK') {
        return "/bedrock/"
    } else {
        return "/"
    }
}

const getStatus = (host: string) =>
    fetch_status.Get<Status>(host, {
        params: {
            ip: info.ip
        },
        cacheFor: {
            mode: "restore",
            expire: 60 * 10 * 1000
        }
    })

const { data, onSuccess, onError } = useRequest(getStatus(host()))

const statusText = ref<string>("查询中...")
const statusIcon = ref<string>(IMG_noicon)
const statusColor = ref<{ color: string; textColor: string }>({ color: '#00C5CD', textColor: '#dfe6e9' })

onSuccess(() => {
    if (data.value.online) {
        statusText.value = "在线"
        statusColor.value = { color: '#E3F3EB', textColor: '#18A058' }
        statusIcon.value = data.value.icon ?? IMG_noicon
    } else {
        statusText.value = "离线"
        statusColor.value = { color: '#747d8c', textColor: '#f1f2f6' }
        statusIcon.value = IMG_noicon
        // 如果服务器不在线失效缓存
        invalidateCache(getStatus(host()))
    }
})

onError(() => {
    statusText.value = "错误"
    statusColor.value = { color: '#E9967A', textColor: '#CD5555' }
    statusIcon.value = IMG_noicon
})

const notification = useNotification()

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
                <img :src="statusIcon" />
            </div>
            <div class="card-info">
                <h1 class="title" v-text="info.name"></h1>
                <div>
                    <n-input-group>
                        <NTag size="small" :color="statusColor" v-text="statusText"></NTag>
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
    border: 2px solid @border-color;
    border-radius: 8px;
    background: #fffefa;
    box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1),
        box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1),
        background 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

    &:hover {
        transform: scale(1.05);
        box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.2);
    }

    .card-cover {
        height: 60%;
        overflow: hidden;
        box-sizing: border-box;
        margin: 0.6rem;
        border: 2px dashed @border-color;
        position: relative;

        .card-type {
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
            border-radius: 5px;
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
        align-items: center;

        .card-info {
            .title {
                margin: 0;
                text-overflow: ellipsis;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                font-size: 1.2rem;
            }
        }

        .card-icon {
            overflow: hidden;
            box-sizing: border-box;
            margin: 0.6rem;
            margin-top: 0;
            height: 4rem;
            width: 4rem;
            border: 2px solid @border-color;
            border-radius: 50%;
            box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
            /* 给头像框加上阴影 */
            display: flex;
            justify-content: center;
            align-items: center;

            img {
                width: 90%;
                height: 90%;
                object-fit: contain;
                border-radius: 50%;
            }
        }
    }

    .card-tags {
        margin-left: 0.6rem;
    }
}
</style>