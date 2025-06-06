<script setup lang="ts">
import lozad from 'lozad'
import IMG_noimage from '@/assets/noimage.webp'
import IMG_noicon from '@/assets/noicon.svg'
import { ref, onMounted, watch } from 'vue'
import type { Status } from '@/api/models'
import { notification } from 'ant-design-vue'

const observer = lozad()
observer.observe()
const router = useRouter()
const info = defineProps<Status>()

// 设置 Intersection Observer 相关
const cardRef = ref<HTMLElement | null>(null)
const isCardVisible = ref(false)
const hasFetched = ref(false)

onMounted(() => {
    if (cardRef.value) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                isCardVisible.value = true
                observer.disconnect()
            }
        })
        observer.observe(cardRef.value)
    }
})

// 状态数据及加载标记
const Loading = ref(true)
const statusText = ref<string>('')
const statusIcon = ref<string>(IMG_noicon)
const statusColor = ref<string>('default')
const StatusInfo = ref<Status>({
    id: info.id,
    name: info.name,
    ip: null,
    type: '' as 'JAVA' | 'BEDROCK',
    version: '',
    desc: '',
    link: '',
    is_member: true,
    is_hide: true,
    auth_mode: 'OFFICIAL',
    tags: [],
    status: null,
    code: 200,
    detail: undefined,
    permission: 'guest',
    cover_url: null,
})

// 延迟加载：只有当卡片进入视口且未发起请求时再请求状态数据
const fetchStatus = () => {
    Loading.value = false
    StatusInfo.value = info
    if (info.status) {
        statusText.value = '在线'
        statusColor.value = 'success'
        statusIcon.value = info.status.icon ?? IMG_noicon
    } else {
        statusText.value = '离线'
        statusColor.value = 'error'
        statusIcon.value = IMG_noicon
    }
}

// 当卡片可见时触发 API 请求
watch(isCardVisible, (visible) => {
    if (visible && !hasFetched.value) {
        fetchStatus()
        hasFetched.value = true
    }
})

// 点击卡片跳转
const handleCardClick = () => {
    router.push(`/details/${info.id}`)
}

// 简单的数字格式化函数
const formatNumber = (num: number): string => {
    if (num >= 100000000) {
        return `${(num / 100000000).toFixed(2)} 亿`
    } else if (num >= 10000) {
        return `${(num / 10000).toFixed(2)} 万`
    }
    return num.toString()
}

const copyToClipboard = (event: MouseEvent) => {
    const input = event.target as HTMLInputElement
    const text = input.value

    navigator.clipboard
        .writeText(text)
        .then(() => {
            notification.success({
                message: '复制成功！OwO',
                duration: 2.5,
            })
        })
        .catch(() => {
            notification.error({
                message: '复制失败，请重试！QAQ',
                duration: 2.5,
            })
        })
}
</script>

