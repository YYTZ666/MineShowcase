import { createAlova } from "alova";
import VueHook from "alova/vue";
import adapterFetch from "alova/fetch";

export const fetch_status = createAlova({
  baseURL: "https://mscpoapi.tblstudio.cn/serves/info",
  statesHook: VueHook,
  requestAdapter: adapterFetch(),
  responded: (response) => response.json(),
  id: "status",
});
