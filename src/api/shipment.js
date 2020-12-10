/**
  * Rcv模块接口列表
  */

import base from './base' // 导入接口域名列表
import axios from 'src/tools/http' // 导入http中创建的axios实例
// import qs from 'qs' // 根据需求是否导入qs模块

const Ship = {
  // 通过Bol编号获取发运信息
  GetShipmentByBolNo (bolNo) {
    return axios.get(`${base.api}/Shipment/GetShipmentByBolNo`, {
      params: { bolNo: bolNo }
    })
  },
  GetShipmentByReturnId (returnId) {
    return axios.get(`${base.api}/Shipment/GetShipmentByReturnId`, {
      params: { returnId: returnId }
    })
  },
  GetShipmentsCountByDate (params) {
    return axios.get(`${base.api}/Shipment/GetShipmentsCountByDate`, {
      params: params
    })
  },
  GetWTSShipmentList (locationId) { // 获取配送单列表
    return axios.get(`${base.api}/Shipment/ListWTSShipmentInProcByLoc`, {
      params: { locationId: locationId }
    })
  },
  GetWTSShipmentByBolNo (bolNo) { // 获取配送单详情
    return axios.get(`${base.api}/Shipment/GetWTSShipmentByBolNo`, {
      params: { bolNo: bolNo }
    })
  },
  CompleteWTSShipment (shipmentId) { // 配送单收货
    return axios.get(`${base.api}/Shipment/CompleteWTSShipment`, {
      params: { shipmentId: shipmentId }
    })
  },
  GetShipmentReceivingByBolNo (bolNo) { // 通过Bol编号获取收货信息
    return axios.get(`${base.api}/Shipment/GetShipmentReceivingByBolNo`, {
      params: { bolNo: bolNo }
    })
  },
  ListShipments (LocationId, DocumentType, DocumentNumber, ShipmentId, ReceivedDateFrom, ReceivedDateTo, Status, SupplierId) { // 收货单据查询
    return axios.post(`${base.api}/Shipment/ListShipments`, {
      LocationId: LocationId,
      DocumentType: DocumentType,
      DocumentNumber: DocumentNumber,
      ShipmentId: ShipmentId,
      ReceivedDateFrom: ReceivedDateFrom,
      ReceivedDateTo: ReceivedDateTo,
      Status: Status,
      SupplierId: SupplierId
    })
  },
  DeleteShipmentById (shipmentId) { // 删除SHIPMENT
    return axios.get(`${base.api}/Shipment/DeleteShipmentById`, {
      params: { shipmentId: shipmentId }
    })
  },
  CompleteFreshPoShipment (documentOrderId) {
    return axios.get(`${base.api}/Shipment/CompleteFreshPoShipment`, {
      params: { documentOrderId: documentOrderId }
    })
  },
  WTSItemReceive (params) {
    return axios.post(`${base.api}/Shipment/WTSItemReceive`, params)
  },
  CompleteWTSShipmentActualReceived (params) {
    return axios.post(`${base.api}/Shipment/CompleteWTSShipmentActualReceived`,
      params
    )
  }
}

export default Ship
