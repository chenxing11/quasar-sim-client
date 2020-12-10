/**
  * Rcv模块接口列表
  */

import base from './base' // 导入接口域名列表
import axios from 'src/tools/http' // 导入http中创建的axios实例
// import qs from 'qs' // 根据需求是否导入qs模块

const Rcv = {
  // 根据订单号获取订单信息
  getOrder (params) {
    return axios.get(`${base.api}/Order/GetOrderByExternalNo`, {
      params: { externalNo: params }
    })
  },
  // 根据门店获取收货信息（直送）
  getPoListShipment (locationId) {
    return axios.get(`${base.api}/Shipment/ListPoShipmentInProcByLoc`, {
      params: { locationId: locationId }
    })
  },
  // 根据门店获取收货信息（永续有订单）
  getPoDsdListShipment (locationId) {
    return axios.get(`${base.api}/Shipment/ListPoDsdShipmentInProcByLoc`, {
      params: { locationId: locationId }
    })
  },
  // 根据门店获取收货信息（永续无订单）
  getDsdListShipment (locationId) {
    return axios.get(`${base.api}/Shipment/ListDsdShipmentInProcByLoc`, {
      params: { locationId: locationId }
    })
  },
  // 根据订单ID获取收货信息
  getShipmentByOrderId (orderId) {
    return axios.get(`${base.api}/Shipment/GetShipmentByOrderId`, {
      params: { orderId: orderId }
    })
  },
  // 根据收货ID获取收货信息
  getShipmentById (shipmentId) {
    return axios.get(`${base.api}/Shipment/GetShipmentById`, {
      params: { shipmentId: shipmentId }
    })
  },
  // 根据门店ID，供应商号获取待退货信息
  getRtv (supplierId, locationId) {
    return axios.get(`${base.api}/Return/ListRetInProcBySupLoc`, {
      params: {
        supplierId: supplierId,
        locationId: locationId }
    })
  },
  // 根据条码+门店获取商品信息
  getitem (locationId, idOrBarcode) {
    return axios.get(`${base.api}/Item/GetItemByIdOrBarcode`, {
      params: {
        locationId: locationId,
        idOrBarcode: idOrBarcode
      }
    })
  },
  // getShop (locationId, idOrBarcode) {
  //   console.log(locationId, idOrBarcode)
  //   return axios.get(`${base.api}/Item/GetStoreItemByIdOrBarcode`, {
  //     params: {
  //       locationId: locationId,
  //       idOrBarcode: idOrBarcode
  //     }
  //   })
  // },
  // 根据供应商号获取供应商信息
  getSupplier (supplierId) {
    return axios.get(`${base.api}/Supplier/GetSupplierById`, {
      params: {
        supplierId: supplierId
      }
    })
  },
  // 根据供应商号获取供应商信息
  getUnitCost (itemId, supplierId, storeId) {
    return axios.get(`${base.api}/Item/GetStoreItemPoUnitCost`, {
      params: {
        itemId: itemId,
        supplierId: supplierId,
        storeId: storeId
      }
    })
  },
  // 无订单收货检索商品
  getItemForDsdReceipt (params) {
    return axios.post(`${base.api}/Shipment/GetItemForDsdReceipt`, params)
  },
  // 供应商直送订单收货
  poItemReceive (params) {
    return axios.post(`${base.api}/Shipment/PoItemReceive`, params)
  },
  // 有订单永续收货
  PoDsdItemReceive (params) {
    return axios.post(`${base.api}/Shipment/PoDsdItemReceive`, params)
  },
  // 无订单永续收货
  DsdItemReceive (params) {
    return axios.post(`${base.api}/Shipment/DsdItemReceive`, params)
  },
  // 完成收货
  completePo (params) {
    return axios.get(`${base.api}/Shipment/CompletePoShipment`, {
      params: { shipmentId: params }
    })
  },
  // 永续有订单完成收货
  completePoDsd (params) {
    return axios.get(`${base.api}/Shipment/CompletePoDsdShipment`, {
      params: { shipmentId: params }
    })
  },
  // 无订单成收货
  completeDsd (params) {
    return axios.get(`${base.api}/Shipment/CompleteDsdShipment`, {
      params: { shipmentId: params }
    })
  },
  // 当天完成收货
  listShipmented (locationId) {
    return axios.get(`${base.api}/Shipment/ListShipmentCompletedTodayByLoc`, {
      params: { locationId: locationId }
    })
  },
  // 收货后数量调整
  ReceiveUnitsAdjust (params) {
    return axios.post(`${base.api}/RcvUnitsAdj/ReceiveUnitsAdjust`, params)
  },
  // 收货后数量调整完成
  completeRcvUnitsAdj (rcvUnitsAdjId) {
    return axios.get(`${base.api}/RcvUnitsAdj/CompleteRcvUnitsAdj`, {
      params: { rcvUnitsAdjId: rcvUnitsAdjId }
    })
  },
  GetOrderByDocumentOrderId (documentOrderId) {
    return axios.get(`${base.api}/Order/GetOrderByDocumentOrderId`, {
      params: { documentOrderId: documentOrderId }
    })
  }
  // 其他接口…………
}

export default Rcv
