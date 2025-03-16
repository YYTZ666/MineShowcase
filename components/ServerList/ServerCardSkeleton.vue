<script setup lang="ts">
import IMG_noimage from '../../assets/noimage.webp'
</script>

<template>
    <div class="card skeleton-card">
        <div class="card-cover">
            <div class="skeleton-image"></div>
            <div class="card-type skeleton-text"></div>
        </div>
        <div class="card-split">
            <div class="card-icon skeleton-avatar"></div>
            <div class="card-info">
                <div class="title-box">
                    <div class="skeleton-title"></div>
                </div>
                <div>
                    <div class="skeleton-input"></div>
                </div>
            </div>
        </div>
        <div class="card-tags">
            <div class="skeleton-tag"></div>
            <div class="skeleton-tag"></div>
            <div class="skeleton-tag"></div>
        </div>
    </div>
</template>

<style scoped lang="less">
@keyframes skeleton-loading {
    0% {
        opacity: 0.6;
    }
    50% {
        opacity: 1;
    }
    100% {
        opacity: 0.6;
    }
}

.skeleton-card {
    border: 2px solid #ebedf0;
    border-radius: 8px;
    height: 20rem;
    overflow: hidden;

    .skeleton-image {
        height: 100%;
        background: #f5f5f5;
        animation: skeleton-loading 1.5s infinite;
    }

    .skeleton-text {
        height: 1.5rem;
        width: 6rem;
        background: #e8e8e8;
        animation: skeleton-loading 1.5s infinite;
    }

    .skeleton-avatar {
        background: #e8e8e8 !important;
        animation: skeleton-loading 1.5s infinite;
        border: 2px solid #ebedf0 !important;
    }

    .skeleton-title {
        height: 1.5rem;
        width: 60%;
        background: #e8e8e8;
        animation: skeleton-loading 1.5s infinite;
    }

    .skeleton-subtitle {
        height: 1rem;
        width: 30%;
        background: #e8e8e8;
        margin-left: 8px;
        animation: skeleton-loading 1.5s infinite;
    }

    .skeleton-tag {
        height: 24px;
        width: 60px;
        background: #e8e8e8;
        border-radius: 4px;
        animation: skeleton-loading 1.5s infinite;
        margin: 2px;
    }

    .skeleton-input {
        height: 24px;
        width: 120px;
        background: #e8e8e8;
        border-radius: 4px;
        animation: skeleton-loading 1.5s infinite;
    }

    /* 保留原有布局结构 */
    .card-cover {
        height: 60%;
        margin: 0.6rem;
        border-radius: 4px;
        position: relative;
        overflow: hidden;
    }

    .card-split {
        display: flex;
        align-items: center;
        padding: 0 0.6rem;

        .card-icon {
            height: 4rem;
            width: 4rem;
            border-radius: 50%;
            margin-right: 0.6rem;
        }

        .card-info {
            flex: 1;

            .title-box {
                display: flex;
                align-items: center;
                margin-bottom: 4px;
            }
        }
    }

    .card-tags {
        display: flex;
        padding: 0 0.6rem;
        gap: 4px;
        margin-top: 8px;
    }
}
</style>
