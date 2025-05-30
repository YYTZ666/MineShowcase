<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'

definePageMeta({
  layout: 'home',
})

useHead({
  title: 'Minecraft集体宣传组织(MSCPO)',
})

// 响应式状态
const isLoaded = ref(false)
const showContent = ref(false)
const currentIndex = ref(0)
const currentValues = reactive({
  serverCount: 0,
  onlinePlayers: 0,
  totalViews: 0
})

let autoPlayInterval: ReturnType<typeof setInterval> | null = null
let statsRefreshInterval: ReturnType<typeof setInterval> | null = null

// 入口生命周期
onMounted(() => {
  // 初始化动画流程
  setTimeout(() => {
    isLoaded.value = true
    setTimeout(() => {
      showContent.value = true
    }, 500)
  }, 300)

  initializePageAnimation()
  initializeFeatures()
  initializeButtons()
  initializeFeatureShowcase()
  startStatsAutoRefresh()
})

onUnmounted(() => {
  stopAutoPlayFeatureShowcase()
  stopStatsAutoRefresh()
})

// 页面动画
function initializePageAnimation() {
  const cardElement = document.querySelector('.info-card')
  if (cardElement) {
    cardElement.classList.add('entering')
    setTimeout(() => {
      cardElement.classList.add('active')
      setTimeout(() => {
        cardElement.classList.remove('entering')
      }, 800)
    }, 100)
  }
}

// 特征高亮鼠标跟踪
function initializeFeatures() {
  const features = document.querySelectorAll<HTMLElement>('.feature')
  features.forEach(feature => {
    feature.addEventListener('mousemove', e => {
      const rect = feature.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      const highlight = feature.querySelector<HTMLElement>('.feature-highlight')
      if (highlight) {
        highlight.style.setProperty('--x', `${x}%`)
        highlight.style.setProperty('--y', `${y}%`)
        highlight.style.opacity = '1'
      }
    })
    feature.addEventListener('mouseleave', () => {
      const highlight = feature.querySelector<HTMLElement>('.feature-highlight')
      if (highlight) {
        highlight.style.opacity = '0'
      }
    })
  })
}

// 按钮交互
function initializeButtons() {
  const buttons = document.querySelectorAll<HTMLElement>('.btn-primary')
  buttons.forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      const btnGlow = btn.querySelector<HTMLElement>('.btn-glow')
      if (btnGlow) {
        btnGlow.style.setProperty('--x', `${x}%`)
        btnGlow.style.setProperty('--y', `${y}%`)
      }
    })
    btn.addEventListener('click', () => {
      const text = btn.textContent?.trim() ?? ''
      if (text.includes('立即体验')) {
        window.location.href = 'https://mscpo.crashvibe.cn/serverlist'
      } else if (text.includes('了解更多') || text.includes('了解使命')) {
        window.location.href = 'https://mscpo.crashvibe.cn/about'
      }
    })
  })
}

// 轮播功能初始化
function initializeFeatureShowcase() {
  const contents = document.querySelectorAll<HTMLElement>('.feature-content')
  const indicators = document.querySelectorAll<HTMLElement>('.indicator')

  contents.forEach((content, index) => {
    content.addEventListener('click', () => showFeature(index))
  })
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => showFeature(index))
  })

  startAutoPlayFeatureShowcase()

  const featureCard = document.querySelector<HTMLElement>('.feature-card')
  featureCard?.addEventListener('mouseenter', stopAutoPlayFeatureShowcase)
  featureCard?.addEventListener('mouseleave', startAutoPlayFeatureShowcase)
}

// 显示指定特征
function showFeature(index: number) {
  currentIndex.value = index

  const contents = document.querySelectorAll<HTMLElement>('.feature-content')
  contents.forEach(content => {
    content.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
    content.style.transform = 'translateX(-30px) scale(0.98)'
    content.style.opacity = '0'
    content.classList.remove('current')
  })

  setTimeout(() => {
    const current = contents[index]
    current.classList.add('current')
    current.style.transform = 'translateX(0) scale(1)'
    current.style.opacity = '1'
  }, 50)

  const indicators = document.querySelectorAll<HTMLElement>('.indicator')
  indicators.forEach(indicator => {
    indicator.classList.remove('active')
  })
  indicators[index]?.classList.add('active')
}

