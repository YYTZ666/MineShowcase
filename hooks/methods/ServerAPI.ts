import { createAlova } from 'alova'
import VueHook from 'alova/vue'
import adapterFetch from 'alova/fetch'

export const ServerAPI = createAlova({
    baseURL: 'https://mscpoapi.tblstudio.cn/',
    statesHook: VueHook,
    requestAdapter: adapterFetch(),
    responded: async (response) => ({
        ...(await response.json()),
        code: response.status,
    }),
})
