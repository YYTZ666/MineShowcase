// 模拟数据

import { defineMock } from '@alova/mock';

export default defineMock(
  {
    // 捕获get请求
    '/todo': [1, 2, 3, 4],

    // rest风格请求
    '/todo/{id}': ({ params }) => {
      const id = params.id;
      // ...
      return {
        title: '...',
        time: '10:00'
      };
    },
);