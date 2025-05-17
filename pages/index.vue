<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'

// 定义页面元信息
definePageMeta({
    layout: 'home',
})

useHead({
    title: 'Minecraft集体宣传组织(MSCPO)',
})

const isLoaded = ref(false)
const showContent = ref(false)
const stats = reactive({
    serverCount: 0,
    onlinePlayers: 0,
    totalViews: 0
})

onMounted(() => {
    // 简化加载动画，减少定时器嵌套
    setTimeout(() => {
        isLoaded.value = true
        setTimeout(() => {
            showContent.value = true
        }, 400)
    }, 300)
    
    // 初始化数据并设置定时刷新
    fetchStats()
    setInterval(fetchStats, 30000)
})

// 使用Promise而不是类，避免DOM直接操作
async function fetchStats() {
    try {
        const playerData = await fetchPlayerCount()
        stats.onlinePlayers = playerData.total_players || 0
    } catch (error) {
        console.error('Error updating stats:', error)
    }
}

async function fetchPlayerCount() {
    const cacheKey = 'playerCountCache'
    const cacheDuration = 10 * 60 * 1000 // 10分钟
    const now = Date.now()

    // 安全地尝试获取缓存
    let cachedData = null
    try {
        const cachedItem = localStorage.getItem(cacheKey)
        if (cachedItem) {
            cachedData = JSON.parse(cachedItem)
        }
    } catch (e) {
        console.warn('Cache access error:', e)
    }

    if (cachedData && now - cachedData.timestamp < cacheDuration) {
        return cachedData.data
    }

    try {
        // 修复URL格式
        const response = await fetch('https://mscpoapi.crashvibe.cn/v1/servers/players')
        if (!response.ok) throw new Error('Failed to fetch player count')
        const data = await response.json()
        
        // 安全地尝试设置缓存
        try {
            localStorage.setItem(cacheKey, JSON.stringify({ timestamp: now, data }))
        } catch (e) {
            console.warn('Cache write error:', e)
        }
        
        return data
    } catch (error) {
        console.error('Error fetching player count:', error)
        return { total_players: 0 }
    }
}
</script>

<template>
    <div class="home-container" :class="{ loaded: isLoaded }">
        <div class="lighting-container">
            <div class="ambient-light"></div>
            <div class="spotlight"></div>
        </div>
        <div class="content-wrapper" :class="{ show: showContent }">
            <div class="logo-container">
                <!-- 修复URL格式 -->
                <img src="https://free.boltp.com/2025/05/09/681e01399f508.webp" alt="MSCPO Logo" class="logo" />
                <h1 class="main-title">
                    <span class="gradient-text">MSCPO</span>
                    <span class="sub-title">集体宣传组织</span>
                </h1>
            </div>
            <div class="description">
                <div class="slogan">打造专业的 Minecraft 社区平台</div>
                <div class="divider"></div>
                <div class="features-text">
                    <span class="highlight">服务器宣传</span> ·
                    <span class="highlight">技术交流</span> ·
                    <span class="highlight">资源共享</span>
                </div>
            </div>
            <!-- 添加统计数据显示 -->
            <div class="stats-display">
                <div class="stat-item">
                    <div class="stat-value" id="onlinePlayers">{{ stats.onlinePlayers }}</div>
                    <div class="stat-label">在线玩家</div>
                </div>
            </div>
            <div class="cta-container">
                <!-- 修复URL格式 -->
                <a href="https://mscpo.crashvibe.cn/serverlist" class="cta-button primary">
                    <span>探索服务器宇宙</span>
                    <div class="hover-effect"></div>
                </a>
                <a href="https://mscpo.crashvibe.cn/about" class="cta-button secondary">
                    <span>了解我们的使命</span>
                    <div class="hover-effect"></div>
                </a>
            </div>
        </div>
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
    --transition: all .3s ease
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box
}

body {
    margin: 0;
    overflow: hidden;
    background: #0d1117;
    width: 100vw;
    height: 100vh;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    min-height: 100vh;
}

.home-container {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background: #0d1117;
    display: flex;
    align-items: center;
    justify-content: center;
}

.home-container.loaded {
    animation: fadeIn 1s ease-out forwards;
}

.lighting-container {
    position: absolute;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    opacity: 0;
    animation: fadeIn 2s ease-in-out forwards;
    z-index: 0;
}

.ambient-light {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        45deg,
        rgba(71, 144, 252, 0.2),
        rgba(20, 40, 120, 0.1),
        rgba(71, 144, 252, 0.2)
    );
    animation: ambientPulse 8s ease-in-out infinite;
    mix-blend-mode: soft-light;
}

