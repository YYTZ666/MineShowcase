<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Logo from '@/assets/newhomelogo.webp'


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
const currentFeatureIndex = ref(0)
const features = [
    { title: "服务器宣传", description: "一站式服务器推广解决方案" },
    { title: "技术交流", description: "分享技术经验" },
    { title: "资源分享", description: "优质资源共享" }
]
const stats = ref({
    serverCount: 0,
    onlinePlayers: 0,
    totalViews: 0
})
let autoPlayInterval = null

onMounted(() => {
    // 初始化页面动画
    setTimeout(() => {
        isLoaded.value = true
        setTimeout(() => {
            showContent.value = true
        }, 500)
    }, 300)

    // 特性自动轮播
    startAutoPlay()
    
    // 获取统计数据
    fetchStats()
})

// 特性展示自动轮播
function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
        currentFeatureIndex.value = (currentFeatureIndex.value + 1) % features.length
    }, 3000)
}

// 停止自动轮播
function stopAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval)
    }
}

// 显示特定特性
function showFeature(index: number) {
    currentFeatureIndex.value = index
}

// 获取统计数据
async function fetchStats() {
    try {
        const cacheKey = 'playerCountCache'
        const cacheDuration = 10 * 60 * 1000 // 10分钟
        const now = Date.now()

        // 检查本地缓存
        const cachedData = localStorage.getItem(cacheKey)
        if (cachedData) {
            const { timestamp, data } = JSON.parse(cachedData)
            if (now - timestamp < cacheDuration) {
                stats.value.onlinePlayers = data.total_players || 0
                return
            }
        }

        const response = await fetch('https://mscpoapi.crashvibe.cn/v1/servers/players')
        if (response.ok) {
            const data = await response.json()
            stats.value.onlinePlayers = data.total_players || 0
            
            // 缓存新数据
            localStorage.setItem(cacheKey, JSON.stringify({ timestamp: now, data }))
        }
    } catch (error) {
        console.error('Error fetching stats:', error)
    }
}

// 创建波纹效果
function createRipple(event) {
    const button = event.currentTarget
    const ripple = document.createElement('div')
    
    ripple.classList.add('ripple')
    const rect = button.getBoundingClientRect()
    
    ripple.style.left = `${event.clientX - rect.left}px`
    ripple.style.top = `${event.clientY - rect.top}px`
    
    button.appendChild(ripple)
    setTimeout(() => ripple.remove(), 1000)
}

// 处理鼠标移动高亮效果
function handleMouseMove(event, element) {
    const rect = element.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    
    const highlight = element.querySelector('.feature-highlight')
    if (highlight) {
        highlight.style.setProperty('--x', `${x}%`)
        highlight.style.setProperty('--y', `${y}%`)
    }
}
</script>

