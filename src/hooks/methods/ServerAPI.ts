import { createAlova } from "alova";
import VueHook from "alova/vue";
import adapterFetch from "alova/fetch";
// import { createAlovaMockAdapter } from '@alova/mock';
// import mockGroup from './alova-mock';

// const mockAdapter = createAlovaMockAdapter([mockGroup, /** ... */], {
//   enable: true,
//   httpAdapter: adapterFetch(),
//   delay: 1000,
//   mockRequestLogger: true,
//   onMockResponse: data => new Response(JSON.stringify(data))
// });

export const ServerAPI = createAlova({
  baseURL: "https://mscpoapi.tblstudio.cn/",
  statesHook: VueHook,
  requestAdapter: adapterFetch(),
  // requestAdapter: mockAdapter,
  responded: (response) => response.json(),
});
