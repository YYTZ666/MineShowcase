import { createAlova } from 'alova'
import VueHook from 'alova/vue'
import adapterFetch from 'alova/fetch'

export const fetch_status = createAlova({
    baseURL: 'https://v2.mscpo.giize.com/',
    statesHook: VueHook,
    requestAdapter: adapterFetch(),
    responded: (response) => response.json(),
    id: 'status',
})
