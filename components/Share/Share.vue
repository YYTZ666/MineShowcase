<script setup lang="ts">
const props = defineProps<{
    desc: string
}>()

const location = ref('')

onMounted(() => {
    location.value = window.location.href
})

const shareToWeibo = () => {
    if (typeof window !== 'undefined') {
        const title = document.title
        window.open(
            'https://service.weibo.com/share/share.php?url=' +
                encodeURIComponent(window.location.href) +
                '&title=' +
                title,
        )
        window.open(
            'https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' +
                encodeURIComponent(window.location.href) +
                '&title=' +
                title +
                '&summary=' +
                props.desc,
        )
    }
}

const shareToQQ = () => {
    if (typeof window !== 'undefined') {
        const title = document.title
        window.open(
            'https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' +
                encodeURIComponent(window.location.href) +
                '&title=' +
                title +
                '&summary=' +
                props.desc,
        )
    }
}

const copyToClipboard = () => {
    navigator.clipboard
        .writeText(location.value)
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
    <div class="share-box">
        <div class="share-icons">
            <a-tooltip title="分享到QQ">
                <div class="share-icon" @click="shareToQQ">
                    <QqOutlined />
                </div>
            </a-tooltip>

            <a-tooltip title="分享到微博">
                <div class="share-icon" @click="shareToWeibo">
                    <WeiboOutlined />
                </div>
            </a-tooltip>
        </div>

        <a-input-group compact>
            <a-input
                :value="location ?? '加载中...'"
                readonly
                style="
                    width: auto;
                    min-width: 120px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                "
            />
            <a-button @click="copyToClipboard">复制</a-button>
        </a-input-group>
    </div>
</template>

<style lang="less" scoped>
@import '@/assets/css/variables.less';

.share-box {
    display: flex;
    gap: 1rem;
    .share-icons {
        display: flex;
        gap: 1rem;

        .share-icon {
            width: 32px;
            height: 32px;
            border-radius: 1rem;
            word-break: break-all;
            color: @accent;
            text-decoration: none;
            display: flex;
            justify-content: center;
            cursor: pointer;
            align-items: center;
            font-size: 1.5rem;
            text-align: center;
            transition: all 0.3s ease;
            &:hover {
                background: @hover-primary;
                transform: scale(1.2);
            }
        }
    }
}
</style>
