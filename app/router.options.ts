import type { RouterOptions } from 'vue-router'
import { nextTick } from 'vue'

export default <RouterOptions>{
    scrollBehavior(to, from, savedPosition) {
        return new Promise((resolve) => {
            nextTick(() => {
                const scrollContainer = document.querySelector('.main-content')
                if (scrollContainer) {
                    scrollContainer.scrollTo({ top: 0, behavior: 'smooth' })
                }
                resolve({ top: 0 })
            })
        })
    },
}
