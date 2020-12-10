import * as types from './mutation-types'

export default {
  [types.GET_ORDERID] (state, orderid) { // 获取订单ID
    state.orderId = orderid
  },
  [types.CLEAR_ORDERID] (state) { // 清除订单ID
    state.orderId = ''
  },
  [types.GET_EXTTERNALNO] (state, externalNo) { // 获取外部单据号
    state.externalNo = externalNo
  },
  [types.CLEAR_EXTTERNALNO] (state) { // 清除外部单据号
    state.externalNo = ''
  },
  [types.GET_SHIPMENTID] (state, shipmentId) { // 获取收货id
    state.shipmentId = shipmentId
  },
  [types.CLEAR_SHIPMENTID] (state) { // 清除收货id
    state.shipmentId = ''
  },

  // USER
  [types.CHANGELOGIN] (state, Authorization) {
    state.Authorization = Authorization
    // localStorage.setItem('Authorization', Authorization)
  },
  [types.LOGINOUT] (state) {
    state.Authorization = ''
    state.locationId = null
    localStorage.removeItem('Authorization')
    localStorage.removeItem('Location')
    localStorage.removeItem('realName')
    localStorage.removeItem('username')
    localStorage.removeItem('locationList')
    localStorage.removeItem('auths')
    localStorage.removeItem('printer')
    // localStorage.removeItem('stocktakeId')
    // localStorage.removeItem('StoreId')
    // localStorage.removeItem('StocktakeLocationId')
  },
  [types.GET_REALNAME] (state, realname) { // 获取用户姓名
    state.realName = realname
  },
  [types.GET_USERNAME] (state, username) { // 获取用户名
    state.userName = username
  },
  [types.GET_GROUPS] (state, groups) { // 获取用户品类组
    state.groups = groups
  },
  [types.GET_ROLES] (state, roles) { // 获取用户角色
    state.roles = roles
  },
  [types.GET_AUTHS] (state, auths) { // 获取用户权限
    state.auths = auths
  },
  [types.GET_LOCATIONS] (state, locations) { // 获取用户门店
    state.locations = locations
  },
  [types.GET_LOCATION] (state, location) { // 获取用户门店
    state.location = location
  },
  [types.GET_PRINTER] (state, printer) { // 获取打印
    state.printer = printer
  },
  [types.GET_STOREID] (state, storeid) { // 门店锁定id
    state.StoreId = storeid
  },
  [types.GET_STOCKTAKELOCATIONID] (state, stocktakeLocationId) { // 门店锁定id  StocktakeLocationId
    state.StocktakeLocationId = stocktakeLocationId
  },
  [types.GET_STOCKTAKEID] (state, stocktakeId) { // 门店锁定id  stocktakeId
    state.stocktakeId = stocktakeId
  },
  // OTHER
  [types.ISRELOAD] (state) {
    state.isreload = !state.isreload
  },

  // POP
  [types.POP_SHOW] (state) {
    state.popMsg = null
    state.popShow = false
  },
  [types.POP_MSG] (state, popmsg) {
    state.popMsg = popmsg
    state.popShow = true
  },

  // BTN
  [types.BTN_SHOW] (state) {
    state.btnShow = !state.btnShow
    state.btnLabel = ''
    state.btnRouter = ''
  },
  [types.BTN_GO] (state, btncfg) {
    state.btnLabel = btncfg.btnLabel
    state.btnRouter = btncfg.btnRouter
    state.btnShow = true
  },
  [types.BTN_PAGE] (state, status) {
    state.btnPage = status
  },

  // HEADER
  [types.CHANGE_TITLE] (state, title) {
    state.title = title
  },
  // RETURNFALSE
  [types.RETURNFALSE] (state) {
    return false
  }

}
