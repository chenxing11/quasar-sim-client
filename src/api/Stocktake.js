import base from './base' // 导入接口域名列表
import axios from 'src/tools/http' // 导入http中创建的axios实例

const Stocktake = {
  getStocktakeList (params) {
    return axios.get(`${base.api}/Stocktake/GetStocktakeListByLocationStatus`, {
      params
    })
  },
  getStocktakeLayoutImp (StocktakeLocationId) {
    return axios.post(`${base.api}/StocktakeLayoutImp/GetStocktakeLayoutImp`, {
      StocktakeLocationId: StocktakeLocationId
    })
  },
  getStocktakeUsersImp (StocktakeLocationId) {
    return axios.post(`${base.api}/StocktakeUsersImp/GetStocktakeUsersImp`, {
      StocktakeLocationId: StocktakeLocationId
    })
  },
  getStocktakeAreaList (StocktakeLocationId) { // 获取区域
    return axios.get(`${base.api}/Stocktake/GetStocktakeAreaListByStocktakeLocationId`, {
      params: {
        StocktakeLocationId: StocktakeLocationId
      }
    })
  },
  getStocktakeGroupList (StocktakeLocationId, areaId) { // 获取区域下品类组
    return axios.get(`${base.api}/Stocktake/GetStocktakeGroupListByStocktakeLocationIdAndAreaId`, {
      params: {
        StocktakeLocationId: StocktakeLocationId,
        areaId: areaId
      }
    })
  },
  getStocktakeLayoutLine (StocktakeLocationId, areaId, zone, bay) { // 获取盘点布局
    return axios.get(`${base.api}/StocktakeLayout/GetStocktakeLayoutLineIdByStocktakeLocationIdAndETC`, {
      params: {
        stocktakeLocationId: StocktakeLocationId,
        areaId: areaId,
        zone: zone,
        bay: bay
      }
    })
  },
  closeStocktakeLayoutLine (stocktakeLayoutLineId, countedBy, countedByRealName, // 关闭盘点布局明细
    recordedBy, recordedByRealName) {
    return axios.get(`${base.api}/StocktakeLayout/CloseStocktakeLayoutLine`, {
      params: {
        stocktakeLayoutLineId: stocktakeLayoutLineId,
        countedBy: countedBy,
        countedByRealName: countedByRealName,
        recordedBy: recordedBy,
        recordedByRealName: recordedByRealName
      }
    })
  },
  openStocktakeLayoutLine (StocktakeLocationId, areaId, zone, bay, countedBy, countedByRealName, // 锁定盘点布局
    recordedBy, recordedByRealName) {
    return axios.get(`${base.api}/StocktakeLayout/OpenStocktakeLayoutLine`, {
      params: {
        StocktakeLocationId: StocktakeLocationId,
        areaId: areaId,
        zone: zone,
        bay: bay,
        countedBy: countedBy,
        countedByRealName: countedByRealName,
        recordedBy: recordedBy,
        recordedByRealName: recordedByRealName
      }
    })
  },
  getStocktakeSku (StocktakeLocationId, itemOrBarcode) { // 获取盘点商品信息
    return axios.get(`${base.api}/StocktakeLayout/GetStocktakeSkuByStocktakeLocationIdAndItemOrBarcode`, {
      params: {
        StocktakeLocationId: StocktakeLocationId,
        itemOrBarcode: itemOrBarcode
      }
    })
  },
  getStocktakeLayoutLinesByRecordedByAndGroup (StocktakeLocationId, recordedBy, areaId, groupId) { // 获取录入人盘点布局明细
    return axios.get(`${base.api}/StocktakeLayout/GetStocktakeLayoutLinesByRecordedByAndGroup`, {
      params: {
        areaId: areaId,
        groupId: groupId,
        StocktakeLocationId: StocktakeLocationId,
        recordedBy: recordedBy // recordedBy
      }
    })
  },
  getStocktakeCount (stocktakeLayoutLineId) { // 获取录入人盘点布局明细
    return axios.get(`${base.api}/StocktakeLayout/GetStocktakeCountByStocktakeLayoutLineId`, {
      params: {
        stocktakeLayoutLineId: stocktakeLayoutLineId
      }
    })
  },
  createOrUpdateStocktakeCount (stocktakeSkuId, qty, createdBy, stocktakeLayoutLineId) { // 盘点录入
    return axios.get(`${base.api}/StocktakeLayout/CreateOrUpdateStocktakeCount`, {
      params: {
        stocktakeSkuId: stocktakeSkuId,
        qty: qty,
        createdBy: createdBy,
        stocktakeLayoutLineId: stocktakeLayoutLineId
      }
    })
  },
  resetStocktakeLayoutLine (stocktakeLocationLineId, areaId, zone, bay, countedBy, recordedBy) { // 清除bay
    return axios.get(`${base.api}/StocktakeLayout/ResetStocktakeLayoutLine`, {
      params: {
        areaId: areaId,
        stocktakeLocationLineId: stocktakeLocationLineId,
        zone: zone,
        bay: bay,
        countedBy: countedBy,
        recordedBy: recordedBy
      }
    })
  },
  openStocktake (stocktakeId) { // 开启盘点
    return axios.get(`${base.api}/Stocktake/OpenStocktakeById`, {
      params: {
        stocktakeId: stocktakeId
      }
    })
  },
  closeStocktake (stocktakeId) { // 结束盘点
    return axios.get(`${base.api}/Stocktake/CLoseStocktakeById`, {
      params: {
        stocktakeId: stocktakeId
      }
    })
  },
  cancelStocktake (stocktakeId) { // 作废盘点
    return axios.get(`${base.api}/Stocktake/CancelStocktakeById`, {
      params: {
        stocktakeId: stocktakeId
      }
    })
  },
  getStocktakeLayoutLines (stocktakeLocationId, status, areaId, groupId) { // 获取布局明细列表
    return axios.get(`${base.api}/StocktakeLayout/GetStocktakeLayoutLinesByStLocAreaGroupStatus`, {
      params: {
        stocktakeLocationId: stocktakeLocationId,
        groupId: groupId, // 可为空
        areaId: areaId, // 可为空
        status: status // IPC / IP  全部 / 未关闭
      }
    })
  },
  getStocktakeLayoutLineCount (stocktakeLocationId, areaId, groupId) { // 获取盘点进度
    return axios.get(`${base.api}/StocktakeLayout/GetStocktakeLayoutLineCount`, {
      params: {
        stocktakeLocationId: stocktakeLocationId,
        groupId: groupId, // 可为空
        areaId: areaId // 可为空
      }
    })
  },
  sendPrintJobToPOS (itemTagPrintId) { // 传输打印机
    return axios.get(`${base.api}/ItemTagPrint/SendPrintJobToPOS`, {
      params: {
        itemTagPrintId: itemTagPrintId
      }
    })
  },
  createItemTagPrint (params) { // 创建打印头
    return axios.post(`${base.api}/ItemTagPrint/CreateItemTagPrint`,
      params
    )
  },
  createItemTagPrintLine (params) { // 创建打印行
    return axios.post(`${base.api}/ItemTagPrint/CreateItemTagPrintLine`,
      params
    )
  },
  deleteItemTagPrintLine (itemTagPrintLineId) { // 删除打印行
    return axios.get(`${base.api}/ItemTagPrint/DeleteItemTagPrintLine`, {
      params: {
        itemTagPrintLineId: itemTagPrintLineId
      }
    })
  },
  listItemTagPrintToday (params) { // 删除打印行
    return axios.get(`${base.api}/ItemTagPrint/ListItemTagPrintToday`, {
      params
    })
  },
  getItemTagPrintById (itemTagPrintId) { // 查看打印行
    return axios.get(`${base.api}/ItemTagPrint/GetItemTagPrintById`, {
      params: {
        itemTagPrintId: itemTagPrintId
      }
    })
  },
  getItemTagPrintLine (params) { // 打印查询
    return axios.post(`${base.api}/ItemTagPrint/GetItemTagPrintLineByItemTagPrintIdOrZoneOrBay`,
      params)
  }
}

export default Stocktake
