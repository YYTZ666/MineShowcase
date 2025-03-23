// stores/navBar.ts
import { ref } from 'vue'

export const useNavBarStore = defineStore('navBar', () => {
    const isActive = ref(true)
    const navbarComponents = ref<Record<string, any>>({})

    // 解析异步组件
    const resolveComponent = async (comp: any) => {
        if (typeof comp === 'function') {
            const module = await comp()
            return module.default
        }
        return comp
    }

    // 设置导航栏配置
    const setNavBarConfig = async (config: {
        enable: boolean
        component?: Array<any>
    }) => {
        isActive.value = config.enable
        const resolvedComponents: Record<string, any> = {}
        if (config.component?.length) {
            for (const [index, comp] of config.component.entries()) {
                resolvedComponents[`custom-${index}`] =
                    await resolveComponent(comp)
            }
        }
        navbarComponents.value = resolvedComponents
    }

    return {
        isActive,
        navbarComponents,
        setNavBarConfig,
    }
})
