import { createAlova } from 'alova'
import { createServerTokenAuthentication } from 'alova/client'
import VueHook from 'alova/vue'
import adapterFetch from 'alova/fetch'

function getToken() {
    let temp_Token = ''
    return {
        get() {
            if (temp_Token) {
              return temp_Token
            }
            const token = localStorage.getItem('token')
            if (token) {
                temp_Token = token
            }
            return temp_Token
        },
        clear() {
            temp_Token = ''
        },
    }
}

export const GetToken = getToken()

const accessToken = ref('')
const refreshToken = ref('')
const { onAuthRequired, onResponseRefreshToken } =
    createServerTokenAuthentication({
        async login(response) {
            const data = await response.clone().json()
            accessToken.value = data.accessToken
            refreshToken.value = data.refreshToken
        },
        logout() {
            accessToken.value = ''
            refreshToken.value = ''
        },
        assignToken(method) {
            method.config.headers.Authorization = accessToken.value
        },
    })

export const ServerAPI_Token = createAlova({
    baseURL: 'https://mscpoapi.tblstudio.cn/',
    statesHook: VueHook,
    requestAdapter: adapterFetch(),
    // 全局请求拦截器
    beforeRequest({ config }) {
        // 添加 Token 到请求头
        config.headers.Authorization = `Bearer ${GetToken.get()}`
        config.headers['Content-Type'] = 'application/json; charset=utf-8'
    },
    responded: async (response) => ({
        ...(await response.json()),
        code: response.status,
    }),
})
