/**
 * Rcv模块接口列表
 */

import base from './base' // 导入接口域名列表
import axios from 'src/tools/http' // 导入http中创建的axios实例
// import qs from 'qs' // 根据需求是否导入qs模块

const SupplierLocation = {
  // 通过供应商ID，门店ID创建需求单
  GetSupplierLocationItems (supplierId, locationId) {
    return axios.get(`${base.api}/SupplierLocation/GetSupplierLocationItems`, {
      params: {
        locationId: locationId,
        supplierId: supplierId
      }
    })
  }
}

export default SupplierLocation
