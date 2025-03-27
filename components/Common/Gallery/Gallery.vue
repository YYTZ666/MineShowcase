<template>
    <div class="gallery-box">
        <!-- 图片列表 -->
        <div class="items" dir="ltr">
            <div
                v-for="(photo, index) in photos"
                :key="index"
                class="item"
                @click="openModal(photo, index)"
            >
                <img :src="photo.image_url" />
                <div class="info-overlay">
                    <div class="info-content">
                        <h3 class="title">{{ photo.title }}</h3>
                        <p class="description">{{ photo.description }}</p>
                    </div>
                </div>
            </div>
        </div>
        <!-- 显示大图 -->
        <div v-if="isModalOpen" class="modal" @click.self="closeModal">
            <div class="modal-content">
                <img :src="selectedPhoto?.image_url" />
                <div class="modal-controls">
                    <button
                        class="prev-button"
                        @click="prevPhoto"
                        :disabled="currentPhotoIndex === 0"
                    >
                        &lt;
                    </button>
                    <button
                        class="next-button"
                        @click="nextPhoto"
                        :disabled="currentPhotoIndex === photos.length - 1"
                    >
                        &gt;
                    </button>
                </div>
                <div class="modal-info">
                    <h3 class="title">{{ selectedPhoto?.title }}</h3>
                    <p class="description">{{ selectedPhoto?.description }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, toRefs, defineProps } from 'vue'
import { useThrottleFn } from '@vueuse/core'

interface Photo {
    title: string
    description: string
    image_url: string
}

const props = defineProps<{
    photos: Photo[]
}>()

const isModalOpen = ref(false)
const selectedPhoto = ref<Photo | null>(null)
const currentPhotoIndex = ref<number | null>(null)
const { photos } = toRefs(props)

const openModal = (photo: Photo, index: number) => {
    selectedPhoto.value = photo
    currentPhotoIndex.value = index
    isModalOpen.value = true
}

const closeModal = () => {
    isModalOpen.value = false
}

const prevPhoto = () => {
    if (currentPhotoIndex.value! > 0) {
        currentPhotoIndex.value!--
        selectedPhoto.value = photos.value[currentPhotoIndex.value!]
    }
}

const nextPhoto = () => {
    if (currentPhotoIndex.value! < photos.value.length - 1) {
        currentPhotoIndex.value!++
        selectedPhoto.value = photos.value[currentPhotoIndex.value!]
    }
}

// 鼠标拖拽相关变量
const isDragging = ref(false)
const startX = ref(0)
const scrollLeft = ref(0)

const onMouseDown = (e: MouseEvent) => {
    const target = e.currentTarget as HTMLElement
    target.style.cursor = 'grabbing'
    isDragging.value = true
    startX.value = e.pageX
    scrollLeft.value = target.scrollLeft
}

const onMouseMove = (e: MouseEvent) => {
    if (isDragging.value) {
        const x = e.pageX
        const walk = (x - startX.value) * 3
        const target = e.currentTarget as HTMLElement
        target.scrollLeft = scrollLeft.value - walk
    }
}

const scrollToSnapPoint = (target: HTMLElement) => {
    const itemWidth = target.firstElementChild?.clientWidth || 0
    const currentScroll = target.scrollLeft
    const snapIndex = Math.round(currentScroll / itemWidth)
    const snapPosition = snapIndex * itemWidth
    target.scrollTo({
        left: snapPosition,
        behavior: 'smooth',
    })
}

const onMouseUp = (e: MouseEvent) => {
    isDragging.value = false
    const target = e.currentTarget as HTMLElement
    target.style.cursor = 'grab'
    console.log('鼠标已经松开')
    scrollToSnapPoint(target)
}

const onMouseLeave = (e: MouseEvent) => {
    isDragging.value = false
    const target = e.currentTarget as HTMLElement
    target.style.cursor = 'grab'
    scrollToSnapPoint(target)
}
</script>

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
        cursor: grab;

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

/* 模态框样式 */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    max-width: 90%;
    max-height: 90%;
    position: relative;
}

.modal-content img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.modal-info {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0.6) 100%
    );
    color: white;
    padding: 1rem;
    box-sizing: border-box;
}
</style>
