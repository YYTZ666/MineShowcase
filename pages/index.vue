<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Logo from '@/assets/logo.svg'
import GridBackground from '@/components/Background/GridBackground.vue'

// 设置使用home布局，仅首页使用
definePageMeta({
    layout: 'home',
})

// 设置页面标题
useHead({
    title: 'Minecraft集体宣传组织(MSCPO)',
})

const isLoaded = ref(false)
const showContent = ref(false)

onMounted(() => {
    // 添加加载动画效果
    setTimeout(() => {
        isLoaded.value = true
        setTimeout(() => {
            showContent.value = true
        }, 500)
    }, 300)
})
</script>

<template>
    <div class="home-container" :class="{ loaded: isLoaded }">
        <GridBackground />
        <div class="content-wrapper" :class="{ show: showContent }">
            <div class="logo-container">
                <img :src="Logo" alt="MSCPO Logo" class="logo" />
                <h1 class="main-title">
                    MINECRAFT
                    <br />
                    <span>集体宣传组织</span>
                </h1>
            </div>

            <div class="description">
                <p>Minecraft 服务器宣传与技术交流平台</p>
                <p>提供服务器列表、教程和集体宣传</p>
            </div>

            <div class="cta-container">
                <NuxtLink to="/serverlist" class="cta-button primary">
                    <span>浏览服务器列表</span>
                </NuxtLink>
                <NuxtLink to="/about" class="cta-button secondary">
                    <span>关于我们</span>
                </NuxtLink>
            </div>

            <div class="features">
                <div class="feature-item">
                    <a-badge status="processing" text="服务器宣传" />
                </div>
                <div class="feature-item">
                    <a-badge status="processing" text="技术交流" />
                </div>
                <div class="feature-item">
                    <a-badge status="processing" text="资源分享" />
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.home-container {
    min-height: 85vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    position: relative;
    overflow: hidden;
    padding: 1rem;
    color: #333;
    transition:
        opacity 0.8s ease,
        background-color 0.3s ease;
    opacity: 0;
    background-color: transparent;

    &.loaded {
        opacity: 1;
    }

    .content-wrapper {
        position: relative;
        max-width: 500px;
        width: 100%;
        transform: translateY(30px);
        opacity: 0;
        transition: all 0.8s ease;
        margin-left: max(5%, 1rem);
        user-select: none;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        padding: 1.5rem;
        border-radius: 8px;

        &.show {
            transform: translateY(0);
            opacity: 1;
        }

        .logo-container {
            margin-bottom: 1.5rem;
            display: flex;
            flex-direction: column;
            align-items: flex-start;

            .logo {
                width: clamp(80px, 15vw, 120px);
                height: clamp(80px, 15vw, 120px);
                margin-bottom: 1rem;
                filter: drop-shadow(0 0 10px rgba(0, 168, 232, 0.7));
                animation: pulse 3s infinite ease-in-out;
            }

            .main-title {
                font-size: clamp(1.8rem, 6vw, 3rem);
                font-weight: 800;
                letter-spacing: 1px;
                margin: 0;
                line-height: 1.2;
                background: linear-gradient(135deg, #619787 0%, #00a8e8 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;

                span {
                    font-size: clamp(1.2rem, 3.5vw, 2rem);
                    font-weight: 600;
                }
            }
        }

        .description {
            margin-bottom: 2rem;
            font-size: clamp(0.95rem, 3vw, 1.2rem);
            line-height: 1.5;
            color: rgba(255, 255, 255, 0.85);

            p {
                margin: 0.5rem 0;
            }
        }

        .cta-container {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
            flex-wrap: wrap;

            .cta-button {
                display: inline-flex;
                justify-content: center;
                padding: 0.8rem 1.5rem;
                border-radius: 8px;
                text-decoration: none;
                font-weight: 600;
                font-size: clamp(0.9rem, 3.5vw, 1.1rem);
                letter-spacing: 1px;
                position: relative;
                overflow: hidden;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(110, 110, 110, 0.3);
                min-width: 140px;
                text-align: center;

                &::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(255, 255, 255, 0.1);
                    transform: translateX(-100%);
                    transition: all 0.3s ease;
                }

                &:hover::before {
                    transform: translateX(0);
                }

                &.primary {
                    background: linear-gradient(
                        135deg,
                        #00a8e8 0%,
                        #0077cc 100%
                    );
                    color: white;
                    border: none;

                    &:hover {
                        transform: translateY(-3px);
                        box-shadow: 0 7px 20px rgba(0, 168, 232, 0.4);
                    }
                }

                &.secondary {
                    background: transparent;
                    color: white;
                    border: 2px solid rgba(0, 168, 232, 0.7);

                    &:hover {
                        background: rgba(255, 255, 255, 0.1);
                        transform: translateY(-3px);
                    }
                }
            }
        }

        .features {
            display: flex;
            gap: 1rem;
            width: 100%;

            .feature-item {
                padding: 0.4rem 1.2rem;
                background: rgba(0, 168, 232, 0.15);
                border-radius: 3px;
                backdrop-filter: blur(5px);
                border: 1px solid rgba(0, 168, 232, 0.3);
                transition: all 0.3s ease;
                font-size: 0.95rem;

                &:hover {
                    background: rgba(0, 168, 232, 0.25);
                    transform: translateY(-2px);
                }
            }
        }
    }

    @keyframes pulse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
        100% {
            transform: scale(1);
        }
    }

    /* 响应式设计 */
    @media (max-width: 768px) {
        padding: 1rem;

        .content-wrapper {
            margin: 0 auto;
            padding: 1.5rem;
            width: 90%;
            max-width: none;
            backdrop-filter: blur(8px);

            .cta-container {
                flex-direction: column;

                .cta-button {
                    min-width: auto;
                    padding: 1rem;
                }
            }

            .features {
                flex-direction: column;
                gap: 0.8rem;

                .feature-item {
                    text-align: center;
                    padding: 0.8rem;
                }
            }
        }
    }

    @media (max-width: 480px) {
        .content-wrapper {
            padding: 1rem;

            .logo-container {
                .main-title {
                    font-size: clamp(1.5rem, 7vw, 2rem);

                    span {
                        font-size: clamp(1rem, 4.5vw, 1.2rem);
                    }
                }
            }

            .description {
                font-size: 0.9rem;
                margin-bottom: 1.5rem;
            }

            .cta-container .cta-button {
                font-size: 0.95rem;
            }
        }
    }
}
</style>
