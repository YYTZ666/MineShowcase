<script setup lang="ts">

</script>

<template>
    <div class="card skeleton-card">
        <div class="card-cover">
            <div class="skeleton-box"></div>
        </div>
        <div class="card-split">
            <div class="card-icon">
                <div class="skeleton-circle"></div>
            </div>
            <div class="card-info">
                <div class="title-box">
                    <div class="skeleton-line title-line"></div>
                </div>
                <div class="ip-box">
                    <div class="skeleton-line ipstatus-line"></div>
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
@import '../../assets/css/variables.less';
@skeleton-bg: @primary-light;
@skeleton-gradient: linear-gradient(
    90deg,
    transparent 10%,
    rgba(255, 255, 255, 0.5) 50%,
    transparent 90%
);
@skeleton-animation: skeleton-scroll 1.5s ease-in-out infinite;

.skeleton-base {
    background: @skeleton-bg;
    position: relative;
    overflow: hidden;
    will-change: transform;

    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: @skeleton-gradient;
        animation: @skeleton-animation;
    }
}

.skeleton-box,
.skeleton-circle,
.skeleton-line,
.skeleton-tag {
    .skeleton-base();
}

.skeleton-card {
    border-radius: 8px;
    overflow: hidden;
    height: 20rem;

    .card-cover {
        height: 60%;
        margin: 0.6rem;
        background-color: #fff;

        .skeleton-box {
            height: 100%;
            border-radius: 3px;
        }
    }

    .card-split {
        padding: 0 0.6rem;
        display: flex;

        .card-icon {
            .skeleton-circle {
                width: 4rem;
                height: 4rem;
                border-radius: 50%;
            }
        }

        .card-info {
            flex: 1;

            .skeleton-line {
                border-radius: 4px;
                margin-top: 6px;
                margin-left: 6px;

                &.title-line {
                    height: 2rem;
                    width: 60%;
                    margin-bottom: 0.2rem;
                }
                &.ipstatus-line {
                    height: 1.2rem;
                    width: 30%;
                }
            }
        }
    }

    .card-tags {
        padding: 0 0.6rem;
        display: flex;
        gap: 0.4rem;
        padding-top: 6px;

        .skeleton-tag {
            width: 60px;
            height: 24px;
            border-radius: 3px;
        }
    }
}

@keyframes skeleton-scroll {
    0% {
        transform: translateX(-100%);
    }
    100% {
        transform: translateX(200%);
    }
}
</style>