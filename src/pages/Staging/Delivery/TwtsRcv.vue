
<template>
  <q-page  class="orderlist">
      <q-card flat
              class="q-pa-xs bg-white text-black order-pop">
        <q-list style="margin-bottom:70px;">
          <q-card-section class="q-pa-xs"
                          clickable>
            <q-list>
              <q-card-section class="q-pa-xs"
                              caption
                              line='1'>
                <span class="q-pa-sm text-weight-bold text-black">配送单号</span>
                <span class="q-pa-sm text-grey-8">{{ shipment.bolNo }}</span>
              </q-card-section>
              <q-card-section class="q-pa-xs"
                              caption>
                <span class="q-pa-sm text-weight-bold text-black">货源仓</span>
                <span class="q-pa-sm text-grey-8">{{ shipment.fromLocationId +' ' + shipment.fromLocation.name }}</span>
              </q-card-section>
              <q-card-section class="q-pa-xs"
                              caption>
                <span class="q-pa-sm text-weight-bold text-black">品项数</span>
                <span class="q-pa-sm text-grey-8">{{ shipmentItem.length }}</span>
                                <span class="q-pa-sm text-weight-bold text-black">收货号</span>
                <span class="q-pa-sm text-grey-8">{{ shipment.id }}</span>
              </q-card-section>
              <q-card-section class="row q-pa-xs"
                              caption
                              line='2'>
                <span class="col-12 q-px-sm text-weight-bold text-red"
                      v-show="!rtvstatus">{{ rtvmsg }}</span>
                <div v-show="rtvstatus"><span class="q-pa-sm text-weight-bold text-black">需退货单据号</span>
                  <span class="col-4 q-px-sm text-red"
                        v-for="(ord,index) in rtvorders"
                        :key=index>{{ ord }}</span>
                </div>
              </q-card-section>
            </q-list>
          </q-card-section>
          <q-separator inset />
          <q-item-section class="">
            <q-item-label class="q-px-md q-py-sm">请扫描要接收的商品条码</q-item-label>
            <q-form
            @keydown.enter="check_order_item" @submit="RETURNFALSE()">
            <q-input
                    dense
                    ref="bar_input"
                     class="q-px-md"
                     square
                     fixed-bottom
                     autofocus
                     outlined
                     v-model="inputBar">
              <template v-slot:append>
                <q-icon name="close"
                        @click="inputBar = '', rcvItem='', rcvQty = 0, rcvCost = 0"
                        class="cursor-pointer" />
              </template>
            </q-input>
            </q-form>
          </q-item-section>
          <q-item-section class="q-pt-md" >
            <q-card-section class="q-pa-xs"
                            v-if="rcvItem">
              <q-list>
                <q-card-section class="q-pa-xs"
                                caption>
                  <span class="q-pa-xs text-weight-bold text-black">商品货号</span>
                  <span class="q-pa-xs text-grey-8">{{ shipmentLine.itemId }}</span>
                </q-card-section>
                <q-card-section class="q-pa-xs"
                                caption>
                  <span class="q-pa-xs text-weight-bold text-black">品名</span>
                  <span class="q-pa-xs text-black">{{ shipmentLine.item.description }}</span>
                </q-card-section>
                  <q-form class="q-pa-xs" style="width:250px" @keydown.enter="rcvQtyRule(rcvQty)"  @submit="RETURNFALSE()">
                  <q-input  autofocus
                            color="black"
                           class="q-pa-xs"
                           :input-style="{ 'text-align': 'center' }"
                           :suffix=" shipmentLine.item.uom.description"
                           v-model.number="rcvQty"
                           dense  >
                      <template v-slot:before>
        <div class=" self-stretch column justify-center">
             <span class="text-bold text-black" style="font-size:0.9rem;color:#black;">接收数量</span>
             </div>
        </template>
 </q-input>
                  </q-form>
              </q-list>
            </q-card-section>
          </q-item-section>
        </q-list>
      </q-card>
                <div class="rcv-btn">
            <div class="text-grey-8 q-gutter-xs q-pa-md">
              <q-btn class="btn-primary"
                     label="查看明细"
                     @click="to_order()" />
              <q-btn :disable="!rcvItem"
                     class="btn-primary"
                     hidden
                     label="提交"
                     @click="post_rcv_item()" />
            </div>
          </div>
  </q-page>
</template>

<style lang="stylus" >
.order-pop
  width 100%

.rcvInputLabel
  vertical-align bottom
  line-height 40px
  text-align:center

#orderCostInput, #orderQtyInput
  max-width 100px
  text-align center

