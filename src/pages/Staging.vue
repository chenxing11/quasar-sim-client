<template>
  <div class="row">
    <q-infinite-scroll class="col-4 justify-center" :style="contentStyleObj">
    <q-list  class="text-center">
      <q-item
        v-for="(item, index) in Firstlink"
        :key="item.id"
        :class="{active:index==FirstL, Firstlink}"
      >
        <q-item-section class="text-center" @click="checklink(item.links), Firstcheck(index)">
            <div class="column q-my-md">
              <span class="svg-container">
                <svg class="icon stagingIcon" color="#1F533C" aria-hidden="true">
                  <use :xlink:href="item.icon" />
                </svg>
              </span>
              <span>{{item.label}}</span>
            </div>
        </q-item-section>
        <q-space />
      </q-item>
      <q-space />
    </q-list>
    </q-infinite-scroll>
    <q-list class="col-8 Secondlink">
      <q-item v-for="item in SecondLink" :key="item.id">
        <q-item-section>
          <q-btn class="stagingIcon" left flat align="left" color="black" :to="item.tolink">
            <span class="q-mx-xs svg-container">
              <svg class="icon stagingIcon" color="#1F533C" aria-hidden="true">
                <use :xlink:href="item.icon" />
              </svg>
            </span>
            <span class="q-mx-xs">{{item.mainlabel}}</span>
          </q-btn>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>
<style lang="stylus" >
.t-card {
  width: 100%;
  height: 70%;
}

.Firstlink {
  background-color: #F5F5F5;
  padding: 0;
}

.Firstlink div {
  padding: 0;

  button {
    padding: 10px 0;
  }
}

.active {
  background-color: #fff;
  border-color: #fff;
}

.Secondlink {
  position: fixed;
  top: 26px;
  right: 0;
}

.stagingIcon:focus {
  background-color: $grey-3;
}
</style>
<script>
import { mapMutations } from 'vuex'

