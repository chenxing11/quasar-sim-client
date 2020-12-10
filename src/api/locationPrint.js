/**
 * Rcv模块接口列表
 */

import base from './base' // 导入接口域名列表
import axios from 'src/tools/http' // 导入http中创建的axios实例

const LocationPrint = {
  // 价签打印
  ListLocationPrinters (locationId, authName, jobName) { // 根据商品编码或条码获取门店商品信息
    return axios.get(`${base.api}/LocationPrinter/ListLocationPrinters`, {
      params: {
        locationId: locationId,
        authName: authName,
        jobName: jobName
      }
    })
  },
  ListAllLocationPrinters (locationId, authName) { // 根据商品编码或条码获取门店商品信息
    return axios.get(`${base.api}/LocationPrinter/ListAllLocationPrinters`, {
      params: {
        locationId: locationId,
        authName: authName
      }
    })
  },
  GetItemTagPrintTodayByBay (bay) { // 价签打印历史查询
    return axios.get(`${base.api}/ItemTagPrint/GetItemTagPrintTodayByBay`, {
      params: {
        bay: bay
      }
    })
  }
  // 其他接口…………
}

export default LocationPrint