</style>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'PageStoreReceiving',
  data () {
    return {
      bolNo: null, // 订单号
      loc: null,
      shipmentId: null,
      orderId: 0, // 订单ID
      inputBar: '', // 条码输入
      rcvItem: false,
      barcode: null,
      rcvItemNo: 0,
      rcvCost: 0.00, // 收货进价
      rcvQty: 0, // 收货数量
      countRcved: 0, // 已收品项
      shipment: {
        'id': Number,
        'fromLocation': {}
      }, // 订单信息ines
      shipmentItem: [],
      supplierType: 0,
      dsdStatus: false,
      rcvForm: {
        orderId: Number,
        itemId: String,
        barcode: String,
        qtyReceived: Number,
        unitCost: Number
      }, // 收货数据组
      shipmentLine: {
        item: {}
      }, // 订单行明细
      rtvmsg: '', // 退货信息
      rtvstatus: false,
      rtvorders: [] // 退货订单,
    }
  },
  created () {
    this.CHANGE_TITLE('订单基本信息')
    this.BTN_PAGE(true)
    this.bolNo = this.$route.query.bolNo
    this.loc = this.$route.query.loc
  },
  mounted () {
    this.GetWTSShipmentByBolNo(this.bolNo)
  },
  watch: {
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_GO', 'BTN_PAGE', 'CHANGE_TITLE', 'RETURNFALSE']),
    to_select () {
      this.$router.push({ path: '/Rcv/OrdRcvSelect' })
    },
    to_order () {
      this.$router.push({ path: '/Rcv/TwtsOrder', query: { bolNo: this.bolNo } })
    },
    GetWTSShipmentByBolNo () {
      this.$api.Ship.GetWTSShipmentByBolNo(this.bolNo).then(res => { // 获取订单信息
        console.log(res.data.data)
        if (res.data.code === 0) {
          this.POP_MSG(res.data.msg)
        } else if (res.data.data.status === 'C') {
          this.POP_MSG('订单已关闭')
        } else {
          this.shipment = res.data.data
          this.shipmentItem = res.data.data.shipmentLines.map(function (item) { return item['itemId'] }) // 获取item[]用于检索
        }
      })
    },
    check_order_item () {
      if (this.inputBar === '') {
        this.POP_MSG('条码/货号不能为空')
      } else {
        this.$api.Rcv.getitem(this.shipment.toLocationId, this.inputBar).then(res => {
          console.log(res.data)
          if (res.data.code === 1) {
            if (this.inputBar === res.data.data.item.id) {
              console.log('条码检索失败，货号检索成功')
              if (res.data.data.primaryBarcode === null) {
                this.POP_MSG('商品无条码，禁止收货')
              } else if (this.shipmentItem.includes(res.data.data.item.id) === false) {
                this.POP_MSG('订单内无此商品，请检查！')
              } else {
                this.rcvItemNo = res.data.data.item.id
                this.barcode = res.data.data.primaryBarcode
                this.get_shipment_item()
              }
            } else if (this.shipmentItem.includes(res.data.data.item.id) === false) {
              this.POP_MSG('订单内无此商品，请检查！')
            } else {
              console.log('条码检索成功')
              this.rcvItemNo = res.data.data.item.id
              this.barcode = this.inputBar
              this.get_shipment_item()
            }
          } else {
            this.POP_MSG('订单内无此商品，请检查！')
          }
        })
      }
    },
    GetWTSineShipmentLineByBolNo () {
      this.$api.Ship.GetWTSShipmentByBolNo(this.bolNo).then(res => { // 获取订单信息
        if (res.data.code === 0) {
          this.POP_MSG(res.data.msg)
        } else if (res.data.data.status === 'C') {
          this.POP_MSG('订单已关闭')
        } else {
          this.shipment = res.data.data
        }
      })
    },
    get_shipment_item () {
      this.shipmentLine = this.shipment.shipmentLines.find((value, index, arr) => {
        return value.itemId === this.rcvItemNo
      })
      this.rcvCost = this.shipmentLine.unitCost
      this.rcvQty = this.shipmentLine.qtyReceived
      console.log(this.rcvCost)
      this.rcvForm.itemId = this.shipmentLine.itemId
      this.rcvItem = true
      console.log(this.$refs)
    },
    rcvQtyRule (val) {
      if (this.rcvItem === true) {
        console.log(val)
        console.log(this.rcvItem)
        if (this.shipmentLine.item.uomId === 'KG') {
          this.rcvQty = this.Number2(this.rcvQty)
          console.log(this.rcvQty)
          this.post_rcv_item()
        } else {
          console.log(val)
          console.log(Number.isInteger(val))
          if (Number.isInteger(val) === false) {
            this.POP_MSG('非称重商品，不能输入非整数')
            this.rcvQty = null
          } else {
            this.rcvQty = Number(this.rcvQty)
            console.log(this.rcvQty)
            this.post_rcv_item()
          }
        }
      }
    },
    post_rcv_item () {
      if (this.rcvQty === '') {
        this.POP_MSG('收货数量不能为空')
      } else if (this.rcvQty > this.shipmentLine.qtyExpected) {
        this.POP_MSG('收货数量大于订货数量')
      } else if (this.rcvQty < 0) {
        this.POP_MSG('收货数量不能小于0')
      } else {
        let postRcvData = {
          ShipmentId: Number(this.shipment.id),
          ItemId: this.rcvForm.itemId,
          Barcode: this.barcode,
          QtyReceived: this.rcvQty
        }
        this.$api.Ship.WTSItemReceive(postRcvData).then(res => {
          this.$refs.bar_input.focus()
          if (res.data.code > 0) {
            // this.shipmentId = res.data.code
            this.inputBar = ''
            this.rcvItem = false
            this.barcode = null
            this.rcvQty = 0
            this.rcvCost = 0
            this.GetWTSineShipmentLineByBolNo()
            console.log('提交成功')
          } else {
            this.POP_MSG(res.data.msg)
          }
        }).catch(error => {
          this.POP_MSG('收货失败，重新提交')
          console.log(error)
        })
      }
    }
  }
}
</script>
