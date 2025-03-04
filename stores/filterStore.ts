import { defineStore } from 'pinia'

export const useFilterStore = defineStore('filter', {
    state: () => ({
        selectedModes: [] as string[], // 选中的游戏模式
        playerRange: [0, 500] as [number, number], // 玩家数量范围
        selectedTags: [] as string[], // 选中的标签
        searchQuery: '', // 搜索关键词
    }),
    actions: {
        setModes(modes: string[]) {
            this.selectedModes = modes
        },
        setPlayerRange(range: [number, number]) {
            this.playerRange = range
        },
        toggleTag(tag: string) {
            const index = this.selectedTags.indexOf(tag)
            if (index === -1) {
                this.selectedTags.push(tag)
            } else {
                this.selectedTags.splice(index, 1)
            }
        },
        setSearchQuery(query: string) {
            this.searchQuery = query
        },
    },
})