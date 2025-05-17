<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Logo from '@/assets/logo.svg';
import GridBackground from '@/components/Background/GridBackground.vue';

definePageMeta({
    layout: 'home',
});

useHead({
    title: 'Minecraft集体宣传组织(MSCPO)',
});

const isLoaded = ref(false);
const showContent = ref(false);

onMounted(() => {
    setTimeout(() => {
        isLoaded.value = true;
        setTimeout(() => {
            showContent.value = true;
        }, 500);
    }, 300);
    
    // 添加统计管理器逻辑
    document.addEventListener('DOMContentLoaded', initStatsManager);
});

function initStatsManager() {
    const elements = {
        serverCount: document.getElementById('serverCount'),
        onlinePlayers: document.getElementById('onlinePlayers'),
        totalViews: document.getElementById('totalViews')
    };
    
    const currentValues = {
        serverCount: 0,
        onlinePlayers: 0,
        totalViews: 0
    };
    
    async function fetchStats() {
        // 这里可以添加实际的数据获取逻辑
        // 示例数据
        const statsData = {
            serverCount: 120,
            onlinePlayers: 1500,
            totalViews: 25000
        };
        
        // 更新统计数据显示
        Object.keys(elements).forEach(key => {
            if (elements[key]) {
                elements[key].textContent = statsData[key].toString();
            }
        });
    }
    
    // 初始获取并自动刷新
    fetchStats();
    setInterval(fetchStats, 30000); // 每30秒更新一次
}
</script>

<template>
    <div class="lighting-container" :class="{ loaded: isLoaded }">
        <div class="ambient-light"></div>
        <div class="spotlight"></div>
        <div class="glow"></div>
        <div class="particles"></div>
        <div class="refraction"></div>
    </div>

    <main class="card-container" :class="{ 'show': showContent }">
        <div class="stats-panel">
            <div class="stat-group">
                <div class="stat-item">
                    <div class="stat-value" data-value="0" id="serverCount">0</div>
                    <div class="stat-label">服务器</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value" data-value="0" id="onlinePlayers">0</div>
                    <div class="stat-label">在线玩家</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value" data-value="0" id="totalViews">0</div>
                    <div class="stat-label">访问量</div>
                </div>
            </div>
        </div>
        <div class="info-card">
            <div class="card-glow"></div>
            <div class="card-content">
                <div class="brand">
                    <div class="logo-container">
                        <img :src="Logo" alt="MSCPO" class="logo">
                    </div>
                </div>
                <p class="tagline">MSCPO<br>助力打造优质游戏社区</p>
                <div class="feature-showcase">
                    <div class="feature-card">
                        <div class="feature-content current" data-index="0">
                            <div class="feature-highlight"></div>
                            <div class="feature-text">
                                <h3>服务器宣传</h3>
                                <p>一站式服务器推广解决方案</p>
                            </div>
                        </div>
                        <div class="feature-content" data-index="1">
                            <div class="feature-highlight"></div>
                            <div class="feature-text">
                                <h3>技术交流</h3>
                                <p>分享技术经验</p>
                            </div>
                        </div>
                        <div class="feature-content" data-index="2">
                            <div class="feature-highlight"></div>
                            <div class="feature-text">
                                <h3>资源分享</h3>
                                <p>优质资源共享</p>
                            </div>
                        </div>
                        <div class="feature-indicators">
                            <div class="indicator active"></div>
                            <div class="indicator"></div>
                            <div class="indicator"></div>
                        </div>
                    </div>
                </div>
                <div class="actions">
                    <a href="https://mscpo.crashvibe.cn/serverlist" class="action-button btn-primary">
                        <span class="btn-text">立即体验</span>
                    </a>
                    <a href="https://mscpo.crashvibe.cn/about" class="action-button btn-secondary">
                        <span class="btn-text">了解使命</span>
                    </a>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped lang="less">
:root {
    --bg-dark: #0d1117;
    --text: #fff;
    --accent-1: #4299e1;
    --accent-2: #3182ce;
    --transition: all 0.3s ease;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    background: var(--bg-dark);
    width: 100vw;
    height: 100vh;
    font-family: 'Inter', sans-serif;
}

.lighting-container {
    position: absolute;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    opacity: 0;
    animation: fadeIn 3s ease-in-out forwards;
}

.ambient-light {
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg, rgba(71, 144, 252, 0.3), rgba(20, 40, 120, 0.1), rgba(71, 144, 252, 0.3));
    animation: ambientPulse 6s ease-in-out infinite;
}

.card-container {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
}

.info-card {
    position: relative;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(20px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.brand {
    text-align: center;
}

.logo {
    width: 180px;
    height: 180px;
    filter: drop-shadow(0 0 20px rgba(66, 153, 225, 0.3));
}

.tagline {
    font-size: 1.4rem;
    color: var(--text);
    text-align: center;
    margin: 1.5rem 0;
}

.actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 2rem;
}

.action-button {
    padding: 1rem 2rem;
    border-radius: 20px;
    font-size: 1.1rem;
    font-weight: 600;
    text-decoration: none;
    color: var(--text);
    transition: var(--transition);
}

.btn-primary {
    background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
}

.btn-secondary {
    background: rgba(255, 255, 255, 0.1);
}

@keyframes ambientPulse {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 0.9; }
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
</style>

<script>
document.addEventListener('DOMContentLoaded', () => {
    class StatsManager {
        constructor() {
            this.elements = {
                serverCount: document.getElementById('serverCount'),
                onlinePlayers: document.getElementById('onlinePlayers'),
                totalViews: document.getElementById('totalViews')
            };
            this.currentValues = {
                serverCount: 0,
                onlinePlayers: 0,
                totalViews: 0
            };
            this.startAutoRefresh();
        }

        async fetchStats() {
            // Fetch and update stats here
        }

        startAutoRefresh() {
            this.fetchStats();
            setInterval(() => this.fetchStats(), 30000); // 每30秒更新一次
        }
    }

    new StatsManager();
});
</script>
