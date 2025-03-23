// composables/useNavBar.ts
import { useNavBarStore } from '@/stores/NavBar'

export function useNavBar(config?: {
    enable: boolean
    component?: Array<string>
}) {
    const navBarStore = useNavBarStore()
    if (config) {
        console.log('Updating  navBar config:', config)
        navBarStore.setNavBarConfig(config) // 更新配置
    }
    return {
        isEnable: navBarStore.isEnable,
        navbarComponents: navBarStore.navbarComponents,
    }
}
