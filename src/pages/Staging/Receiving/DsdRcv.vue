
<template>
  <q-page class="orderlist">
    <q-card flat class="q-pa-xs bg-white text-black">
      <q-list>
        <q-card-section class="q-pa-xs" clickable>
          <q-list>
            <q-card-section class="q-pa-xs" caption line="1">
              <span v-if="shipmentId" class="q-pa-sm text-weight-bold text-black">收货号</span>
              <span v-if="shipmentId" class="q-pa-sm text-grey-8">{{ shipmentId }}</span>
              <span class="q-pa-sm text-weight-bold text-black">供应商号</span>
              <span class="q-pa-sm text-grey-8">{{ supplier.id }}</span>
              <q-badge v-show="supplierType === 1" class="q-pa-xs" color="green">永续</q-badge>
            </q-card-section>
            <q-card-section class="q-pa-xs" caption>
              <span class="q-pa-sm text-weight-bold text-black">供应商名称</span>
              <span class="q-pa-sm text-grey-8">{{ supplier.name }}</span>
            </q-card-section>
            <q-card-section class="q-pa-xs" caption>
              <span class="q-pa-sm text-weight-bold text-black">已收品项数</span>
              <span class="q-pa-sm text-grey-8">{{ countRcved }}</span>
            </q-card-section>
            <q-card-section class="row q-pa-xs" caption line="2">
              <span
                class="col-12 q-px-sm text-weight-bold text-red"
                v-show="!rtvstatus"
              >{{ rtvmsg }}</span>
              <div v-show="rtvstatus">
                <span class="q-pa-sm text-weight-bold text-black">需退货单据号</span>
                <span
                  class="col-4 q-px-sm text-red"
                  v-for="(ord,index) in rtvorders"
                  :key="index"
                >{{ ord }}</span>
              </div>
            </q-card-section>
          </q-list>
        </q-card-section>
        <q-separator inset />
        <q-item-section class>
          <q-item-label class="q-px-md q-py-sm">请扫描要接收的商品条码</q-item-label>
          <q-form @keydown.enter="check_supplier_item" @submit="RETURNFALSE()">
            <q-input
              id="bar-input"
              ref="bar_input"
              class="q-px-md"
              square
              fixed-bottom
              autofocus
              outlined
              v-model="inputBar"
              dense
            >
              <template v-slot:append>
                <q-icon
                  name="close"
                  @click="inputBar = '', rcvItem='', rcvQty = 0, rcvCost = 0"
                  class="cursor-pointer"
                />
              </template>
            </q-input>
          </q-form>
        </q-item-section>
        <q-item-section class="q-pt-md">
          <q-card-section class="q-pa-xs" v-if="rcvItem">
            <q-list>
              <q-card-section class="q-pa-xs" caption>
                <span class="q-pa-xs text-weight-bold text-black">商品货号</span>
                <span class="q-pa-xs text-black">{{ item.itemId }}</span>
              </q-card-section>
              <q-card-section class="q-pa-xs" caption>
                <span class="q-pa-xs text-weight-bold text-black">品名</span>
                <span class="q-pa-xs text-black">{{ item.itemDescription }}</span>
              </q-card-section>
              <div class="q-pa-xs" style="width:250px">
                <q-input
                  :input-style="{ 'text-align': 'center' }"
                  ref="orderCostInput"
                  autofocus
                  color="black"
                  class="q-pa-xs orderCostInput"
                  suffix="元"
                  v-model.number="rcvCost"
                  :dense="true"
                  @keydown.enter.stop="checkCost(rcvCost)"
                ><template v-slot:before>
        <div class=" self-stretch column justify-center">
             <span class="text-bold text-black" style="font-size:0.9rem;color:#black;">含税进价</span>
             </div>
        </template>
                  <template v-slot:append>
                    <q-icon name="close" @click="inputBar = '', rcvCost=''" class="cursor-pointer" />
                  </template>
                </q-input></div>
              <q-form class="q-pa-xs" style="width:250px" @keydown.enter.stop="rcvQtyRule(rcvQty)" @submit="RETURNFALSE()">
                  <q-input
                    :input-style="{ 'text-align': 'center' }"
                    ref="orderQtyInput"
                    color="black"
                    class="q-pa-xs orderQtyInput"
                    :suffix=" item.itemUomDescription"
                    :autofocus="dsdStatus"
                    v-model.number="rcvQty"
                    :dense="true"
                  ><template v-slot:before>
        <div class=" self-stretch column justify-center">
             <span class="text-bold text-black" style="font-size:0.9rem;color:#black;">接收数量</span>
             </div>
        </template></q-input>
              </q-form>
            </q-list>
          </q-card-section>
        </q-item-section>
      </q-list>
    </q-card>
    <div class="rcv-btn">
      <div class="text-grey-8 q-gutter-xs q-pa-md">
        <q-btn :disable="DsdRcvOrder" class="btn-primary" label="查看明细" @click="to_order" />
        <q-btn :disable="!rcvItem" class="btn-primary" hidden label="提交" @click="post_rcv_item()" />
      </div>
    </div>
  </q-page>
