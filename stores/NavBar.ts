// stores/NavBar.ts
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useNavBarStore = defineStore('navBar', () => {
    const isEnable = ref(false)
    const navbarComponents = ref<Record<string, string>>({})

    // 设置导航栏配置
    const setNavBarConfig = (config: {
        enable: boolean
        component?: Array<string>
    }) => {
        isEnable.value = config.enable
        const resolvedComponents: Record<string, string> = {}
        if (config.component?.length) {
            for (const [index, compName] of config.component.entries()) {
                resolvedComponents[`custom-${index}`] = compName
            }
        }
        navbarComponents.value = resolvedComponents
    }

    return {
        isEnable,
        navbarComponents,
        setNavBarConfig,
    }
})