@keyframes ambientPulse {
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.03); }
}

.spotlight {
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(
        circle at 35% 35%,
        rgba(100, 160, 255, 0.4) 0%,
        rgba(70, 130, 240, 0.3) 20%, 
        rgba(50, 100, 220, 0.2) 40%,
        rgba(40, 80, 200, 0.1) 60%,
        rgba(30, 60, 180, 0) 80%
    );
    opacity: 0.8;
    mix-blend-mode: screen;
    animation: spotlightMove 12s ease-in-out infinite;
    filter: blur(10px);
}

@keyframes spotlightMove {
    0%, 100% { transform: translate(0, 0); }
    25% { transform: translate(2%, -2%); }
    50% { transform: translate(0, -1%); }
    75% { transform: translate(-2%, 2%); }
}

.content-wrapper {
    position: relative;
    z-index: 1;
    max-width: 1000px;
    width: 90%;
    padding: 2rem;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.8s ease, transform 0.8s ease;
}

.content-wrapper.show {
    opacity: 1;
    transform: translateY(0);
}

.logo-container {
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
}

.logo {
    width: auto;
    height: 120px;
    margin-right: 1.5rem;
    filter: drop-shadow(0 0 10px rgba(66, 153, 225, 0.3));
}

.main-title {
    display: flex;
    flex-direction: column;
}

.gradient-text {
    font-size: 3rem;
    font-weight: 700;
    background: linear-gradient(135deg, #4299e1, #3182ce);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
}

.sub-title {
    font-size: 1.5rem;
    color: #ffffff;
    opacity: 0.8;
    margin-top: 0.5rem;
}

.description {
    margin-bottom: 3rem;
}

.slogan {
    font-size: 2rem;
    color: #ffffff;
    margin-bottom: 1rem;
    font-weight: 600;
}

.divider {
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #4299e1, #3182ce);
    margin: 1.5rem 0;
    border-radius: 2px;
}

.features-text {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.7);
}

.highlight {
    color: #ffffff;
    font-weight: 500;
}

/* 添加统计显示的样式 */
.stats-display {
    margin: 2rem 0;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.stat-item {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 1rem 1.5rem;
    text-align: center;
}

.stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: #ffffff;
    text-shadow: 0 0 10px rgba(66, 153, 225, 0.4);
    margin-bottom: 0.5rem;
}

.stat-label {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
}

.cta-container {
    display: flex;
    gap: 1rem;
}

.cta-button {
    position: relative;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    text-decoration: none;
    text-align: center;
    overflow: hidden;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.cta-button.primary {
    background: linear-gradient(135deg, #4299e1, #3182ce);
    color: white;
    border: none;
    box-shadow: 0 4px 15px rgba(66, 153, 225, 0.3);
}

.cta-button.secondary {
    background: rgba(255, 255, 255, 0.05);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.cta-button:hover {
    transform: translateY(-2px);
}

.cta-button.primary:hover {
    box-shadow: 0 6px 20px rgba(66, 153, 225, 0.4);
}

.cta-button.secondary:hover {
    background: rgba(255, 255, 255, 0.1);
}

.hover-effect {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(255, 255, 255, 0.15), transparent 70%);
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
}

.cta-button:hover .hover-effect {
    opacity: 1;
}

/* 动画 */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

/* 媒体查询优化 */
@media (max-width: 768px) {
    .logo-container {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }
    
    .logo {
        margin-right: 0;
        margin-bottom: 1rem;
        height: 100px;
    }
    
    .main-title {
        align-items: center;
    }
    
    .description {
        text-align: center;
    }
    
    .divider {
        margin: 1.5rem auto;
    }
    
    .gradient-text {
        font-size: 2.5rem;
    }
    
    .sub-title {
        font-size: 1.2rem;
    }
    
    .slogan {
        font-size: 1.5rem;
    }
    
    .cta-container {
        flex-direction: column;
    }
    
    .stats-display {
        justify-content: center;
    }
}

@media (max-width: 480px) {
    .content-wrapper {
        padding: 1.5rem;
    }
    
    .gradient-text {
        font-size: 2rem;
    }
    
    .sub-title {
        font-size: 1rem;
    }
    
    .slogan {
        font-size: 1.2rem;
    }
    
    .features-text {
        font-size: 1rem;
    }
    
    .logo {
        height: 80px;
    }
}

/* 提高性能的优化 */
@media (prefers-reduced-motion: reduce) {
    .ambient-light,
    .spotlight {
        animation: none;
    }
    
    .content-wrapper {
        transition: opacity 0.3s ease;
        transform: none;
    }
    
    .cta-button:hover {
        transform: none;
    }
}
</style>