<template>
    <!-- 为根节点绑定 ref 以供 Intersection Observer 监听 -->
    <div ref="cardRef" class="card" @click="handleCardClick">
        <div class="card-cover">
            <canvas ref="canvas" style="display: none"></canvas>
            <img
                :src="cover_url || IMG_noimage"
                alt="无图片"
                class="lozad"
                :class="{ noimg: !cover_url }"
                rel="preload"
                as="image"
            />
            <div class="card-type" v-text="StatusInfo.type"></div>
        </div>
        <div class="card-split">
            <div class="card-icon">
                <img
                    :src="statusIcon"
                    class="lozad"
                    :alt="StatusInfo.name + '的服务器图标'"
                />
            </div>
            <div class="card-info">
                <div class="title-box">
                    <h1 class="title">{{ info.name }}</h1>
                    <!-- 当状态数据加载后显示玩家人数 -->
                    <span v-if="StatusInfo.status" class="t_player_num">
                        ({{ formatNumber(StatusInfo.status.players.online) }} /
                        {{ formatNumber(StatusInfo.status.players.max) }})
                    </span>
                </div>
                <div>
                    <a-input-group compact>
                        <a-tag
                            style="height: 24px"
                            :color="statusColor"
                            v-text="statusText"
                        ></a-tag>
                        <a-input
                            @click.stop="copyToClipboard"
                            :value="StatusInfo.ip ?? '加载中...'"
                            readonly
                            role="presentation"
                            size="small"
                            style="
                                width: auto;
                                min-width: 120px;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            "
                        />
                    </a-input-group>
                </div>
            </div>
        </div>
        <div class="card-tags">
            <a-space size="small" class="tags-wrapper">
                <a-tag
                    size="small"
                    :bordered="false"
                    :color="
                        StatusInfo.auth_mode === 'OFFLINE'
                            ? 'green'
                            : StatusInfo.auth_mode === 'OFFICIAL'
                              ? 'orange'
                              : 'pink'
                    "
                    v-text="
                        StatusInfo.auth_mode === 'OFFLINE'
                            ? '离线服'
                            : StatusInfo.auth_mode === 'OFFICIAL'
                              ? '正版服'
                              : StatusInfo.auth_mode === 'YGGDRASIL'
                                ? '外置登录'
                                : '未知'
                    "
                ></a-tag>
                <a-tooltip v-if="StatusInfo.is_member === true">
                    <template #title>
                        <span>
                            此服务器是集体宣传组织的成员服
                            <br />
                            我们可以确保其可以长期运行
                        </span>
                    </template>
                    <a-tag size="small" :bordered="false" type="info">
                        成员服
                    </a-tag>
                </a-tooltip>
                <a-tooltip v-for="(tag, index) in StatusInfo.tags.slice(0, 4)">
                    <template #title>
                        <span v-text="tag"></span>
                    </template>
                    <a-tag
                        :key="index"
                        size="small"
                        :bordered="false"
                        :title="tag"
                        v-text="tag"
                    />
                </a-tooltip>
            </a-space>
        </div>
    </div>
</template>

<style scoped lang="less">
@import '@/assets/css/variables.less';

.card {
    overflow: hidden;
    height: 19rem;
    box-sizing: border-box;
    border: 1px solid @border-color;
    @media (prefers-color-scheme: dark) {
        border: 1px solid @border-color-dark;
        background-color: @card-dark;
    }
    border-radius: 2px;
    box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.1);
    transition:
        transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1),
        box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1),
        background 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

    &:hover {
        transform: scale(1.01);
        box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.2);
    }

    .card-cover {
        height: 60%;
        overflow: hidden;
        box-sizing: border-box;
        margin-block-end: 0.6rem;
        background-color: #fff;

        border-block-end: 1px dashed @border-color;
        @media (prefers-color-scheme: dark) {
            background-color: @border-color-dark;
            border-block-end: 1px dashed @border-color-dark;
        }
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
            font-size: 1.2rem;
            font-weight: bold;
            color: @text-color-light;
            background-color: @border-color;
            opacity: 0.8;
            border: 1px solid @border-color;
            @media (prefers-color-scheme: dark) {
                color: @text-color-dark;
                background-color: @border-color-dark;
                border: 1px solid @border-color-dark;
            }
        }

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            @media (prefers-color-scheme: dark) {
                filter: brightness(70%);
            }
        }
        .noimg {
            width: 50%;
            height: auto;
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
            .title-box {
                display: flex;
                align-items: center;

                .title {
                    margin: 0;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    display: -webkit-box;
                    line-clamp: 1;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    font-size: 1.3rem;
                }

                .t_player_num {
                    font-weight: bold;
                    font-size: 0.8rem;
                    color: #4a515a;
                    line-clamp: 1;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                }
            }
        }

        .card-icon {
            overflow: hidden;
            box-sizing: border-box;
            margin: 0.6rem;
            margin-top: 0;
            height: 4rem;
            min-height: 4rem;
            width: 4rem;
            min-width: 4rem;
            border: 1px solid @border-color;
            box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
            display: flex;
            justify-content: center;
            align-items: center;
            @media (prefers-color-scheme: dark) {
                border: 1px solid @border-color-secondary-dark;
                filter: brightness(70%);
            }
            img {
                width: 90%;
                height: 90%;
                object-fit: contain;
            }
        }
    }

    .card-tags {
        box-sizing: border-box;
        display: flex;
        padding-inline: 0.6rem;
        gap: 0.3rem;
        height: 22px;
        flex-wrap: wrap;
        overflow-y: auto;
        scrollbar-width: none;

        &::-webkit-scrollbar {
            display: none;
        }
    }
}
</style>
