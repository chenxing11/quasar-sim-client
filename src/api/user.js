/**
  * User模块接口列表
  */

import base from './base' // 导入接口域名列表
import axios from 'src/tools/http' // 导入http中创建的axios实例
// import qs from 'qs' // 根据需求是否导入qs模块

const User = {
  // 用户登录
  login (params) {
    return axios.post(`${base.id}/connect/token`, params)
  },
  // 用户信息
  info (params) {
    return axios.get(`${base.id}/api/user/info`, params)
  }
  // 其他接口…………
}

export default User