function startAutoPlayFeatureShowcase() {
  if (autoPlayInterval) clearInterval(autoPlayInterval)
  autoPlayInterval = setInterval(() => {
    const nextIndex = (currentIndex.value + 1) % 3
    showFeature(nextIndex)
  }, 3000)
}

function stopAutoPlayFeatureShowcase() {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
    autoPlayInterval = null
  }
}

// 获取玩家数缓存和接口请求
async function fetchPlayerCount() {
  const cacheKey = 'playerCountCache'
  const cacheDuration = 10 * 60 * 1000 // 10分钟
  const now = Date.now()

  const cachedData = localStorage.getItem(cacheKey)
  if (cachedData) {
    try {
      const { timestamp, data } = JSON.parse(cachedData)
      if (now - timestamp < cacheDuration) {
        return data
      }
    } catch {
      // ignore parse errors
    }
  }

  try {
    const response = await fetch('https://mscpoapi.crashvibe.cn/v1/servers/players')
    if (!response.ok) throw new Error('Failed to fetch player count')
    const data = await response.json()
    localStorage.setItem(cacheKey, JSON.stringify({ timestamp: now, data }))
    return data
  } catch (error) {
    console.error('Error fetching player count:', error)
    return { total_players: 0 }
  }
}

// 更新统计数据
async function updateStats() {
  const playerData = await fetchPlayerCount()
  const statsData = {
    serverCount: 0, // 你的接口如有返回可以替换
    onlinePlayers: playerData.total_players || 0,
    totalViews: 0 // 同上
  }
  animateNumbers(statsData)
}

function animateNumbers(data: Record<string, number>) {
  Object.keys(currentValues).forEach(key => {
    const targetValue = data[key] || 0
    animateNumber(document.getElementById(key), currentValues[key], targetValue)
    currentValues[key] = targetValue
  })
}

function animateNumber(element: HTMLElement | null, start: number, end: number) {
  if (!element) return
  const duration = 1000
  const startTime = performance.now()

  const updateDisplay = (currentTime: number) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const currentValue = Math.round(start + (end - start) * progress)
    element.textContent = formatNumber(currentValue)
    if (progress < 1) {
      requestAnimationFrame(updateDisplay)
    }
  }
  requestAnimationFrame(updateDisplay)
}

function formatNumber(num: number) {
  return new Intl.NumberFormat().format(num)
}

function startStatsAutoRefresh() {
  updateStats()
  if (statsRefreshInterval) clearInterval(statsRefreshInterval)
  statsRefreshInterval = setInterval(updateStats, 30000) // 每30秒更新一次
}

