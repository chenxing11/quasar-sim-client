/**
 * Rcv模块接口列表
 */

import base from './base' // 导入接口域名列表
import axios from 'src/tools/http' // 导入http中创建的axios实例
// import qs from 'qs' // 根据需求是否导入qs模块

const Purchase = {
  // 通过供应商ID，门店ID创建需求单
  CreatePurchaseIntention(supplierId, locationId) {
    return axios.get(`${base.api}/PurchaseIntention/CreatePurchaseIntention`, {
      params: {
        locationId: locationId,
        supplierId: supplierId
      }
    })
  },
  GetPurchaseIntentionById(purchaseIntentionId) {
    return axios.get(`${base.api}/PurchaseIntention/GetPurchaseIntentionById`, {
      params: {
        purchaseIntentionId: purchaseIntentionId
      }
    })
  },
  CreateOrUpdatePurchaseIntentionLine(purchaseIntentionId, itemId, qtyOrdered) {
    return axios.get(`${base.api}/PurchaseIntention/CreateOrUpdatePurchaseIntentionLine`, {
      params: {
        purchaseIntentionId: purchaseIntentionId,
        itemId: itemId,
        qtyOrdered: qtyOrdered
      }
    })
  },
  PurchaseIntentionSubmit(locationId, id) { // 提交
    return axios.get(`${base.api}/PurchaseIntention/PurchaseIntentionSubmit`, {
      params: {
        locationId: locationId,
        id: id
      }
    })
  },
  QueryPurchaseIntentions(params) { // 查询
    return axios.post(`${base.api}/PurchaseIntention/QueryPurchaseIntentions`,
      params)
  },
  PurchaseIntentionApprove(locationId, id) { // 审批
    return axios.get(`${base.api}/PurchaseIntention/PurchaseIntentionApprove`, {
      params: {
        locationId: locationId,
        id: id
      }
    })
  },
  PurchaseIntentionReject(locationId, id) { // 驳回
    return axios.get(`${base.api}/PurchaseIntention/PurchaseIntentionReject`, {
      params: {
        locationId: locationId,
        id: id
      }
    })
  },
  PurchaseIntentionDiscard(purchaseIntentionId) { // 采购意向单作废
    return axios.get(`${base.api}/PurchaseIntention/PurchaseIntentionDiscard`, {
      params: {
        purchaseIntentionId: purchaseIntentionId
      }
    })
  },
  RemovePurchaseIntentionLine(purchaseIntentionLineId) { // 删除采购意向单行
    return axios.get(`${base.api}/PurchaseIntention/RemovePurchaseIntentionLine`, {
      params: {
        purchaseIntentionLineId: purchaseIntentionLineId
      }
    })
  },
  GetPurchaseIntentionSummary(locationId, supplierId, createDate) { // 已批
    return axios.get(`${base.api}/PurchaseIntention/GetPurchaseIntentionSummary`, {
      params: {
        locationId: locationId,
        supplierId: supplierId,
        createDate: createDate
      }
    })
  }
}

export default Purchase
