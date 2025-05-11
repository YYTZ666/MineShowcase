<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import throttle from 'lodash-es/throttle'

interface GridCell {
    x: number
    y: number
    baseX: number
    baseY: number
    scale: number
    targetScale: number
    translateX: number
    translateY: number
    targetTranslateX: number
    targetTranslateY: number
    rotation: number
    targetRotation: number
    color: string
}

const canvasRef = ref<HTMLCanvasElement | null>(null)
const gridSize = 80
const gridGap = 20
const cells = ref<GridCell[]>([])
const mousePos = ref<{ x: number; y: number }>({ x: -1000, y: -1000 })
const isMouseDown = ref(false)
const animationFrame = ref(0)

const createGrid = throttle(() => {
    if (!canvasRef.value) return

    const canvas = canvasRef.value
    const ctx = canvas.getContext('2d')!
    const width = window.innerWidth
    const height = window.innerHeight

    canvas.width = width
    canvas.height = height

    const columns = Math.ceil(width / gridSize)
    const rows = Math.ceil(height / gridSize)

    const newCells: GridCell[] = []

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            const x = col * (gridSize + gridGap) + gridSize / 2
            const y = row * (gridSize + gridGap) + gridSize / 2

            newCells.push({
                x,
                y,
                baseX: x,
                baseY: y,
                scale: 1,
                targetScale: 1,
                translateX: 0,
                translateY: 0,
                targetTranslateX: 0,
                targetTranslateY: 0,
                rotation: 0,
                targetRotation: 0,
                color: 'hsla(200, 65%, 80%, 0.226)',
            })
        }
    }

    cells.value = newCells
}, 100)

const drawCell = (ctx: CanvasRenderingContext2D, cell: GridCell) => {
    const size = gridSize / 2
    const translateX = cell.translateX * 0.01
    const translateY = cell.translateY * 0.01

    ctx.save()
    ctx.translate(cell.baseX + translateX, cell.baseY + translateY)
    ctx.rotate(cell.rotation)
    ctx.scale(cell.scale, cell.scale)

    // 绘制背景
    ctx.beginPath()
    ctx.roundRect(-size, -size, gridSize, gridSize, 5)
    ctx.fillStyle = cell.color
    ctx.fill()

    // 绘制边框
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)'
    ctx.lineWidth = 1
    ctx.stroke()

    // 绘制内发光
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.01)')
    gradient.addColorStop(0.7, 'transparent')
    ctx.fillStyle = gradient
    ctx.fill()

    ctx.restore()
}

const animate = () => {
    const canvas = canvasRef.value!
    const ctx = canvas.getContext('2d')!

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 绘制渐变背景
    const bgGradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height,
    )
    bgGradient.addColorStop(0, '#0f172a')
    bgGradient.addColorStop(1, '#1e293b')
    ctx.fillStyle = bgGradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    cells.value.forEach((cell) => {
        // 计算与鼠标的距离
        const dx = mousePos.value.x - cell.x
        const dy = mousePos.value.y - cell.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // 根据鼠标状态设置不同的目标值
        if (isMouseDown.value && distance < 200) {
            // 鼠标按下时的效果
            const intensity = 1 - Math.min(distance / 200, 1)
            cell.targetScale = 1 + intensity * 0.5 // 更大的放大效果
            cell.targetRotation = (intensity * Math.PI) / 4 // 旋转效果
            cell.targetTranslateX = dx * 2.5 // 更强的位移
            cell.targetTranslateY = dy * 2.5
        } else {
            // 普通悬停效果
            const isActive = distance < 150
            cell.targetScale = isActive ? 1.15 : 1
            cell.targetRotation = 0
            cell.targetTranslateX = isActive ? dx : 0
            cell.targetTranslateY = isActive ? dy : 0
        }

        // 平滑过渡
        cell.scale += (cell.targetScale - cell.scale) * 0.1
        cell.rotation += (cell.targetRotation - cell.rotation) * 0.1
        cell.translateX += (cell.targetTranslateX - cell.translateX) * 0.1
        cell.translateY += (cell.targetTranslateY - cell.translateY) * 0.1

        // 计算颜色强度
        const intensity = 0.2 - Math.min(distance / 150, 1)

        cell.color = `hsla(200, ${65 + intensity * 30}%, ${80 + intensity * 15}%, ${0.6 + intensity * 0.4})`

        drawCell(ctx, cell)
    })

    animationFrame.value = requestAnimationFrame(animate)
}

const handleMouseMove = throttle((e: MouseEvent) => {
    mousePos.value = { x: e.clientX, y: e.clientY }
}, 32)

const handleMouseDown = () => {
    isMouseDown.value = true
}

const handleMouseUp = () => {
    isMouseDown.value = false
}

const handleResize = throttle(() => {
    createGrid()
}, 200)

onMounted(() => {
    createGrid()
    animate()
    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
})

onUnmounted(() => {
    cancelAnimationFrame(animationFrame.value)
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mousedown', handleMouseDown)
    window.removeEventListener('mouseup', handleMouseUp)
})
</script>

<template>
    <canvas ref="canvasRef" class="canvas-background"></canvas>
</template>

<style scoped>
.canvas-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
}
</style>
