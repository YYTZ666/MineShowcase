<script setup lang="ts">
import dayjs from 'dayjs'
import {
    LikeFilled,
    LikeOutlined,
    DislikeFilled,
    DislikeOutlined,
} from '@ant-design/icons-vue'
import { ref } from 'vue'

import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.locale('zh-cn')
dayjs.extend(relativeTime)

const likes = ref<number>(0)
const dislikes = ref<number>(0)
const action = ref<string>()

const like = () => {
    likes.value = 1
    dislikes.value = 0
    action.value = 'liked'
}

const dislike = () => {
    likes.value = 0
    dislikes.value = 1
    action.value = 'disliked'
}
</script>

<template>
    <a-comment>
        <template #actions>
            <span key="comment-basic-like">
                <a-tooltip title="Like">
                    <template v-if="action === 'liked'">
                        <LikeFilled @click="like" />
                    </template>
                    <template v-else>
                        <LikeOutlined @click="like" />
                    </template>
                </a-tooltip>
                <span style="padding-left: 8px; cursor: auto">
                    {{ likes }}
                </span>
            </span>
            <span key="comment-basic-dislike">
                <a-tooltip title="Dislike">
                    <template v-if="action === 'disliked'">
                        <DislikeFilled @click="dislike" />
                    </template>
                    <template v-else>
                        <DislikeOutlined @click="dislike" />
                    </template>
                </a-tooltip>
                <span style="padding-left: 8px; cursor: auto">
                    {{ dislikes }}
                </span>
            </span>
            <span key="comment-basic-reply-to">回复</span>
        </template>
        <template #author><a>测试</a></template>
        <template #avatar>
            <a-avatar src="https://joeschmoe.io/api/v1/random" alt="测试" />
        </template>
        <template #content>
            <p>这是一个测试文本 此组件尚未实现</p>
        </template>
        <template #datetime>
            <a-tooltip :title="dayjs().format('YYYY-MM-DD HH:mm:ss')">
                <span>{{ dayjs().fromNow() }}</span>
            </a-tooltip>
        </template>
    </a-comment>
</template>

<style lang="less" scoped></style>
