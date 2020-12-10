import base from './base' // 导入接口域名列表
import axios from 'src/tools/http' // 导入http中创建的axios实例

const Transfer = {
  ListStoreTransferRequestInProc (toLocationId) { // 获取店间调拨申请列表
    return axios.get(`${base.api}/Transfer/ListStoreTransferRequestInProc`, {
      params: {
        toLocationId: toLocationId
      }
    })
  },
  TransferRequestCreate (toLocationId, fromLocationId) { // 店间调拨请求创建
    return axios.post(`${base.api}/Transfer/StoreTransferRequestCreate`, {
      ToLocationId: toLocationId,
      FromLocationId: fromLocationId
    })
  },
  TransferItemRequest (transferId, ItemId, Barcode, RequestQty) { // 店间调拨商品请求
    return axios.post(`${base.api}/Transfer/StoreTransferItemRequest`, {
      TransferId: transferId,
      ItemId: ItemId,
      Barcode: Barcode,
      RequestQty: RequestQty
    })
  },
  SubmitStoreTransferRequest (transferId) { // 店间调拨申请提交
    return axios.get(`${base.api}/Transfer/SubmitStoreTransferRequest`, {
      params: {
        transferId: transferId
      }
    })
  },
  GetTransferById (transferId) { // 通过转移单号获取转移单信息
    return axios.get(`${base.api}/Transfer/GetTransferById`, {
      params: {
        transferId: transferId
      }
    })
  },
  ListStoreTransferRequest (fromLocationId) { // 调出门店获取店间调拨申请列表
    return axios.get(`${base.api}/Transfer/ListStoreTransferRequest`, {
      params: {
        fromLocationId: fromLocationId
      }
    })
  },
  StoreTransferItemAccept (transferId, ItemId, Barcode, acceptQty) { // 店间调拨商品接受
    return axios.post(`${base.api}/Transfer/StoreTransferItemAccept`, {
      TransferId: transferId,
      ItemId: ItemId,
      Barcode: Barcode,
      TransferQty: acceptQty
    })
  },
  StoreTransferAccept (transferId) { // 店间调拨接受
    return axios.get(`${base.api}/Transfer/StoreTransferAccept`, {
      params: {
        transferId: transferId
      }
    })
  },
  ListStoreTransferAccepted (fromLocationId) { // 调出门店获取已接受的店间调拨
    return axios.get(`${base.api}/Transfer/ListStoreTransferAccepted`, {
      params: {
        fromLocationId: fromLocationId
      }
    })
  },
  StoreTransferItemShip (transferId, ItemId, Barcode, ShipQty) { // 店间调拨商品发运
    return axios.post(`${base.api}/Transfer/StoreTransferItemShip`, {
      TransferId: transferId,
      ItemId: ItemId,
      Barcode: Barcode,
      ShipQty: ShipQty
    })
  },
  StoreTransferShip (transferId) { // 店间调拨发运
    return axios.get(`${base.api}/Transfer/StoreTransferShip`, {
      params: {
        transferId: transferId
      }
    })
  },
  ListStoreTransferShipped (toLocationId) { // 调入门店获取已发运的店调拨
    return axios.get(`${base.api}/Transfer/ListStoreTransferShipped`, {
      params: {
        toLocationId: toLocationId
      }
    })
  },
  StoreTransferReceiveTotally (transferId) { // 店间调拨一键接收
    return axios.get(`${base.api}/Transfer/StoreTransferReceiveTotally`, {
      params: {
        transferId: transferId
      }
    })
  },
  // StoreTransferItemReceive (transferId, ItemId, Barcode, ReceiveQty) { // 店间调拨商品接收
  //   return axios.post(`${base.api}/Transfer/StoreTransferItemReceive`, {
  //     TransferId: transferId,
  //     ItemId: ItemId,
  //     Barcode: Barcode,
  //     ReceivedQty: ReceiveQty
  //   })
  // }
  StoreTransferItemDelete (transferLineId) { // 店间调拨商品删除
    return axios.get(`${base.api}/Transfer/StoreTransferItemDelete`, {
      params: {
        transferLineId: transferLineId
      }
    })
  },
  StoreTransferReject (transferId) { // 店间调拨拒绝
    return axios.get(`${base.api}/Transfer/StoreTransferReject`, {
      params: {
        transferId: transferId
      }
    })
  },
  StoreTransferShipCancel (transferId) { // 店间调拨发运取消
    return axios.get(`${base.api}/Transfer/StoreTransferShipCancel`, {
      params: {
        transferId: transferId
      }
    })
  },
  StoreTransferRequestCancel (transferId) { // 店间调拨申请取消
    return axios.get(`${base.api}/Transfer/StoreTransferRequestCancel`, {
      params: {
        transferId: transferId
      }
    })
  }
}

export default Transfer
