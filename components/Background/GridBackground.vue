<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import throttle from 'lodash/throttle'
const { $anime } = useNuxtApp()

const gridContainer = ref<HTMLElement | null>(null)
const gridCellsData = ref<
    { el: HTMLElement; x: number; y: number; radius: number }[]
>([])
const gridSize = 80
const gridGap = 16
const lastActiveCells = ref<HTMLElement[]>([])

const createGrid = throttle(() => {
    if (!gridContainer.value) return

    const container = gridContainer.value
    const width = container.clientWidth
    const height = container.clientHeight

    const columns = Math.ceil(width / gridSize)
    const rows = Math.ceil(height / gridSize)
    const fragment = document.createDocumentFragment()

    container.innerHTML = ''

    for (let i = 0; i < rows * columns; i++) {
        const cell = document.createElement('div')
        cell.className = 'grid-cell'
        fragment.appendChild(cell)
    }

    container.appendChild(fragment)

    const cellsData: {
        el: HTMLElement
        x: number
        y: number
        radius: number
    }[] = []
    const cells = container.querySelectorAll('.grid-cell')

    cells.forEach((cell, index) => {
        const cellEl = cell as HTMLElement
        const col = index % columns
        const row = Math.floor(index / columns)

        cellsData.push({
            el: cellEl,
            x: col * (gridSize + gridGap) + gridSize / 2,
            y: row * (gridSize + gridGap) + gridSize / 2,
            radius: (gridSize / 2) * 1.414,
        })
    })

    gridCellsData.value = cellsData
    container.style.gridTemplateColumns = `repeat(${columns}, ${gridSize}px)`
    container.style.gridTemplateRows = `repeat(${rows}, ${gridSize}px)`
}, 100)

const handleMouseMove = throttle((e: MouseEvent) => {
    if (!gridContainer.value || !gridCellsData.value.length) return

    const rect = gridContainer.value.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const activeCells: HTMLElement[] = []

    gridCellsData.value.forEach((cell) => {
        const dx = mouseX - cell.x
        const dy = mouseY - cell.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 80 + cell.radius) {
            activeCells.push(cell.el)
        }
    })

    // 恢复上次活跃但这次不活跃的单元格
    lastActiveCells.value.forEach((cell) => {
        if (!activeCells.includes(cell)) {
            $anime({
                targets: cell,
                scale: 1,
                translateX: 0,
                translateY: 0,
                background: 'hsla(200, 65%, 80%, 0.226)',
                duration: 1000,
                easing: 'easeOutExpo',
            })
        }
    })

    // 动画新活跃的单元格
    $anime({
        targets: activeCells,
        scale: [1, 1.15],
        translateX: (el: HTMLElement) => {
            const cell = gridCellsData.value.find((c) => c.el === el)!
            return (mouseX - cell.x) * 0.05
        },
        translateY: (el: HTMLElement) => {
            const cell = gridCellsData.value.find((c) => c.el === el)!
            return (mouseY - cell.y) * 0.05
        },
        duration: 800,
        easing: 'easeOutExpo',
        update: (anim) => {
            anim.animatables.forEach((animatable) => {
                const target = animatable.target as HTMLElement
                const intensity =
                    1 -
                    Math.sqrt(
                        Math.pow(
                            parseFloat(
                                target.style.transform.match(
                                    /translateX\(([^)]+)px\)/,
                                )?.[1] || '0',
                            ) / 0.05,
                            2,
                        ) +
                            Math.pow(
                                parseFloat(
                                    target.style.transform.match(
                                        /translateY\(([^)]+)px\)/,
                                    )?.[1] || '0',
                                ) / 0.05,
                                2,
                            ),
                    ) /
                        150

                target.style.background = `hsla(200, ${65 + intensity * 30}%, ${80 + intensity * 15}%, ${0.5 + intensity * 0.3})`
            })
        },
    })

    lastActiveCells.value = activeCells
}, 32)

const handleResize = throttle(() => {
    createGrid()
}, 200)

onMounted(() => {
    createGrid()
    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
    gridCellsData.value.forEach((cell) => {
        $anime.remove(cell.el)
    })
    gridCellsData.value = []
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('mousemove', handleMouseMove)
})
</script>

<template>
    <div ref="gridContainer" class="grid-background"></div>
</template>

<style scoped>
.grid-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: grid;
    gap: v-bind(gridGap + 'px');
    background: linear-gradient(45deg, #0f172a, #1e293b);
    z-index: 0;
    pointer-events: none;
    filter: contrast(120%);
}

:global(.grid-cell) {
    position: relative;
    background: hsla(200, 65%, 80%, 0.226);
    border-radius: 6px;
    transition:
        transform 0.6s cubic-bezier(0.23, 1, 0.32, 1),
        background 0.6s ease;
    transform-origin: center;
    will-change: transform, background;
    backdrop-filter: blur(2px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    mix-blend-mode: screen;
    box-shadow: 0 0 8px -5px rgba(255, 255, 255, 0.3);
}

:global(.grid-cell::before) {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
        circle at 50% 50%,
        rgba(255, 255, 255, 0.1) 0%,
        transparent 70%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
}

:global(.grid-cell:hover::before) {
    opacity: 1;
}

:global(.grid-cell::after) {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: conic-gradient(
        from 0deg,
        transparent 0%,
        rgba(255, 255, 255, 0.1) 30%,
        transparent 70%
    );
    animation: rotate 20s linear infinite;
    opacity: 0.1;
    transform: translateZ(0);
}

@keyframes rotate {
    to {
        transform: rotate(1turn);
    }
}
</style>
