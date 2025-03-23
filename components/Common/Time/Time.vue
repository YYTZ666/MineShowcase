<template>
    <a-tooltip :title="formattedTime">
        <span class="time">更新时间: {{ displayTime }}</span>
    </a-tooltip>
</template>

<script setup lang="ts">
import { defineProps, computed, ref, onMounted, onUnmounted } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')
dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)

const props = defineProps<{
    format?: string
    time?: number | Date
    timeZone?: string
    to?: number | Date
    type?: 'relative' | 'date' | 'datetime'
    unix?: boolean
}>()

const currentTime = ref(Date.now())

onMounted(() => {
    const interval = setInterval(() => {
        currentTime.value = Date.now()
    }, 1000)

    onUnmounted(() => {
        clearInterval(interval)
    })
})

const getTimeValue = () => {
    let timeValue = props.time || Date.now()
    if (props.unix) {
        timeValue = (timeValue as number) * 1000
    }
    return timeValue
}

const formattedTime = computed(() => {
    const time = getTimeValue()
    let dayjsObj = dayjs(time)
    if (props.timeZone) {
        dayjsObj = dayjsObj.tz(props.timeZone)
    }
    if (props.format) {
        return dayjsObj.format(props.format)
    }
    if (props.type === 'date') {
        return dayjsObj.format('YYYY-MM-DD')
    }
    if (props.type === 'datetime') {
        return dayjsObj.format('YYYY-MM-DD   HH:mm:ss')
    }
    return dayjsObj.format('YYYY-MM-DD   HH:mm:ss')
})

const displayTime = computed(() => {
    const time = getTimeValue()
    let dayjsObj = dayjs(time)
    if (props.timeZone) {
        dayjsObj = dayjsObj.tz(props.timeZone)
    }
    if (props.type === 'relative') {
        const targetTime = props.to || currentTime.value
        let targetDayjsObj = dayjs(targetTime)
        if (props.timeZone) {
            targetDayjsObj = targetDayjsObj.tz(props.timeZone)
        }
        return dayjsObj.from(targetDayjsObj)
    }
    return formattedTime.value
})
</script>

<style scoped lang="less">
@import '@/assets/css/variables.less';

.time {
    color: @text-color-secondary;
    @media (prefers-color-scheme: dark) {
        color: @text-color-secondary-dark;
    }
}
</style>