<template>
    <div class="home-container">
        <div class="lighting-container">
            <div class="ambient-light"></div>
            <div class="spotlight"></div>
            <div class="glow"></div>
            <div class="particles"></div>
            <div class="refraction"></div>
        </div>
        
        <main class="card-container">
            <div class="stats-panel">
                <div class="stat-group">
                    <div class="stat-item">
                        <div class="stat-value" :data-value="stats.serverCount">{{ stats.serverCount }}</div>
                        <div class="stat-label">服务器</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value" :data-value="stats.onlinePlayers">{{ stats.onlinePlayers }}</div>
                        <div class="stat-label">在线玩家</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value" :data-value="stats.totalViews">{{ stats.totalViews }}</div>
                        <div class="stat-label">访问量</div>
                    </div>
                </div>
            </div>
            <div class="info-card" :class="{ active: isLoaded }">
                <div class="card-glow"></div>
                <div class="card-content" :class="{ show: showContent }">
                    <div class="brand">
                        <div class="logo-container">
                            <img :src="Logo" alt="MSCPO Logo" class="logo">
                        </div>
                    </div>

                    <p class="tagline">MSCPO<br>助力打造优质游戏社区</p>

                    <div class="feature-showcase">
                        <div class="feature-card" 
                            @mouseenter="stopAutoPlay" 
                            @mouseleave="startAutoPlay">
                            <div v-for="(feature, index) in features" 
                                :key="index"
                                class="feature-content" 
                                :class="{ current: index === currentFeatureIndex }" 
                                :data-index="index"
                                @mousemove="(e) => handleMouseMove(e, $event.currentTarget)">
                                <div class="feature-highlight"></div>
                                <div class="feature-text">
                                    <h3>{{ feature.title }}</h3>
                                    <p>{{ feature.description }}</p>
                                </div>
                            </div>
                            <div class="feature-indicators">
                                <div v-for="(feature, index) in features" 
                                    :key="index"
                                    class="indicator" 
                                    :class="{ active: index === currentFeatureIndex }"
                                    @click="showFeature(index)"></div>
                            </div>
                        </div>
                    </div>

                    <div class="actions">
                        <NuxtLink to="/serverlist" class="action-button btn-primary" @click="createRipple">
                            <span class="btn-text">立即体验</span>
                            <div class="btn-glow"></div>
                        </NuxtLink>
                        <NuxtLink to="/about" class="action-button btn-secondary" @click="createRipple">
                            <span class="btn-text">了解使命</span>
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<style scoped lang="less">
:root {
  --bg-dark: #f0f7ff;
  --card-bg: rgba(255, 255, 255, 0.92);
  --card-hover: rgba(237, 242, 247, 0.95);
  --accent-1: #4299e1;
  --accent-2: #3182ce;
  --surface-1: rgba(235, 248, 255, 0.65);
  --surface-2: rgba(224, 242, 254, 0.75);
  --text-primary: #2c5282;
  --text-secondary: #4a5568;
  --text-muted: #718096;
  --glow: rgba(66, 153, 225, 0.25);
  --highlight: rgba(66, 153, 225, 0.15);
  --glow-color-1: rgba(66, 153, 225, 0.3);
  --glow-color-2: rgba(49, 130, 206, 0.3);
  --transition-bezier: cubic-bezier(0.16, 1, 0.3, 1);
  --accent: #316cb4;
  --accent-hover: #2d5e98;
  --text: #fff;
  --blur-bg: rgba(15, 23, 42, 0.8);
  --border-light: rgba(255, 255, 255, 0.1);
  --transition: all .3s ease;
}

.home-container {
  margin: 0;
  overflow: hidden;
  background: #0d1117;
  width: 100vw;
  height: 100vh;
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
}

.lighting-container {
  position: absolute;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  opacity: 0;
  animation: fadeIn 3s ease-in-out forwards;
  z-index: -1;
}

.ambient-light {
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, rgba(71, 144, 252, 0.3), rgba(20, 40, 120, 0.1), rgba(71, 144, 252, 0.3));
  animation: ambientPulse 6s ease-in-out infinite;
  mix-blend-mode: soft-light;
}

@keyframes ambientPulse {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 0.9; transform: scale(1.05); }
}

.spotlight, .glow, .particles, .refraction {
  position: absolute;
  inset: 0;
}

.spotlight {
  background: radial-gradient(circle at 35% 35%, rgba(100, 160, 255, 0.5) 0%, rgba(70, 130, 240, 0.4) 20%, 
    rgba(50, 100, 220, 0.3) 40%, rgba(40, 80, 200, 0.1) 60%, rgba(30, 60, 180, 0) 80%);
  opacity: 0.95;
  mix-blend-mode: screen;
  animation: spotlightMove 12s ease-in-out infinite;
  filter: blur(10px);
}

.card-container {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 5%;
  pointer-events: none;
}

.info-card {
  position: relative;
  width: calc(min(92vw, 820px) * 0.55);
  height: 100vh;
  margin: 0;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.08), 0 4px 12px rgba(0, 0, 0, 0.1), 0 8px 24px rgba(0, 0, 0, 0.1);
  transform: translateX(-20px) rotate3d(1, 1, 0, 15deg);
  transform-origin: left center;
  opacity: 0;
  transition: all 0.6s var(--transition-bezier);
  pointer-events: auto;
  will-change: transform, opacity;
}

.info-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01));
  pointer-events: none;
}