</template>

<style lang="stylus" >
#order-pop {
  width: 100%;
}

.rcvInputLabel {
  vertical-align: bottom;
  line-height: 40px;
  text-align: center;
}

#orderCostInput, #orderQtyInput {
  max-width: 100px;
  text-align: center;
}
</style>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'PageStoreReceiving',
  data () {
    return {
      supplierNo: null, // 供应商号输入
      loc: null,
      inputBar: null, // 条码输入
      barcode: null,
      shipmentId: null, // 收货ID
      rcvItem: false,
      item: {},
      rcvCost: null, // 收货进价
      rcvQty: 0, // 收货数量
      countRcved: 0, // 已收品项
      DsdRcvOrder: false,
      supplier: {}, // 供应商信息
      supplierType: 0,
      dsdStatus: false,
      checkcost: false,
      rcvForm: {
        shipmentId: Number,
        itemId: String,
        barcode: String,
        qtyReceived: Number,
        unitCost: Number
      }, // 收货数据组
      orderRcved: {}, // 已收货未关单订单单品明细
      orderLoc: '', // 订单门店
      rtvmsg: '', // 退货信息
      rtvstatus: false,
      rtvorders: [] // 退货订单
    }
  },
  created () {
    this.CHANGE_TITLE('订单基本信息')
    this.BTN_PAGE(true)
    this.supplierNo = this.$route.query.supplierNo
    this.shipmentId = this.$route.query.shipmentId
    this.loc = this.$route.query.loc
  },
  mounted () {
    if (this.supplierNo) {
      this.get_supplier(this.supplierNo, this.shipmentId)
    }
  },
  watch: {
    tempSelected (val) {
      if (this.tempSelected[0]) {
        this.shipmentId = this.tempSelected[0].shipmentId
        this.supplierNo = this.tempSelected[0].supplierNo
        this.GET_SHIPMENTID(this.shipmentId)
        this.get_supplier(this.supplierNo, this.shipmentId)
      }
    }
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_PAGE', 'CHANGE_TITLE', 'RETURNFALSE']),
    to_select () {
      this.$router.push({ path: '/Rcv/DsdRcvSelect' })
    },
    to_order () {
      this.$router.push({
        path: '/Rcv/DsdRcv',
        query: {
          supplierNo: this.supplierNo,
          shipmentId: this.shipmentId,
          loc: this.loc
        }
      })
      this.$router.push({
        path: '/Rcv/DsdRcvOrder',
        query: {
          supplierNo: this.supplierNo,
          shipmentId: this.shipmentId,
          loc: this.loc
        }
      })
    },
    get_supplier (supplierNo, id) {
      if (supplierNo === '') {
        this.POP_MSG('供应商号不能为空')
      } else {
        this.shipmentId = id
        this.$api.Rcv.getSupplier(supplierNo).then(res => {
          // 获取供应商信息
          if (res.data.code === 0) {
            this.POP_MSG(res.data.msg)
          } else if (res.data.data.dsdInd === 0) {
            this.POP_MSG('该供应商非永续供应商')
          } else {
            this.storeRcv = true
            this.supplier = res.data.data
            this.supplierType = res.data.data.dsdInd
            if (this.supplierType === 0) {
              this.dsdStatus = true
            }
            this.$api.Rcv.getRtv(
              this.supplier.id,
              this.$store.state.location.id
            ).then(res => {
              // 获取退货单号
              if (res.data.code === 0) {
                this.rtvstatus = false
                this.rtvmsg = res.data.msg
              } else if (res.data.code === 1) {
                this.rtvstatus = true
                this.rtvorders = res.data.data
                  .map(function (item) {
                    return item['externalNo']
                  })
                  .slice(0, 2)
              }
            })
            this.$api.Rcv.getShipmentById(id).then(res => {
              // 获取已收品项数
              if (res.data.code !== 0) {
                this.countRcved = this._.filter(
                  res.data.data.shipmentLines,
                  function (o) {
                    return o.qtyReceived > 0
                  }
                ).length
                this.DsdRcvOrder = false
              } else {
                this.countRcved = 0
                this.DsdRcvOrder = true
              }
            })
            this.orderLoc = this.$store.state.location.id
            // console.log(this.$store.state.orderId)
          }
        })
      }
    },
    check_supplier_item () {
      if (this.inputBar === '') {
        this.POP_MSG('条码/货号不能为空')
      } else {
        let postinputBar = {
          SupplierId: this.supplier.id,
          LocationId: this.orderLoc,
          ItemOrBarcode: this.inputBar
        }
        this.$api.Rcv.getItemForDsdReceipt(postinputBar).then(res => {
          if (res.data.code === 1) {
            this.item = res.data.data
            this.get_supplier_item()
          } else {
            this.POP_MSG(res.data.msg)
          }
        })
      }
    },
    checkCost (val) {
      this.rcvCostRule(val)
      if (this.checkcost === true) {
        this.qtyFocus()
      }
    },
    rcvCostRule (val) {
      if (this.rcvItem === true) {
        if (
          Number(val) >=
            parseFloat(
              this.item.unitCost * (1 + this.item.costVatRate / 100) * 10
            ).toFixed(2) &&
          val != null
        ) {
          this.POP_MSG('进价不能大于等于合同进价十倍及以上')
          this.rcvCost = parseFloat(
            this.item.unitCost * (1 + this.item.costVatRate / 100)
          ).toFixed(2)
          this.checkcost = false
          this.costFocus()
        } else if (
          Number(val) <=
            parseFloat(
              (this.item.unitCost * (1 + this.item.costVatRate / 100)) / 10
            ).toFixed(2) &&
          val != null
        ) {
          this.POP_MSG('进价不能小于合同进价十分之一及以下')
          this.rcvCost = parseFloat(
            this.item.unitCost * (1 + this.item.costVatRate / 100)
          ).toFixed(2)
          this.checkcost = false
          this.costFocus()
        } else if (
          Number(val) <=
            parseFloat(
              (this.item.unitCost * (1 + this.item.costVatRate / 100)) / 2
            ).toFixed(2) &&
          val != null
        ) {
          this.NotiError('进价小于合同进价二分之一及以下')
          this.checkcost = true
        } else if (
          Number(val) >=
          parseFloat(
            this.item.unitCost * (1 + this.item.costVatRate / 100) * 2
          ).toFixed(2)
        ) {
          this.NotiError('进价大于等于合同进价二倍及以上')
          this.checkcost = true
        } else if (Number(val) === 0) {
          this.POP_MSG('进价不能为0')
          this.rcvCost = parseFloat(
            this.item.unitCost * (1 + this.item.costVatRate / 100)
          ).toFixed(2)
          this.checkcost = false
          this.costFocus()
        } else {
          this.checkcost = true
        }
      }
    },
    rcvQtyRule (val) {
      if (this.rcvItem === true) {
        if (this.item.itemUomId === 'KG') {
          this.rcvQty = this.Number2(this.rcvQty)
          this.post_rcv_item()
        } else {
          if (Number.isInteger(val) === false) {
            this.POP_MSG('非称重商品，不能输入非整数')
            this.rcvQty = null
          } else {
            this.rcvQty = Number(this.rcvQty)
            this.post_rcv_item()
          }
        }
      }
    },
    get_supplier_item () {
      this.rcvCost = parseFloat(
        this.item.unitCost * (1 + this.item.costVatRate / 100)
      ).toFixed(2)
      this.rcvForm.itemId = this.item.itemId
      this.$api.Rcv.getShipmentById(this.shipmentId).then(res => {
        if (res.data.code !== 0) {
          this.orderRcved = res.data.data.shipmentLines.find(value => {
            return value.itemId === this.rcvForm.itemId
          })
        }
        if (this.orderRcved.itemId !== undefined) {
          this.rcvQty = this.orderRcved.qtyReceived
          this.rcvCost = parseFloat(
            this.orderRcved.unitCost * (1 + this.orderRcved.costVatRate / 100)
          ).toFixed(2)
        } else {
          console.log('没有收货')
        }
      })
      this.rcvItem = true
      this.$refs.orderCostInput.focus()
    },
    thisFocus () {
      if (this.supplierType === 1) {
        // document.getElementById('orderCostInput').focus()
        this.$refs.orderCostInput.focus()
      } else {
        // document.getElementById('orderQtyInput').focus()
        this.$refs.orderQtyInput.focus()
      }
    },
    qtyFocus () {
      // document.getElementById('orderQtyInput').focus()
      this.$refs.orderQtyInput.focus()
    },
    costFocus () {
      // document.getElementById('orderCostInput').focus()
      this.$refs.orderCostInput.focus()
    },
    post_rcv_item () {
      this.rcvCostRule(this.rcvCost)
      if (this.rcvQty === '' || this.rcvCost === '' || this.rcvCost === 0) {
        this.POP_MSG('收货数量/进价不能为空')
      } else if (this.rcvQty > 9999) {
        this.POP_MSG('禁止超收9999以上')
      } else if (this.rcvQty < 0) {
        this.POP_MSG('收货数量不能小于0')
      } else if (this.checkcost === false) {
        console.log('价格校验失败')
      } else {
        let postRcvData = {
          ShipmentId: this.shipmentId,
          ItemId: this.rcvForm.itemId,
          LocationId: this.orderLoc,
          SupplierId: this.supplier.id,
          CostVatRate: this.item.costVatRate,
          Barcode: this.item.primaryBarcode,
          QtyReceived: this.rcvQty,
          UnitCost: parseFloat(
            this.rcvCost / (1 + this.item.costVatRate / 100)
          ).toFixed(4)
        }
        this.$api.Rcv.DsdItemReceive(postRcvData)
          .then(res => {
            console.log(res)
            if (res.data.code > 0) {
              this.shipmentId = res.data.code
              this.inputBar = ''
              this.rcvItem = false
              this.barcode = null
              this.rcvQty = 0
              this.rcvCost = 0
              console.log('提交成功')
            } else {
              this.POP_MSG(res.data.msg)
            }
            this.$refs.bar_input.focus()
            this.$api.Rcv.getShipmentById(this.shipmentId).then(res => {
              // 获取已收品项数
              if (res.data.code !== 0) {
                console.log(res.data.code)
                this.countRcved = this._.filter(
                  res.data.data.shipmentLines,
                  function (o) {
                    return o.qtyReceived > 0
                  }
                ).length
                this.DsdRcvOrder = false
                console.log(this.DsdRcvOrder)
              } else {
                this.countRcved = 0
                this.DsdRcvOrder = true
              }
            })
            this.$router.replace({
              path: '/Rcv/DsdRcv',
              query: {
                supplierNo: this.supplierNo,
                shipmentId: this.shipmentId,
                loc: this.loc
              }
            })
          })
          .catch(error => {
            this.POP_MSG('收货失败，重新提交')
            console.log(error)
          })
      }
    }
  }
}
</script>
