const routes = [{
  path: '/',
  component: () => import('layouts/MainLayout.vue'),
  meta: {
    requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
  },
  children: [{
    path: '',
    component: () => import('pages/Index.vue')
  }]
},
{
  path: '/test',
  component: () => import('layouts/MainLayout.vue'),
  children: [{
    path: '',
    component: () => import('pages/test.vue')
  }]
},
{
  path: '/Index',
  component: () => import('layouts/MainLayout.vue'),
  meta: {
    requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
  },
  children: [{
    path: '',
    component: () => import('pages/Index.vue')
  }]
},
{
  path: '/Login',
  component: () => import('layouts/ListLayout.vue'),
  children: [{
    path: '',
    component: () => import('pages/Login.vue')
  }]
},
{
  path: '/Setting',
  component: () => import('layouts/MainLayout.vue'),
  meta: {
    requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
  },
  children: [{
    path: '',
    component: () => import('pages/Setting.vue')
  }]
},
{
  path: '/Staging',
  component: () => import('layouts/MainLayout.vue'),
  meta: {
    requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
  },
  children: [{
    path: '',
    component: () => import('pages/Staging.vue')
  }]
},
{
  path: '/WebStocktake',
  component: () => import('layouts/MainLayout.vue'),
  meta: {
    requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
  },
  children: [{
    path: 'Manage',
    component: () => import('pages/Web/Stocktake/W_StocktakeManage.vue')
  },
  {
    path: 'Upload',
    component: () => import('pages/Web/Stocktake/W_StocktakeUpload.vue')
  },
  {
    path: 'Plan',
    component: () => import('pages/Web/Stocktake/W_StocktakePlan.vue')
  },
  {
    path: 'Check',
    component: () => import('pages/Web/Stocktake/W_StocktakeCheck.vue')
  }, {
    path: 'Imp',
    component: () => import('pages/Web/Stocktake/W_StocktakeImp.vue')
  }, {
    path: 'Close',
    component: () => import('pages/Web/Stocktake/W_StocktakeClose.vue')
  }
  ]
},
{
  path: '/WebOrderSelect',
  component: () => import('layouts/MainLayout.vue'),
  meta: {
    requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
  },
  children: [
    {
      path: 'Select',
      component: () => import('pages/Web/orderSelect/W_OrderSelect.vue')
    },
    {
      path: 'WtsOrder',
      component: () => import('pages/Web/orderSelect/W_WtsOrder.vue')
    },
    {
      path: 'StsOrder',
      component: () => import('pages/Web/orderSelect/W_StsOrder.vue')
    },
    {
      path: 'RtvOrder',
      component: () => import('pages/Web/orderSelect/W_RtvOrder.vue')
    },
    {
      path: 'PoOrder',
      component: () => import('pages/Web/orderSelect/W_PoOrder.vue')
    },
    {
      path: 'StwOrder',
      component: () => import('pages/Web/orderSelect/W_StwOrder.vue')
    }
  ]
},
{
  path: '/return',
  component: () => import('layouts/MainLayout.vue'),
  meta: {
    requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
  },
  children: [
    {
      path: 'returnRtv',
      component: () => import('pages/Web/return/returnRtv.vue')
    },
    {
      path: 'rtvApproval',
      component: () => import('pages/Web/return/rtvApproval.vue')
    },
    {
      path: 'returnRtw',
      component: () => import('pages/Web/return/returnRtw.vue')
    },
    {
      path: 'rtwApproval',
      component: () => import('pages/Web/return/rtwApproval.vue')
    }
  ]
},
{
  path: '/Rcv',
  component: () => import('layouts/StagingLayout.vue'),
  meta: {
    requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
  },
  children: [{
    path: 'OrdRcv',
    component: () => import('pages/Staging/Receiving/OrdRcv.vue')
  },
  {
    path: 'OrdRcvSelect',
    component: () => import('pages/Staging/Receiving/OrdRcvSelect.vue')
  },
  {
    path: 'OrdRcvOrder',
    component: () => import('pages/Staging/Receiving/OrdRcvOrder.vue')
  },
  {
    path: 'DsdRcv',
    component: () => import('pages/Staging/Receiving/DsdRcv.vue')
  },
  {
    path: 'OrdDsdSelect',
    component: () => import('pages/Staging/Receiving/OrdDsdSelect.vue')
  },
  {
    path: 'DsdRcvOrder',
    component: () => import('pages/Staging/Receiving/DsdRcvOrder.vue')
  },
  {
    path: 'OrdDsd',
    component: () => import('pages/Staging/Receiving/OrdDsdRcv.vue')
  },
  {
    path: 'DsdRcvSelect',
    component: () => import('pages/Staging/Receiving/DsdRcvSelect.vue')
  },
  {
    path: 'OrdDsdOrder',
    component: () => import('pages/Staging/Receiving/OrdDsdOrder.vue')
  },
  {
    path: 'RcvAdjust',
    component: () => import('pages/Staging/Receiving/RcvAdjust.vue')
  },
  {
    path: 'RcvAdjustSelect',
    component: () => import('pages/Staging/Receiving/RcvAdjustSelect.vue')
  },
  {
    path: 'WtsSelect',
    component: () => import('pages/Staging/Delivery/WtsSelect.vue')
  },
  {
    path: 'WtsOrder',
    component: () => import('pages/Staging/Delivery/WtsOrder.vue')
  },
  {
    path: 'TwtsSelect',
    component: () => import('pages/Staging/Delivery/TwtsSelect.vue')
  },
  {
    path: 'TwtsRcv',
    component: () => import('pages/Staging/Delivery/TwtsRcv.vue')
  },
  {
    path: 'TwtsOrder',
    component: () => import('pages/Staging/Delivery/TwtsOrder.vue')
  },
  {
    path: 'FreshSelect',
    component: () => import('pages/Staging/Receiving/FreshSelect.vue')
  },
  {
    path: 'FreshOrder',
    component: () => import('pages/Staging/Receiving/FreshOrder.vue')
  }
  ]
},
{
  path: '/Return',
  component: () => import('layouts/StagingLayout.vue'),
  meta: {
    requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
  },
  children: [{
    path: 'RtvSelect',
    component: () => import('pages/Staging/Return/RtvSelect.vue')
  },
  {
    path: 'Rtv',
    component: () => import('pages/Staging/Return/Rtv.vue')
  },
  {
    path: 'RtwSelect',
    component: () => import('pages/Staging/Return/RtwSelect.vue')
  },
  {
    path: 'Rtw',
    component: () => import('pages/Staging/Return/Rtw.vue')
  }
  ]
},
{
  path: '/Sys',
  component: () => import('layouts/StagingLayout.vue'),
  meta: {
    requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
  },
  children: [{
    path: 'SetVersion',
    component: () => import('pages/Sys/SetVersion.vue')
  },
  {
    path: 'OrderList',
    component: () => import('pages/Web/FreshOrder/OrderList.vue')
  }]
},
{
  path: '/Store',
  component: () => import('layouts/StagingLayout.vue'),
  meta: {
    requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
  },
  children: [{
    path: 'Item',
    component: () => import('pages/Staging/StoreManage/ItemSelect.vue')
  },
  {
    path: 'priceTag',
    component: () => import('pages/Staging/PriceTag/index')
  },
  {
    path: 'priceTagPrint',
    component: () => import('pages/Staging/PriceTag/priceTagPrint')
  },
  {
    path: 'PriceTagSelect',
    component: () => import('pages/Staging/PriceTag/PriceTagSelect')
  }
  ]
},
{
  path: '/Inv',
  component: () => import('layouts/StagingLayout.vue'),
  meta: {
    requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
  },
  children: [
    {
      path: 'index',
      component: () => import('pages/Staging/InvAdjust/index.vue')
    },
    {
      path: 'InvAdjustList',
      component: () => import('pages/Staging/InvAdjust/InvAdjustList.vue')
    },
    {
      path: 'CreateInvAdjust',
      component: () => import('pages/Staging/InvAdjust/CreateInvAdjust.vue')
    },
    {
      path: 'InvAdjustSelect',
      component: () => import('pages/Staging/InvAdjust/InvAdjustSelect.vue')
    },
    {
      path: 'InvAdjustOrder',
      component: () => import('pages/Staging/InvAdjust/InvAdjustOrder.vue')
    },
    {
      path: 'InvAdjustApvList',
      component: () => import('pages/Staging/InvAdjust/InvAdjustApvList.vue')
    },
    {
      path: 'InvAdjustApvOrder',
      component: () => import('pages/Staging/InvAdjust/InvAdjustApvOrder.vue')
    }
  ]
},
{
  path: '/PriceChange',
  component: () => import('layouts/StagingLayout.vue'),
  meta: {
    requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
  },
  children: [
    {
      path: 'index',
      component: () => import('pages/Staging/PriceChange/index.vue')
    },
    {
      path: 'PriceChangeList',
      component: () => import('pages/Staging/PriceChange/PriceChangeList.vue')
    },
    {
      path: 'CreatePriceChange',
      component: () => import('pages/Staging/PriceChange/CreatePriceChange.vue')
    },
    {
      path: 'AuditList',
      component: () => import('pages/Staging/PriceChange/AuditList.vue')
    },
    {
      path: 'AuditOrder',
      component: () => import('pages/Staging/PriceChange/AuditOrder.vue')
    },
    {
      path: 'PriceChangeSelect',
      component: () => import('pages/Staging/PriceChange/PriceChangeSelect.vue')
    },
    {
      path: 'PriceChangeOrder',
      component: () => import('pages/Staging/PriceChange/PriceChangeOrder.vue')
    }
  ]
},
{
  path: '/ReturnRtw',
  component: () => import('layouts/StagingLayout.vue'),
  meta: {
    requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
  },
  children: [
    {
      path: 'Rtw',
      component: () => import('pages/Staging/ReturnRtw/index.vue')
    },
    {
      path: 'RtwList',
      component: () => import('pages/Staging/ReturnRtw/RtwList.vue')
    },
    {
      path: 'createRtw',
      component: () => import('pages/Staging/ReturnRtw/createRtw.vue')
    },
    {
      path: 'RtwAuditList',
      component: () => import('pages/Staging/ReturnRtw/RtwAuditList.vue')
    },
    {
      path: 'RtwAuditOrder',
      component: () => import('pages/Staging/ReturnRtw/RtwAuditOrder.vue')
    },
    {
      path: 'RtwSelect',
      component: () => import('pages/Staging/ReturnRtw/RtwSelect.vue')
    },
    {
      path: 'RtwOrder',
      component: () => import('pages/Staging/ReturnRtw/RtwOrder.vue')
    }
  ]
},
{
  path: '/ReturnRtv',
  component: () => import('layouts/StagingLayout.vue'),
  meta: {
    requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
  },
  children: [
    {
      path: 'Rtv',
      component: () => import('pages/Staging/ReturnRtv/index.vue')
    },
    {
      path: 'RtvList',
      component: () => import('pages/Staging/ReturnRtv/RtvList.vue')
    },
    {
      path: 'createRtv',
      component: () => import('pages/Staging/ReturnRtv/createRtv.vue')
    },
    {
      path: 'RtvAuditList',
      component: () => import('pages/Staging/ReturnRtv/RtvAuditList.vue')
    },
    {
      path: 'RtvAuditOrder',
      component: () => import('pages/Staging/ReturnRtv/RtvAuditOrder.vue')
    },
    {
      path: 'RtvSelect',
      component: () => import('pages/Staging/ReturnRtv/RtvSelect.vue')
    },
    {
      path: 'RtvOrder',
      component: () => import('pages/Staging/ReturnRtv/RtvOrder.vue')
    },
    {
      path: 'Dismantle',
      component: () => import('pages/Staging/ReturnRtv/Dismantle.vue')
    }
  ]
},
{
  path: '/Bill',
  component: () => import('layouts/StagingLayout.vue'),
  meta: {
    requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
  },
  children: [
    {
      path: 'index',
      component: () => import('pages/Staging/Bill/index.vue')
    },
    {
      path: 'BillList',
      component: () => import('pages/Staging/Bill/BillList.vue')
    },
    {
      path: 'createBill',
      component: () => import('pages/Staging/Bill/createBill.vue')
    },
    {
      path: 'BillSelect',
      component: () => import('pages/Staging/Bill/BillSelect.vue')
    },
    {
      path: 'BillOrder',
      component: () => import('pages/Staging/Bill/BillOrder.vue')
    }
  ]
},
{
  path: '/PrintPreview',
  component: () => import('layouts/StagingLayout.vue'),
  meta: {
    requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
  },
  children: [{
    path: 'Print',
    component: () => import('pages/Print/PrintPreview.vue')
  },
  {
    path: 'Query',
    component: () => import('pages/Print/query.vue')
  }
  ]
},
{
  path: '/Print',
  component: () => import('layouts/ListLayout.vue'),
  children: [{
    path: 'OrdRcv',
    component: () => import('pages/Print/OrdRcvPrint.vue')
  },
  {
    path: 'OrdDsdRcv',
    component: () => import('pages/Print/OrdDsdRcvPrint.vue')
  },
  {
    path: 'DsdRcv',
    component: () => import('pages/Print/DsdRcvPrint.vue')
  },
  {
    path: 'Fresh',
    component: () => import('pages/Print/FreshPrint.vue')
  },
  {
    path: 'Rtw',
    component: () => import('pages/Print/RtwPrint.vue')
  },
  {
    path: 'Rtv',
    component: () => import('pages/Print/RtvPrint.vue')
  },
  {
    path: 'Wts',
    component: () => import('pages/Print/WtsPrint.vue')
  },
  {
    path: 'Sts',
    component: () => import('pages/Print/StsPrint.vue')
  },
  {
    path: 'StsReceive',
    component: () => import('pages/Print/StsReceivePrint.vue')
  }
  ]
},
{
  path: '/Stocktake',
  component: () => import('layouts/StagingLayout.vue'),
  meta: {
    requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
  },
  children: [{
    path: 'Stocktake',
    component: () => import('pages/Stocktake/index.vue')
  },
  {
    path: 'ReadyStocktake',
    component: () => import('pages/Stocktake/M_ReadyStocktake.vue')
  },
  {
    path: 'FindStocktake',
    component: () => import('pages/Stocktake/M_FindStocktake.vue')
  },
  {
    path: 'RecordStocktake',
    component: () => import('pages/Stocktake/M_RecordStocktake.vue')
  },
  {
    path: 'AreaStocktake',
    component: () => import('pages/Stocktake/M_AreaStocktake.vue')
  },
  {
    path: 'AdjustStocktake',
    component: () => import('pages/Stocktake/M_AdjustStocktake.vue')
  },
  {
    path: 'MenuStocktake',
    component: () => import('pages/Stocktake/M_MenuStocktake.vue')
  },
  {
    path: 'Staffing',
    component: () => import('pages/Stocktake/M_Staffing.vue')
  },
  {
    path: 'UrgentStocktake',
    component: () => import('pages/Stocktake/M_UrgentStocktake.vue')
  },
  {
    path: 'SpeedStocktake',
    component: () => import('pages/Stocktake/M_SpeedStocktake.vue')
  },
  {
    path: 'SetStocktake',
    component: () => import('pages/Stocktake/M_SetStocktake.vue')
  },
  {
    path: 'DirSpeedStocktake',
    component: () => import('pages/Stocktake/M_DirSpeedStocktake.vue')
  },
  {
    path: 'NotFinishStocktake',
    component: () => import('pages/Stocktake/M_NotFinishStocktake.vue')
  },
  {
    path: 'ShopLocking',
    component: () => import('pages/Stocktake/M_ShopLocking.vue')
  },
  {
    path: 'Shopowner',
    component: () => import('pages/Stocktake/M_ShopownerNotFinishStocktake.vue')
  }
  ]
},
{
  path: '/StoreTransfer',
  component: () => import('layouts/StagingLayout.vue'),
  meta: {
    requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
  },
  children: [
    {
      path: 'TransferRequestList',
      component: () => import('pages/StoreTransfer/TransferRequestList.vue')
    },
    {
      path: 'TransferRequest',
      component: () => import('pages/StoreTransfer/TransferRequest.vue')
    },
    {
      path: 'TransferAcceptList',
      component: () => import('pages/StoreTransfer/TransferAcceptList.vue')
    },
    {
      path: 'TransferAccept',
      component: () => import('pages/StoreTransfer/TransferAccept.vue')
    },
    {
      path: 'TransferShipList',
      component: () => import('pages/StoreTransfer/TransferShipList.vue')
    },
    {
      path: 'TransferShip',
      component: () => import('pages/StoreTransfer/TransferShip.vue')
    },
    {
      path: 'TransferReceiveList',
      component: () => import('pages/StoreTransfer/TransferReceiveList.vue')
    },
    {
      path: 'TransferReceive',
      component: () => import('pages/StoreTransfer/TransferReceive.vue')
    }
  ]
},
{
  path: '/FreshOrder',
  component: () => import('layouts/MainLayout.vue'),
  meta: {
    requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
  },
  children: [
    {
      path: 'OrderList',
      component: () => import('pages/Web/FreshOrder/OrderList.vue')
    },
    {
      path: 'OrderDetail',
      component: () => import('pages/Web/FreshOrder/OrderDetail.vue')
    },
    {
      path: 'OrderListAuditing',
      component: () => import('pages/Web/FreshOrder/OrderListAuditing.vue')
    },
    {
      path: 'AuditingOrderDetail',
      component: () => import('pages/Web/FreshOrder/AuditingOrderDetail.vue')
    },
    {
      path: 'NewOrder',
      component: () => import('pages/Web/FreshOrder/NewOrder.vue')
    }
  ]
},
{
  path: '/FreshOrderMobile',
  component: () => import('layouts/StagingLayout.vue'),
  meta: {
    requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
  },
  children: [
    {
      path: 'OrderList',
      component: () => import('pages/Staging/FreshOrder/OrderList.vue')
    },
    {
      path: 'OrderDetail',
      component: () => import('pages/Staging/FreshOrder/OrderDetail.vue')
    },
    {
      path: 'OrderListAuditing',
      component: () => import('pages/Staging/FreshOrder/OrderListAuditing.vue')
    },
    {
      path: 'AuditingOrderDetail',
      component: () => import('pages/Staging/FreshOrder/AuditingOrderDetail.vue')
    },
    {
      path: 'NewOrder',
      component: () => import('pages/Staging/FreshOrder/NewOrder.vue')
    }
  ]
}
]

// Always leave this as last one
routes.push({
  path: '*',
  component: () => import('pages/Error404.vue')
})

export default routes