.info-card::after {
  content: '';
  position: absolute;
  inset: -1px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  transform: translateZ(-10px);
  opacity: 0;
  transition: opacity 0.8s ease-out;
  pointer-events: none;
}

.info-card.entering::after {
  opacity: 1;
}

.info-card.active {
  transform: translateX(0) rotate3d(0, 0, 0, 0deg);
  opacity: 1;
}

.info-card:not(.active) {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background: var(--bg-dark);
}

.info-card:not(.active) .card-content {
  opacity: 0;
  transform: translateY(20px);
}

.card-glow {
  position: absolute;
  bottom: -150px;
  left: -20%;
  width: 140%;
  height: 200px;
  background: radial-gradient(ellipse at center, var(--glow-color-1), var(--glow-color-2), transparent 70%);
  filter: blur(20px);
  opacity: 0;
  transform: translateY(30px);
  animation: glowPulse 3s ease-in-out infinite;
}

.info-card.active .card-glow {
  opacity: 1;
  transform: translateY(0);
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
}

.card-content {
  position: relative;
  z-index: 1;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s var(--transition-bezier);
  padding: 3.5rem 2.5rem;
  height: 100%;
  max-width: 680px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  justify-content: space-between;
  min-height: 100vh;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent);
}

.card-content > * {
  opacity: 0;
  transform: translateY(20px);
}

.info-card.active .card-content {
  opacity: 1;
  transform: translateY(0);
}

.info-card.active .card-content > * {
  animation: slideUpFade 0.6s var(--transition-bezier) forwards;
}

.info-card.active .brand {
  animation-delay: 0.1s;
}

.info-card.active .tagline {
  animation-delay: 0.2s;
}

.info-card.active .feature-showcase {
  animation-delay: 0.3s;
}

.info-card.active .actions {
  animation-delay: 0.4s;
}

.logo-container {
  position: relative;
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  overflow: visible;
}

.logo {
  width: auto;
  height: 130px;
  object-fit: contain;
  filter: drop-shadow(0 0 20px var(--glow));
  image-rendering: -webkit-optimize-contrast;
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
  will-change: transform;
}

.brand {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 0.8rem;
  gap: 1.2rem;
}

.tagline {
  font-size: 1.4rem;
  color: var(--text-secondary);
  font-weight: 500;
  margin: 0 0 1rem 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  text-align: left;
  line-height: 1.7;
  max-width: 540px;
}

.card-content,
.card-content p,
.card-content h3,
.tagline {
  color: var(--card-text-color, #ffffff);
}

.feature-showcase {
  margin: 0;
  position: relative;
  max-width: 100%;
}

.feature-card {
  background: rgba(255, 255, 255, 0.03);
  padding: 3rem;
  position: relative;
  overflow: hidden;
  min-height: 200px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  transition: all 0.3s ease;
  animation: float 6s ease-in-out infinite;
}

.feature-card:hover {
  background: rgba(255, 255, 255, 0.05);
}

.feature-content {
  position: absolute;
  inset: 0;
  padding: 2rem;
  opacity: 0;
  transform: translateX(30px) scale(0.98);
  transition: all 0.6s var(--transition-bezier);
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.feature-content.current {
  opacity: 1;
  transform: translateX(0) scale(1);
}

.feature-text {
  flex-grow: 1;
  z-index: 1;
}

.feature-text h3 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 500;
}

.feature-text p {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.8;
}

.feature-highlight {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at var(--x, 50%) var(--y, 50%), var(--highlight), transparent 100%);
  opacity: 0;
  transition: opacity 0.3s;
}

.feature-content:hover .feature-highlight {
  opacity: 1;
}

.feature-indicators {
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background: rgba(255, 255, 255, 0.9);
  transform: scale(1.2);
}

.action-button {
  position: relative;
  padding: 1rem 2rem;
  height: 3.5rem;
  font: 500 1rem/1 'Inter', sans-serif;
  color: var(--text);
  border: 0;
  cursor: pointer;
  transition: var(--transition);
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
  overflow: hidden;
}

.btn-primary {
  background: rgba(49, 108, 180, 0.15);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
}

