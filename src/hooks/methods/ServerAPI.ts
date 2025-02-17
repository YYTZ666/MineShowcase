import { createAlova } from 'alova';
import VueHook from 'alova/vue';
import adapterFetch from 'alova/fetch';

export const ServerAPI = createAlova({
    baseURL: 'http://tblstudio.cn:5231/',
    statesHook: VueHook,
    requestAdapter: adapterFetch(),
    responded: response => response.json()
});