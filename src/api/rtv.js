/**
  * Rcv模块接口列表
  */

import base from './base' // 导入接口域名列表
import axios from 'src/tools/http' // 导入http中创建的axios实例
// import qs from 'qs' // 根据需求是否导入qs模块

const Rtv = {
  // 根据退货单号获取退货信息
  getRtv (params) {
    return axios.get(`${base.api}/Return/GetReturnByExternalNo`, {
      params: { externalNo: params }
    })
  },
  // 根据地点获取进行中的退货单列表
  ListRtvByLoc (locationId) {
    return axios.get(`${base.api}/Return/ListReturnInProcByLoc`, {
      params: { locationId: locationId }
    })
  },
  // 退货单商品发运
  poRtvItem (params) {
    return axios.post(`${base.api}/Return/ReturnItemShip`, params)
  },
  // 完成退货
  completeRtv (shipmentId) {
    return axios.get(`${base.api}/Return/CompletReturnShip`, {
      params: { shipmentId: shipmentId }
    })
  },
  cancelRtv (rtvExternalNo) {
    return axios.get(`${base.api}/Return/CancelReturn`, {
      params: { rtvExternalNo: rtvExternalNo }
    })
  },
  ListAllReturnReasons () { // 获取退货原因
    return axios.get(`${base.api}/Return/ListAllReturnReasons`)
  },
  ListReturnIntentionInProcByLoc (locationId) { // 退货申请单列表
    return axios.get(`${base.api}/ReturnIntention/ListReturnIntentionInProcByLoc`, {
      params: {
        locationId: locationId
      }
    })
  },
  CreateReturnIntention (locationId) { // 创建退货申请单头
    return axios.get(`${base.api}/ReturnIntention/CreateReturnIntention`, {
      params: {
        locationId: locationId
      }
    })
  },
  CreateOrUpdateReturnIntentionLine (returnIntentionId, itemId, supplierId, quantity, unitCost, returnReasonId) { // 创建退货申请单行
    return axios.get(`${base.api}/ReturnIntention/CreateOrUpdateReturnIntentionLine`, {
      params: {
        returnIntentionId: returnIntentionId,
        itemId: itemId,
        supplierId: supplierId,
        quantity: quantity,
        unitCost: unitCost,
        returnReasonId: returnReasonId
      }
    })
  },
  RemoveReturnIntentionLineById (returnIntentionLineId) { // 移除退货申请单行
    return axios.get(`${base.api}/ReturnIntention/RemoveReturnIntentionLineById`, {
      params: {
        returnIntentionLineId: returnIntentionLineId
      }
    })
  },
  GetReturnIntentionById (returnIntentionId) { // 根据Id获取退货申请单
    return axios.get(`${base.api}/ReturnIntention/GetReturnIntentionById`, {
      params: {
        returnIntentionId: returnIntentionId
      }
    })
  },
  ReturnIntentionSubmit (returnIntentionId) { // 退货申请单提交
    return axios.get(`${base.api}/ReturnIntention/ReturnIntentionSubmit`, {
      params: {
        returnIntentionId: returnIntentionId
      }
    })
  },
  ListReturnIntentionInSubmittedByLoc (locationId) { // 根据地点获取已提交的退货单
    return axios.get(`${base.api}/ReturnIntention/ListReturnIntentionInSubmittedByLoc`, {
      params: {
        locationId: locationId
      }
    })
  },
  ReturnIntentionApproval (returnIntentionId) { // 退货申请单审批
    return axios.get(`${base.api}/ReturnIntention/ReturnIntentionApproval`, {
      params: {
        returnIntentionId: returnIntentionId
      }
    })
  },
  ReturnIntentionReject (returnIntentionId) { // 退货申请单拒绝
    return axios.get(`${base.api}/ReturnIntention/ReturnIntentionReject`, {
      params: {
        returnIntentionId: returnIntentionId
      }
    })
  },
  QueryReturnIntentions (params) { // 退货申请单查询
    return axios.post(`${base.api}/ReturnIntention/QueryReturnIntentions`, params)
  }
  // 其他接口…………
}

export default Rtv
