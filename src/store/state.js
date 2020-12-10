export default {
  // HEADER
  title: '',
  // USER
  Authorization: localStorage.getItem('Authorization'),
  currentUser: null,
  location: JSON.parse(localStorage.getItem('locationList')),
  realName: localStorage.getItem('realName'),
  userName: '',
  groups: [],
  roles: [],
  auths: JSON.parse(localStorage.getItem('auths')),
  locations: [],
  printer: localStorage.getItem('printer'),
  StoreId: localStorage.getItem('StoreId'),
  StocktakeLocationId: localStorage.getItem('StocktakeLocationId'), // 盘点ID
  stocktakeId: localStorage.getItem('stocktakeId'),

  // ORDER
  orderId: null,
  externalNo: null,
  shipmentId: null,

  // OTHER
  isreload: false,

  // POP
  popShow: false,
  popMsg: '',
  popFocus: true,
  popFocusLable: '',

  // BTN
  btnShow: false,
  btnLabel: '',
  btnRouter: '',
  btnPage: false,

  // PRINT
  p_width: 24,
  p_height: 14,
  p_top: 0.5,
  p_left: 1.5,
  p_right: 1.5,
  p_bottom: 0.5
}