function stopStatsAutoRefresh() {
  if (statsRefreshInterval) {
    clearInterval(statsRefreshInterval)
    statsRefreshInterval = null
  }
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

  <main class="card-container">
    <div class="stats-panel" v-if="showContent">
      <div class="stat-group">
        <div class="stat-item">
          <div class="stat-value" id="serverCount">0</div>
          <div class="stat-label">服务器</div>
        </div>
        <div class="stat-item">
          <div class="stat-value" id="onlinePlayers">0</div>
          <div class="stat-label">在线玩家</div>
        </div>
        <div class="stat-item">
          <div class="stat-value" id="totalViews">0</div>
          <div class="stat-label">访问量</div>
        </div>
      </div>
    </div>

    <div class="info-card" :class="{ active: isLoaded }">
      <div class="card-glow"></div>
      <div class="card-content" v-show="showContent">
        <div class="brand">
          <div class="logo-container">
            <img src="https://free.boltp.com/2025/05/09/681e01399f508.webp" alt="MSCPO" class="logo" />
          </div>
        </div>

        <p class="tagline">MSCPO<br />助力打造优质游戏社区</p>

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
            <div class="btn-glow"></div>
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

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
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

.boot-animation {
  position: fixed;
  inset: 0;
  background: radial-gradient(circle at center, #0f172a 0%, #000 100%);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transform-origin: center;
  transition: opacity 0.8s ease-out;
}

.boot-line {
  position: absolute;
  top: 50%;
  left: -100%;
  width: 200%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), rgba(96, 165, 250, 0.8), #fff, 
    rgba(96, 165, 250, 0.8), rgba(255, 255, 255, 0.1), transparent);
  filter: blur(1px);
  transform: translateY(-50%) rotate(-2deg) translateZ(0);
  animation: bootLine 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.boot-content {
  transform: scale(0.95) translateY(20px);
  opacity: 0;
  filter: blur(10px);
  animation: bootContent 0.8s var(--transition-bezier) 0.8s forwards;
}

.boot-logo {
  width: 180px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.boot-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: brightness(0) invert(1);
  transform: translateZ(0);
  will-change: filter;
  animation: logoGlow 2s ease-in-out infinite;
}

@keyframes bootLine {
  0% { left: -100%; opacity: 1; }
  100% { left: 100%; opacity: 0; }
}

@keyframes bootContent {
  0% { transform: scale(0.95) translateY(20px); opacity: 0; filter: blur(10px); }
  100% { transform: scale(1) translateY(0); opacity: 1; filter: blur(0); }
}

@keyframes logoGlow {
  0%, 100% { filter: brightness(0) invert(1) drop-shadow(0 0 8px rgba(96, 165, 250, 0.3)); }
  50% { filter: brightness(0) invert(1) drop-shadow(0 0 15px rgba(96, 165, 250, 0.5)); }
}

.loading-screen {
  position: fixed;
  inset: 0;
  background: var(--bg-dark);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.5s ease-out;
  animation: fadeOut 0.5s ease-out 2.5s forwards;
}

@keyframes fadeOut {
  to { opacity: 0; visibility: hidden; }
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

.logo-wrapper {
  margin-bottom: 1.2rem;
  position: relative;
  width: 100%;
  max-width: 180px;
  margin-left: 0;
  margin-right: 0;
  height: 80px;
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

.logo img {
  max-width: none;
  image-rendering: crisp-edges;
  -ms-interpolation-mode: nearest-neighbor;
}

.brand {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 0.8rem;
  gap: 1.2rem;
}

.title {
  font-size: 48px;
  margin-bottom: 16px;
  position: relative;
}

.text-gradient {
  background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
  -webkit-background-clip: text;
  color: transparent;
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

.features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin: 1.5rem 0;
}

.feature {
  position: relative;
  background: transparent !important;
  color: var(--feature-text-color, #fff);
  border-radius: 16px;
  padding: 1.8rem 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideIn 0.5s backwards;
  transform: translateY(30px);
  opacity: 0;
  min-height: 180px;
}

.info-card.active .feature {
  transform: translateY(0);
  opacity: 1;
  transition: transform 0.6s var(--transition-bezier), opacity 0.6s var(--transition-bezier);
}

.feature:hover {
  background: var(--surface-2);
}

.feature:nth-child(1) {
  animation-delay: 0.2s;
}

.feature:nth-child(2) {
  animation-delay: 0.3s;
}

.feature:nth-child(3) {
  animation-delay: 0.4s;
}

.feature-highlight {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at var(--x, 50%) var(--y, 50%), var(--highlight), transparent 100%);
  opacity: 0;
  transition: opacity 0.3s;
}

.feature:hover .feature-highlight {
  opacity: 1;
}

.feature .icon {
  width: 32px;
  height: 32px;
  color: var(--accent-1);
  margin-bottom: 0.5rem;
}

.feature h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--feature-title-color, #fff) !important;
}

.feature p {
  font-size: 0.875rem;
  color: var(--feature-desc-color, #fff);
  line-height: 1.4;
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

.actions {
  display: flex;
  gap: 1rem;
  margin: 1rem -1rem 0;
  padding: 0 2rem;
  justify-content: stretch;
  width: calc(100% + 2rem);
}

.action-button {
  flex: 1;
  min-width: 160px;
}

.slideshow-background {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
}

.slideshow-background img {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  animation: fadeInOut 12s infinite;
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

@keyframes fadeInOut {
  0% { opacity: 0; }
  10% { opacity: 1; }
  40% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 0; }
}

@keyframes spin {
  to { transform: rotate(360deg); }
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

@media (-webkit-min-device-pixel-ratio:2) {
  .brand h1, .tagline, .feature h3, .btn-text {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
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
