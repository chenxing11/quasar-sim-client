import base from './base' // 导入接口域名列表
import axios from 'src/tools/http' // 导入http中创建的axios实例

const Erp = {
  // 根据门店和订单号获取库存信息
  getItemInfo (locationId, idOrBarcode) {
    return axios.get(`${base.api}/ERP/GetItemInfo`, {
      params: {
        locationId: locationId,
        itemNo: idOrBarcode
      }
    })
  },
  // 根据门店和订单号是否有促销
  getItemDC (locationId, idOrBarcode) {
    return axios.get(`${base.api}/ERP/GetItemDC`, {
      params: {
        locationId: locationId,
        itemNo: idOrBarcode
      }
    })
  },
  // 获取库存信息
  GetItemLocSoh (locationId, itemId) {
    return axios.get(`${base.api}/ERP/GetItemLocSoh`, {
      params: {
        locationId: locationId,
        itemId: itemId
      }
    })
  },
  GetSupplierLocationItems (supplierId, locationId, itemId) {
    return axios.get(`${base.api}/ERP/GetSupplierLocationItems`, {
      params: {
        supplierId: supplierId,
        locationId: locationId,
        itemId: itemId
      }
    })
  },
  GetSupplierLocationItemList (supplierId, locationId) {
    return axios.get(`${base.api}/ERP/GetSupplierLocationItemList`, {
      params: {
        supplierId: supplierId,
        locationId: locationId
      }
    })
  },
  GetFreshSupplier (locationId) {
    return axios.get(`${base.api}/ERP/GetFreshSupplier`, {
      params: {
        locationId: locationId
      }
    })
  }
}

export default Erp
