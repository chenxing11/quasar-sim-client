// import something here

import api from 'src/api' // 导入api接口

// "async" is optional
export default async ({ app, router, Vue }) => {
  // something to do
  Vue.prototype.$api = api
  Vue.use(api)
}
