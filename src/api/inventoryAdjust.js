import base from './base' // 导入接口域名列表
import axios from 'src/tools/http' // 导入http中创建的axios实例

const Inventory = {
  ListInventoryAdjustInProcByLoc (locationId) { // 获取库存调整暂存单
    return axios.get(`${base.api}/InventoryAdjust/ListInventoryAdjustInProcByLoc`, {
      params: { locationId: locationId }
    })
  },
  GetInventoryAdjustById (inventoryAdjustId) { // 根据id获取库存调整单
    return axios.get(`${base.api}/InventoryAdjust/GetInventoryAdjustById`, {
      params: { inventoryAdjustId: inventoryAdjustId }
    })
  },
  CreateInventoryAdjust (locationId) { // 创建库存调整单头
    return axios.get(`${base.api}/InventoryAdjust/CreateInventoryAdjust`, {
      params: { locationId: locationId }
    })
  },
  CreateOrUpdateInventoryAdjustLine (inventoryAdjustId, itemId, inventoryAdjustReasonId, qtyAdjusted, qtyBeforeAdjusted, unitCost) { // 创建和更新库存调整单行
    return axios.get(`${base.api}/InventoryAdjust/CreateOrUpdateInventoryAdjustLine`, {
      params: {
        inventoryAdjustId: inventoryAdjustId,
        itemId: itemId,
        inventoryAdjustReasonId: inventoryAdjustReasonId,
        qtyAdjusted: qtyAdjusted,
        qtyBeforeAdjusted: qtyBeforeAdjusted,
        unitCost: unitCost
      }
    })
  },
  RemoveInventoryAdjustLineById (inventoryAdjustLineId) { // 移除调整单行
    return axios.get(`${base.api}/InventoryAdjust/RemoveInventoryAdjustLineById`, {
      params: { inventoryAdjustLineId: inventoryAdjustLineId }
    })
  },
  ListAllInventoryAdjustReasons (locationId) { // 获取库存调整原因
    return axios.get(`${base.api}/InventoryAdjust/ListAllInventoryAdjustReasons`)
  },
  InventoryAdjustSubmit (inventoryAdjustId) { // 提交调整单
    return axios.get(`${base.api}/InventoryAdjust/InventoryAdjustSubmit`, {
      params: { inventoryAdjustId: inventoryAdjustId }
    })
  },
  ListInventoryAdjustSubmittedByLoc (locationId) { // 获取库存调整审批单列表
    return axios.get(`${base.api}/InventoryAdjust/ListInventoryAdjustSubmittedByLoc`, {
      params: { locationId: locationId }
    })
  },
  InventoryAdjustApproval (inventoryAdjustId) { // 审批调整单
    return axios.get(`${base.api}/InventoryAdjust/InventoryAdjustApproval`, {
      params: { inventoryAdjustId: inventoryAdjustId }
    })
  },
  InventoryAdjustReject (inventoryAdjustId) { // 拒绝调整单
    return axios.get(`${base.api}/InventoryAdjust/InventoryAdjustReject`, {
      params: { inventoryAdjustId: inventoryAdjustId }
    })
  },
  QueryInventoryAdjusts (locationId, inventoryAdjustId, fromDate, toDate) { // 查询
    return axios.get(`${base.api}/InventoryAdjust/QueryInventoryAdjusts`, {
      params: {
        locationId: locationId,
        inventoryAdjustId: inventoryAdjustId,
        fromDate: fromDate,
        toDate: toDate
      }
    })
  }
}

export default Inventory
