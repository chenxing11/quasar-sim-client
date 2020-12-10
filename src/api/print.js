/**
  * Rcv模块接口列表
  */

import base from './base' // 导入接口域名列表
import axios from 'src/tools/tokenless' // 导入http中创建的axios实例
// import qs from 'qs' // 根据需求是否导入qs模块

const Print = {
// 根据订单号获取订单信息
  P_getOrder (params, Authorization) {
    return axios.get(`${base.api}/Order/GetOrderByExternalNo`, {
      params: { externalNo: params },
      headers: { Authorization: Authorization }
    })
  },
  // 自定义token获取用户信息
  NoToken_info (Authorization) {
    return axios.get(`${base.id}/api/user/info`, {
      headers: { Authorization: Authorization }
    })
  },
  // 根据收货ID获取收货信息
  P_getShipmentById (shipmentId, Authorization) {
    return axios.get(`${base.api}/Shipment/GetShipmentById`, {
      params: { shipmentId: shipmentId },
      headers: { Authorization: Authorization }
    })
  },
  P_getRtv (params, Authorization) {
    return axios.get(`${base.api}/Return/GetReturnByExternalNo`, {
      params: { externalNo: params },
      headers: { Authorization: Authorization }
    })
  },
  P_GetShipmentByBolNo (bolNo, Authorization) {
    return axios.get(`${base.api}/Shipment/GetShipmentByBolNo`, {
      params: { bolNo: bolNo },
      headers: { Authorization: Authorization }
    })
  },
  P_GetShipmentByReturnId (returnId, Authorization) {
    return axios.get(`${base.api}/Shipment/GetShipmentByReturnId`, {
      params: { returnId: returnId },
      headers: { Authorization: Authorization }
    })
  },
  P_getRtw (params, Authorization) {
    return axios.get(`${base.api}/Transfer/GetTransferByExternalNo`, {
      params: { externalNo: params },
      headers: { Authorization: Authorization }
    })
  },
  P_getSupLoc (supplierId, locationId, Authorization) {
    return axios.get(`${base.api}/SupplierLocation/GetSupplierLocation`, {
      params: { supplierId: supplierId, locationId: locationId },
      headers: { Authorization: Authorization }
    })
  },
  P_Rcv (params) {
    return axios.post(`${base.print}/post`, params)
  },
  P_info (Authorization) {
    return axios.get(`${base.id}/api/user/info`, {
      headers: { Authorization: Authorization }
    })
  },
  P_GetWTSShipmentByBolNo (bolNo, Authorization) { // 获取配送单详情
    return axios.get(`${base.api}/Shipment/GetWTSShipmentByBolNo`, {
      params: { bolNo: bolNo },
      headers: { Authorization: Authorization }
    })
  }
  // 其他接口…………
}

export default Print
