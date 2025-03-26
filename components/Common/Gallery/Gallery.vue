<script setup lang="ts">
interface Photo {
    title: string
    description: string
    image_url: string
}

const props = defineProps<{
    photos: Photo[]
}>()
</script>

<template>
    <div class="gallery-box">
        <div class="items" dir="ltr">
            <div v-for="photo in props.photos" class="item">
                <img :src="photo.image_url" />
                <div class="info-overlay">
                    <div class="info-content">
                        <h3 class="title">{{ photo.title }}</h3>
                        <p class="description">{{ photo.description }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less">
@import '@/assets/css/variables.less';

.gallery-box {
    overflow: hidden;
    .items {
        border-radius: 4px;
        display: flex;
        overflow: auto;
        column-gap: 1rem;
        height: 20rem;
        justify-content: flex-start;
        scroll-snap-type: x mandatory;
        scroll-behavior: smooth;

        .item {
            position: relative;
            scroll-snap-align: start;
            flex-shrink: 0;
            max-width: 100%;
            max-height: 100%;
            height: 100%;
            border-radius: 2px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

            img {
                height: 100%;
                width: auto;
                object-fit: cover;
                border-radius: 4px;
            }

            &:hover {
                .info-overlay {
                    opacity: 1;
                    .info-content {
                        transform: translateY(0);
                    }
                }
            }
        }
    }
}

.info-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.6) 0%,
        rgba(0, 0, 0, 0.3) 100%
    );
    opacity: 0;
    transition: all 0.3s ease;
    display: flex;
    align-items: flex-end;
    box-sizing: border-box;
    padding: 1rem;
    pointer-events: none;

    .info-content {
        transform: translateY(20px);
        transition: transform 0.3s ease;
        color: #fff;
        width: 100%;

        .title {
            font-size: 1.2em;
            margin-bottom: 0.5rem;
            font-weight: 600;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            .text-overflow(2);
            @media (prefers-color-scheme: dark) {
                color: @text-color-dark;
            }
        }

        .description {
            font-size: 0.9em;
            line-height: 1.4;
            opacity: 0.9;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            @media (prefers-color-scheme: dark) {
                color: @text-color-dark;
            }
        }
    }
}
</style>
