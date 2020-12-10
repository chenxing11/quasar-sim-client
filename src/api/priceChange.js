import base from './base' // 导入接口域名列表
import axios from 'src/tools/http' // 导入http中创建的axios实例

const PriceChange = {
  ListPosPriceChangeInProcByLoc (locationId) { // 根据地点获取进行中的变价单
    return axios.get(`${base.posApi}/PosPriceChange/ListPosPriceChangeInProcByLoc`, {
      params: { locationId: locationId }
    })
  },
  GetPosPriceByItemId (locationId, id) { // 根据地点获取进商品变价信息
    return axios.get(`${base.posApi}/Pos/GetPosPriceByItemId`, {
      params: {
        store: locationId,
        id: id
      }
    })
  },
  CreatePosPriceChange (locationId) { // 创建变价单头
    return axios.get(`${base.posApi}/PosPriceChange/CreatePosPriceChange`, {
      params: { locationId: locationId }
    })
  },
  CreateOrUpdatePosPriceChangeLine (params) { // 创建变价单行
    return axios.get(`${base.posApi}/PosPriceChange/CreateOrUpdatePosPriceChangeLine`, {
      params
    })
  },
  GetPosPriceChangeById (posPriceChangeId) { // 根据ID获取变价单
    return axios.get(`${base.posApi}/PosPriceChange/GetPosPriceChangeById`, {
      params: { posPriceChangeId: posPriceChangeId }
    })
  },
  RemovePosPriceChangeLineById (posPriceChangeLineId) { // 移除变价单行
    return axios.get(`${base.posApi}/PosPriceChange/RemovePosPriceChangeLineById`, {
      params: { posPriceChangeLineId: posPriceChangeLineId }
    })
  },
  PosPriceChangeSubmit (posPriceChangeId) { // 变价单提交
    return axios.get(`${base.posApi}/PosPriceChange/PosPriceChangeSubmit`, {
      params: { posPriceChangeId: posPriceChangeId }
    })
  },
  ListPosPriceChangeSubmittedByLoc (locationId) { // 根据地点获取已提交的变价单
    return axios.get(`${base.posApi}/PosPriceChange/ListPosPriceChangeSubmittedByLoc`, {
      params: { locationId: locationId }
    })
  },
  PosPriceChangeReject (posPriceChangeId) { // 变价单拒绝
    return axios.get(`${base.posApi}/PosPriceChange/PosPriceChangeReject`, {
      params: { posPriceChangeId: posPriceChangeId }
    })
  },
  PosPriceChangeApproval (posPriceChangeId) { // 变价单审批
    return axios.get(`${base.posApi}/PosPriceChange/PosPriceChangeApproval`, {
      params: { posPriceChangeId: posPriceChangeId }
    })
  },
  QueryPosPriceChanges (locationId, posPriceChangeId, fromDate, toDate) { // 变价单查询
    return axios.get(`${base.posApi}/PosPriceChange/QueryPosPriceChanges`, {
      params: {
        locationId: locationId,
        posPriceChangeId: posPriceChangeId,
        fromDate: fromDate,
        toDate: toDate
      }
    })
  }
}

export default PriceChange
