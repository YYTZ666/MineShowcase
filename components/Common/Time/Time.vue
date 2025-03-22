<template>
    <a-tooltip :title="formattedTime">
        <span class="time">更新时间: {{ displayTime }}</span>
    </a-tooltip>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')
dayjs.extend(relativeTime)

const props = defineProps<{
    // 时间格式化字符串，详情见 format
    format?: string
    // 时间
    time?: number | Date
    // 格式化值时使用的时区，遵循 iana time zones 格式。你可以使用 Intl.supportedValuesOf('timeZone')  来查看支持的时区
    timeZone?: string
    // 目标时间
    to?: number | Date
    // 时间类型
    type?: 'relative' | 'date' | 'datetime'
    // unix 时间戳
    unix?: boolean
}>()

// 处理时间值
const getTimeValue = () => {
    let timeValue = props.time || Date.now()
    if (props.unix) {
        timeValue = (timeValue as number) * 1000
    }
    return timeValue
}

// 格式化时间
const formattedTime = computed(() => {
    const time = getTimeValue()
    if (props.format) {
        return dayjs(time).format(props.format)
    }
    if (props.type === 'date') {
        return dayjs(time).format('YYYY-MM-DD')
    }
    if (props.type === 'datetime') {
        return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    }
    return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
})

// 显示的时间
const displayTime = computed(() => {
    const time = getTimeValue()
    if (props.type === 'relative') {
        const targetTime = props.to || Date.now()
        return dayjs(time).from(dayjs(targetTime))
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
