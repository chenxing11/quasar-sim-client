/**
 * api接口的统一出口
 */
// 模块接口
import Rcv from 'src/api/rcv'
import Rtv from 'src/api/rtv'
import Rtw from 'src/api/rtw'
import User from 'src/api/user'
import Basic from 'src/api/basic'
import Print from 'src/api/print'
import Ship from 'src/api/shipment'
import Item from 'src/api/item'
import Erp from 'src/api/erp'
import Sys from 'src/api/sys'
import Stocktake from 'src/api/Stocktake'
import Transfer from 'src/api/transfer'
import LocationPrint from 'src/api/locationPrint'
import Purchase from 'src/api/purchase'
import SupplierLocation from 'src/api/supplierlocation'
import Inventory from 'src/api/inventoryAdjust'
import PriceChange from 'src/api/priceChange'
// 其他模块的接口……

// 导出接口
export default {
  User,
  Rcv,
  Rtv,
  Rtw,
  Basic,
  Print,
  Ship,
  Item,
  Erp,
  Sys,
  Stocktake,
  Transfer,
  LocationPrint,
  Purchase,
  SupplierLocation,
  Inventory,
  PriceChange
  // ……
}