export default {
  name: 'PageStaging',
  props: {},
  data () {
    return {
      text: '',
      ph: '',
      FirstL: 0,
      icon: false,
      level: true,
      contentStyleObj: {
        'height': '',
        'background-color': '#F5F5F5'
      },
      SecondLink: [],
      Firstlink: [
        {
          label: '收货',
          clickstatus: false,
          icon: '#icon-dingdanshouhuo',
          btn: 1,
          links: [
            {
              mainlabel: '订单收货',
              tolink: '/Rcv/OrdRcvSelect',
              icon: '#icon-zhisongshouhuo',
              btn: 1,
              AuthName: 'PoReceiving'
            },
            {
              mainlabel: '永续订单收货',
              tolink: '/Rcv/OrdDsdSelect',
              icon: '#icon-yongxushouhuo',
              btn: 2,
              AuthName: 'PoDsdReceiving'
            },
            {
              mainlabel: '永续收货',
              tolink: '/Rcv/DsdRcvSelect',
              icon: '#icon-wudingdanshouhuo',
              btn: 3,
              AuthName: 'DsdReceiving'
            },
            {
              mainlabel: '配送一键收货',
              tolink: '/Rcv/WtsSelect',
              icon: '#icon-peisongshouhuo',
              btn: 4,
              AuthName: 'DistroReceiving'
            },
            {
              mainlabel: '配送实收',
              tolink: '/Rcv/TwtsSelect',
              icon: '#icon-peisongshouhuo',
              btn: 5,
              AuthName: 'DistroActualReceiving'
            },
            {
              mainlabel: '自采收货',
              tolink: '/Rcv/FreshSelect',
              icon: '#icon-zhisongshouhuo',
              btn: 6,
              AuthName: 'FreshPoReceiving'
            },
            {
              mainlabel: '收货数量调整',
              tolink: '/Rcv/RcvAdjustSelect',
              icon: '#icon-shouhuoshuliangtiaozheng',
              btn: 7,
              AuthName: 'RcvUnitsAdj'
            }
          ]
        },
        {
          label: '配送收货',
          clickstatus: false,
          icon: '#icon-peisongshouhuo',
          links: [
            // {
            //   mainlabel: '配送收货',
            //   tolink: '/Rcv/WtsSelect',
            //   icon: '#icon-peisongshouhuo',
            //   AuthName: 'RcvUnitsAdj'
            // },
            {
              mainlabel: '大直通',
              tolink: '',
              icon: '#icon-dazhitong',
              AuthName: ''
            },
            {
              mainlabel: '小直通',
              tolink: '',
              icon: '#icon-xiaozhitong',
              AuthName: ''
            }
          ]
        },
        {
          label: '仓库收货',
          clickstatus: false,
          icon: '#icon-dingdanshouhuo',
          links: [
            {
              mainlabel: '订单收货',
              tolink: '/Rcv/OrdRcvSelect',
              icon: '#icon-zhisongshouhuo',
              AuthName: ''
            },
            {
              mainlabel: '永续订单收货',
              tolink: '/Rcv/OrdDsdSelect',
              icon: '#icon-zhisongshouhuo',
              AuthName: ''
            },
            {
              mainlabel: '永续收货',
              tolink: '/Rcv/DsdRcvSelect',
              icon: '#icon-wudingdanshouhuo',
              AuthName: ''
            },
            {
              mainlabel: '收货数量调整',
              tolink: '/Rcv/RcvAdjustSelect',
              icon: '#icon-shouhuoshuliangtiaozheng',
              AuthName: ''
            }
          ]
        },
        {
          label: '退货发运',
          clickstatus: false,
          icon: '#icon-tuihuo',
          links: [
            {
              mainlabel: '供应商',
              tolink: '/Return/RtvSelect',
              icon: '#icon-tuihuozhigongyingshang',
              AuthName: 'Return'
            },
            {
              mainlabel: '仓库',
              tolink: '/Return/RtwSelect',
              icon: '#icon-tuihuozhicangku',
              AuthName: 'ReturnToWh'
            }
          ]
        },
        {
          label: '店间调拨',
          clickstatus: false,
          icon: '#icon-dianjiantiaobo',
          links: [
            {
              mainlabel: '调拨申请',
              tolink: '/StoreTransfer/TransferRequestList',
              icon: '#icon-dianjiandiaochu',
              AuthName: 'StoreTransferRequest'
            },
            {
              mainlabel: '调拨接受',
              tolink: '/StoreTransfer/TransferAcceptList',
              icon: '#icon-dianjiandiaoru',
              AuthName: 'StoreTransferAccept'
            },
            {
              mainlabel: '调拨发运',
              tolink: '/StoreTransfer/TransferShipList',
              icon: '#icon-dianjiandiaoru',
              AuthName: 'StoreTransferShip'
            },
            {
              mainlabel: '调拨收货',
              tolink: '/StoreTransfer/TransferReceiveList',
              icon: '#icon-dianjiandiaoru',
              AuthName: 'StoreTransferReceive'
            }
          ]
        },
        {
          label: '卖场管理',
          clickstatus: false,
          icon: '#icon-maichangguanli',
          links: [
            { mainlabel: '商品信息', tolink: '/Store/Item', icon: '#icon-shangpinxinxi', AuthName: 'ItemInfo' },
            { mainlabel: '销售查询', tolink: '', icon: '#icon-xiaoshouchaxun', AuthName: '' },
            { mainlabel: '紧急变价', tolink: '/PriceChange/index', icon: '#icon-jinjibianjia', AuthName: 'PriceChange' },
            { mainlabel: '预订/退货', tolink: '', icon: '#icon-yudingtuihuo', AuthName: '' },
            { mainlabel: '价签打印', tolink: '/Store/priceTag', icon: '#icon-jiaqiandayin', AuthName: 'ItemTagPrint' },
            { mainlabel: '出清', tolink: '/Bill/index', icon: '#icon-shangpinxinxi', AuthName: 'SystemSetting' }
          ] },
        { label: '库存管理',
          clickstatus: false,
          icon: '#icon-kucunguanli',
          links: [
            { mainlabel: '盘点', tolink: '/Stocktake/Stocktake', icon: '#icon-pandian', AuthName: 'Stocktake' },
            { mainlabel: '联营库存管理', tolink: '', icon: '#icon-lianyingkucunguanli', AuthName: '' },
            { mainlabel: 'excel', tolink: '/Upload/UploadFile', icon: '#icon-lianyingkucunguanli', AuthName: '' },
            { mainlabel: '库存调整', tolink: '/Inv/index', icon: '#icon-dianjiandiaochu', AuthName: 'InvAdjust' },
            { mainlabel: '退货至供应商', tolink: '/ReturnRtv/Rtv', icon: '#icon-tuihuozhigongyingshang', AuthName: 'SystemSetting' },
            { mainlabel: '退货至仓库', tolink: '/ReturnRtw/Rtw', icon: '#icon-tuihuozhicangku', AuthName: 'SystemSetting' }
          ] },
        { label: '收货管理',
          clickstatus: false,
          icon: '#icon-kucunguanli',
          links: [
            { mainlabel: '收货查询', icon: '#icon-shangpinxinxi', tolink: '/PrintPreview/Query', AuthName: 'ReceivingDaily' },
            { mainlabel: '重复打印', icon: '#icon-chongfudayin', tolink: '/PrintPreview/Print', AuthName: 'DocPrinting' }
          ]
        },
        { label: '系统管理',
          clickstatus: false,
          icon: '#icon-lianyingkucunguanli',
          links: [
            { mainlabel: '提交更新', icon: '#icon-lianyingkucunguanli', tolink: '/Sys/SetVersion', AuthName: 'SystemSetting' },
            { mainlabel: '自采订货', icon: '#icon-lianyingkucunguanli', tolink: '/FreshOrderMobile/OrderList', AuthName: 'SystemSetting' },
            { mainlabel: '自采审批', icon: '#icon-lianyingkucunguanli', tolink: '/FreshOrderMobile/OrderListAuditing', AuthName: 'SystemSetting' }
          ]
        }
      ],
      Stocktake: 0,
      InvAdjust: 0,
      PriceChange: 0
    }
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_PAGE']),
    getHeight () {
      this.contentStyleObj.height = window.innerHeight + 140 + 'px'
      // console.log(this.contentStyleObj)
    },
    checklink (val) {
      this.SecondLink = val
      // console.log(this.SecondLink)
    },
    Firstcheck (val) {
      // console.log(val)
      this.FirstL = val
    }
  },
  created () {
    window.addEventListener('resize', this.getHeight)
    this.getHeight()
    // 获取当前账号权限
    let power = JSON.parse(JSON.stringify(this.$store.state.auths))
    power.map((val, i) => {
      if (val === 'StockItemTagPrint' || val === 'StocktakeCount' || val === 'StocktakeComplete' || val === 'StocktakeProcess' || val === 'StocktakeTerminalLock') {
        this.Stocktake++
      }
      if (val === 'InventoryAdjustCreate' || val === 'InventoryAdjustQuery' || val === 'InventoryAdjustApproval') {
        this.InvAdjust++
      }
      if (val === 'PosPriceChange' || val === 'PosPriceChangeApproval' || val === 'PosPriceChangeQuery') {
        this.PriceChange++
      }
    })
    if (this.Stocktake > 0) {
      power.push('Stocktake')
    }
    if (this.InvAdjust > 0) {
      power.push('InvAdjust')
    }
    if (this.PriceChange > 0) {
      power.push('PriceChange')
    }
    // for (let i = 0; i < power.length; i++) {
    //   if (power[i] === 'StockItemTagPrint' || power[i] === 'StocktakeCount' || power[i] === 'StocktakeComplete' || power[i] === 'StocktakeProcess' || power[i] === 'StocktakeTerminalLock') {
    //     power.push('Stocktake')
    //     break
    //   }
    // }
    // for (let i = 0; i < power.length; i++) {
    //   if (power[i] === 'InventoryAdjustCreate' || power[i] === 'InventoryAdjustQuery' || power[i] === 'InventoryAdjustApproval') {
    //     power.push('InvAdjust')
    //     break
    //   }
    // }
    let arr = []
    // 根据权限显示功能
    this.Firstlink.forEach((v, i) => {
      let newArr = []
      v.links.forEach((val, j) => {
        power.forEach((value, k) => {
          if (val.AuthName === value) {
            newArr.push(val)
          }
        })
      })
      if (newArr.length > 0) {
        v.links = newArr
        arr.push(v)
      }
    })
    this.Firstlink = arr
    this.BTN_PAGE(false)
    this.SecondLink = this.Firstlink[0].links
    /* var _this = this
    document.onkeydown = function (e) {
      let key = window.event.keyCode
      switch (key) {
        case 65:
          _this.POP_MSG('65')
          break
        case 66:
          _this.POP_MSG('66')
          break
        case 67:
          _this.POP_MSG('67')
          break
        case 68:
          _this.POP_MSG('68')
          break
        default:
          _this.POP_MSG(key)
      }
    } */
    console.log(window.innerHeight)
  },
  destroyed () {
    window.removeEventListener('resize', this.getHeight)
  }
}
</script>
