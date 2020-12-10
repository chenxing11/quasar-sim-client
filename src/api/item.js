import base from './base' // 导入接口域名列表
import axios from 'src/tools/http' // 导入http中创建的axios实例

const Item = {
  getShop (locationId, idOrBarcode) { // 根据商品编码或条码获取门店商品信息
    console.log(locationId, idOrBarcode)
    return axios.get(`${base.api}/Item/GetStoreItemByIdOrBarcode`, {
      params: {
        locationId: locationId,
        idOrBarcode: idOrBarcode
      }
    })
  },
  createItemTagPrint (params) { // 创建打印头
    return axios.post(`${base.api}/ItemTagPrint/CreateItemTagPrint`,
      params
    )
  }
}

export default Item
