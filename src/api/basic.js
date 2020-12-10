/**
  * Rcv模块接口列表
  */

import base from './base' // 导入接口域名列表
import axios from 'src/tools/http' // 导入http中创建的axios实例
// import qs from 'qs' // 根据需求是否导入qs模块

const Basic = {
  // 获取门店列表
  listStores () {
    return axios.get(`${base.api}/Location/ListStores`)
  }
  // 其他接口…………
}

export default Basic
