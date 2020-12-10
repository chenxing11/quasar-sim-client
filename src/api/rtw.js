/**
  * Rcv模块接口列表
  */

import base from './base' // 导入接口域名列表
import axios from 'src/tools/http' // 导入http中创建的axios实例
// import qs from 'qs' // 根据需求是否导入qs模块

const Rtw = {
  // 根据订单号获取订单信息
  getRtw (params) {
    return axios.get(`${base.api}/Transfer/GetTransferByExternalNo`, {
      params: { externalNo: params }
    })
  },
  // 根据地点获取进行中的返仓单列表
  ListRtwByLoc (locationId) {
    return axios.get(`${base.api}/Transfer/ListReturnToWhInProcByLoc`, {
      params: { locationId: locationId }
    })
  },
  poRtwItem (params) {
    return axios.post(`${base.api}/Transfer/TransferItemShip`, params)
  },
  completeRtw (shipmentId) {
    return axios.get(`${base.api}/Transfer/CompleteTransferShip`, {
      params: { shipmentId: shipmentId }
    })
  },
  cancelRtw (bolNo) {
    return axios.get(`${base.api}/Transfer/CancelReturnToWh`, {
      params: { bolNo: bolNo }
    })
  },
  GetItemInfoForReturnIntention (locationId, itemId) { // 获取退货商品信息
    return axios.get(`${base.api}/ReturnIntention/GetItemInfoForReturnIntention`, {
      params: {
        locationId: locationId,
        itemId: itemId
      }
    })
  },
  GetItemInfoForReturnToWh (fromLocationId, itemId, toLocationId) { // 退货申请商品信息
    return axios.get(`${base.api}/ReturnToWh/GetItemInfoForReturnToWh`, {
      params: {
        fromLocationId: fromLocationId,
        itemId: itemId,
        toLocationId: toLocationId
      }
    })
  },
  CreateReturnToWh (fromLocationId) { // 创建返仓申请单
    return axios.get(`${base.api}/ReturnToWh/CreateReturnToWh`, {
      params: {
        fromLocationId: fromLocationId
      }
    })
  },
  CreateOrUpdateReturnToWhLine (returnToWhId, toLocationId, itemId, supplierId, reason, quantity, unitCost) { // 创建返仓申请单行
    return axios.get(`${base.api}/ReturnToWh/CreateOrUpdateReturnToWhLine`, {
      params: {
        returnToWhId: returnToWhId,
        toLocationId: toLocationId,
        itemId: itemId,
        supplierId: supplierId,
        reason: reason,
        quantity: quantity,
        unitCost: unitCost
      }
    })
  },
  RemoveReturnToWhLineById (returnToWhLineId) { // 移除申请单行
    return axios.get(`${base.api}/ReturnToWh/RemoveReturnToWhLineById`, {
      params: {
        returnToWhLineId: returnToWhLineId
      }
    })
  },
  ReturnToWhSubmit (returnToWhId) { // 申请单行提交
    return axios.get(`${base.api}/ReturnToWh/ReturnToWhSubmit`, {
      params: {
        returnToWhId: returnToWhId
      }
    })
  },
  GetReturnToWhById (returnToWhId) { // 根据ID获取返仓申请单
    return axios.get(`${base.api}/ReturnToWh/GetReturnToWhById`, {
      params: {
        returnToWhId: returnToWhId
      }
    })
  },
  ListReturnToWhInProcByLoc (locationId) { // 根据门店获取进行中的返仓申请单
    return axios.get(`${base.api}/ReturnToWh/ListReturnToWhInProcByLoc`, {
      params: {
        locationId: locationId
      }
    })
  },
  ListReturnToWhInSubmittedByLoc (locationId) { // 根据门店获取已提交的返仓单
    return axios.get(`${base.api}/ReturnToWh/ListReturnToWhInSubmittedByLoc`, {
      params: {
        locationId: locationId
      }
    })
  },
  ReturnToWhApproval (returnToWhId) { // 返仓申请单审批
    return axios.get(`${base.api}/ReturnToWh/ReturnToWhApproval`, {
      params: {
        returnToWhId: returnToWhId
      }
    })
  },
  ReturnToWhReject (returnToWhId) { // 返仓申请单拒绝
    return axios.get(`${base.api}/ReturnToWh/ReturnToWhReject`, {
      params: {
        returnToWhId: returnToWhId
      }
    })
  },
  QueryReturnToWhs (params) { // 返仓申请单查询
    return axios.post(`${base.api}/ReturnToWh/QueryReturnToWhs`, params)
  }
}

export default Rtw