.btn-primary:hover {
  background: rgba(49, 108, 180, 0.25);
  transform: translateY(-2px);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2), 0 4px 15px rgba(0, 0, 0, 0.1);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.btn-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(255, 255, 255, 0.2), transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.btn-primary:hover .btn-glow {
  opacity: 1;
}

.actions {
  display: flex;
  gap: 1rem;
  margin: 1rem 0 0;
  justify-content: stretch;
  width: 100%;
}

.action-button {
  flex: 1;
  min-width: 160px;
}

.ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: scale(0);
  animation: ripple 0.8s linear;
  pointer-events: none;
}

.stats-panel {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  z-index: 100;
}

.stat-group {
  display: flex;
  gap: 1.25rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 0 20px rgba(66, 153, 225, 0.3);
  animation: countUp 0.8s var(--transition-bezier) forwards;
}

.stat-label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

@keyframes fadeInOut {
  0% { opacity: 0; }
  10% { opacity: 1; }
  40% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 0; }
}

@keyframes fadeInScale {
  from { transform: scale(1.5); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes slideIn {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes slideUpFade {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes glowPulse {
  0%, 100% { opacity: 0.5; transform: translateY(0); }
  50% { opacity: 0.7; transform: translateY(-10px); }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes countUp {
  from { transform: translateY(1rem); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@media (min-width:1200px) {
  .stats-panel {
    right: 3rem;
    padding: 2rem;
  }
  .stat-group {
    gap: 3rem;
  }
}

@media (max-width:768px) {
  .stats-panel {
    display: none;
  }
  .info-card {
    width: 100%;
    height: 100vh;
    margin: 0;
    border-radius: 0;
  }
  .card-container {
    padding: 0;
    height: 100vh;
    align-items: flex-start;
    justify-content: center;
  }
  .card-content {
    padding: 2rem 1.5rem;
    height: 100%;
    box-sizing: border-box;
    gap: 2rem;
  }
  .tagline {
    font-size: 2.2rem;
    line-height: 1.3;
    margin: 2rem 0;
    font-weight: 600;
    text-align: center;
    color: #fff;
  }
  .actions {
    position: relative;
    bottom: 0;
    padding: 0;
    margin: 0;
    display: flex;
    gap: 1rem;
    width: 100%;
  }
  .action-button {
    border-radius: 0;
    margin: 0;
    height: 3.5rem;
  }
  .action-button:first-child {
    border-right: 1px solid rgba(255, 255, 255, 0.1);
  }
  .logo {
    height: 110px;
  }
}

@media screen and (max-width:380px) {
  .card-content {
    padding: 1.5rem 1.25rem;
    padding-bottom: calc(2rem + 5rem);
  }
  .tagline {
    font-size: 1.8rem;
    margin: 1.5rem 0;
  }
  .feature-text h3 {
    font-size: 1.35rem;
  }
  .feature-card {
    min-height: 160px;
  }
  .actions {
    padding: 0.75rem 1rem calc(0.75rem + env(safe-area-inset-bottom));
    flex-direction: column;
  }
  .action-button {
    height: 3rem;
    width: 100%;
  }
}

@media screen and (max-width:320px) {
  .card-content {
    padding: 1.25rem 1rem;
  }
  .brand, .logo {
    height: 70px;
  }
  .tagline {
    font-size: 1.6rem;
  }
}

@media screen and (max-height:600px) and (orientation:landscape) {
  .card-container {
    overflow-y: auto;
    height: auto;
    min-height: 100vh;
  }
  .info-card {
    height: auto;
    min-height: 100vh;
  }
  .card-content {
    gap: 2rem;
  }
  .brand {
    margin-top: 1rem;
  }
  .stats-panel {
    position: relative;
    width: 100%;
    margin: 0 0 1.5rem;
  }
}

@media (prefers-reduced-motion: no-preference) {
  .info-card {
    transform: translateX(-20px);
    transition: transform 0.6s var(--transition-bezier), opacity 0.6s var(--transition-bezier);
  }
}

@media (prefers-reduced-motion: reduce) {
  .info-card {
    transition: opacity 0.3s ease;
  }
}
</style>
