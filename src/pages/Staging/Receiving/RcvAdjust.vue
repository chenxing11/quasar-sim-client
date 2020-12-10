
<template>
  <q-page>
    <q-list class="orderlist">
      <q-item-section clickable>
        <q-list class="q-pa-xs">
          <q-item-section>
            <q-card-section
              class="q-pa-xs"
              caption
            >
              <span class="q-pa-sm text-weight-bold text-black">收货号</span>
              <span class="q-pa-sm text-grey-8">{{ shipment.id }}</span>
              <span
                v-if="rcvUnitsAdjId !== null"
                class="q-pa-sm text-weight-bold text-black"
              >调整单号</span>
              <span class="q-pa-sm text-grey-8">{{ rcvUnitsAdjId }}</span>
              <span class="q-pa-sm text-weight-bold text-black">订单类型</span>
              <span class="q-pa-sm text-grey-8">{{ shipment.type }}</span>
            </q-card-section>
            <q-card-section
              class="q-pa-xs"
              caption
            >
              <span class="q-pa-sm text-weight-bold text-black">供应商</span>
              <span class="q-pa-sm text-grey-8">{{ shipment.supplier.id }}</span>
              <span class="q-pa-sm text-grey-8">{{ shipment.supplier.name }}</span>
            </q-card-section>
            <q-card-section
              class="q-pa-xs"
              caption
              line="1"
            >
              <span class="q-pa-sm text-weight-bold text-black">应收品项数</span>
              <span class="q-pa-sm text-grey-8">{{ countOrdered }}</span>
              <span class="q-pa-sm text-weight-bold text-black">已收品项数</span>
              <span class="q-pa-sm text-grey-8">{{ countRcved }}</span>
            </q-card-section>
          </q-item-section>
        </q-list>
      </q-item-section>
      <q-item-section class="q-px-xs">
        <q-form
          @keydown.enter="check_order_item(inputBar)"
          @submit="RETURNFALSE()"
        >
          <q-input
            id="bar-input"
            ref="bar_input"
            class="q-px-xs"
            square
            fixed-bottom
            autofocus
            outlined
            v-model="inputBar"
            label="商品条码"
          >
            <template v-slot:append>
              <q-icon
                name="close"
                @click="inputBar = null, po_item()"
                class="cursor-pointer"
              />
            </template>
          </q-input>
        </q-form>
      </q-item-section>
      <q-separator spaced />
      <q-table
        v-if="checkList"
        class="adjustlist self-center col"
        :data="rcvorder"
        :columns="columns"
        row-key="index"
        selection="single"
        :selected.sync="tempSelected"
        flat
        hide-bottom
        :pagination.sync="rcvedpagination"
        :rows-per-page-options=[0]
      >
        <template v-slot:body="props">
          <q-tr class="allRcv">
            <q-td>
              <q-btn
                style="width:100%"
                key="index"
                flat
                label="调整"
                @click="props.selected = true"
              />
            </q-td>
            <q-td
              class="rcvtd"
              key="itemId"
              :props="props"
            >{{ props.row.itemId }}</q-td>
            <q-td
              class="rcvtd"
              key="description"
              :props="props"
            >{{ props.row.description }}</q-td>
            <q-td
              class="rcvtd"
              key="uom"
              :props="props"
            >{{ props.row.uom }}</q-td>
            <q-td
              class="rcvtd"
              key="qtyExpected"
              :props="props"
            >{{ props.row.qtyExpected }}</q-td>
            <q-td
              class="rcvtd"
              key="qtyReceived"
              :props="props"
            > {{ props.row.qtyReceived }}</q-td>
          </q-tr>
        </template>
      </q-table>
      <q-list
        class="q-pa-sm"
        v-if="checkItem"
      >
        <q-card-section
          class="q-pa-xs"
          caption
        >
          <span class="q-pa-sm text-weight-bold text-black">商品货号</span>
          <span class="q-pa-sm text-black">{{ item.itemId }}</span>
        </q-card-section>
        <q-card-section
          class="q-pa-xs"
          caption
        >
          <span class="q-pa-sm text-weight-bold text-black">品名</span>
          <span class="q-pa-sm text-black">{{ item.description }}</span>
        </q-card-section>
        <q-form
          @keydown.enter.stop="qtyRule(adjQty)"
          @submit="RETURNFALSE()"
        >
          <q-card-actions
            class="q-pa-xs"
            style="width:100%"
            caption
            line="1"
          >
            <span class="InputLabel q-pa-sm text-weight-bold text-black">接受数量</span>
            <q-input
              id="adjQtyInput"
              :input-style="{ 'text-align': 'center' }"
              color="black"
              class="q-pa-xs"
              :suffix=" item.uom"
              autofocus
              v-model.number="adjQty"
              :dense="true"
            />
          </q-card-actions>
        </q-form>
      </q-list>
    </q-list>
    <div
      class="rcv-btn"
      v-if="checkItem"
    >
      <div class="text-grey-8 q-gutter-xs q-pa-md">
        <q-btn
          class="btn-primary"
          label="确定"
          @click="qtyRule(adjQty)"
        />
      </div>
    </div>
    <div
      class="rcv-btn"
      v-if="checkList && rcvUnitsAdjId !== null"
    >
      <div class="text-grey-8 q-gutter-xs q-pa-md">
        <q-btn
          class="btn-primary"
          label="提交修改"
          @click="adjFinish = true"
        />
      </div>
    </div>
    <q-dialog
      v-model="adjFinish"
      persistent
    >
      <q-card class="poptip">
        <q-card-section
          align="center"
          class="text-h6"
        >提交修改</q-card-section>
        <q-card-section class="row justify-center">
          <span class="q-ml-sm">是否确认提交当前修改？</span>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn
            flat
            label="否"
            class="btn-negative"
            v-close-popup
          />
          <q-btn
            flat
            label="是"
            class="btn-primary"
            @click="CompleteAdj()"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog
      v-model="printFinish"
      persistent
    >
      <q-card class="poptip">
        <q-card-section
          align="center"
          class="text-h6"
        >修改已完成</q-card-section>
        <q-card-section class="row justify-center">
          <span class="q-ml-sm">是否进行订单打印？</span>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn
            @click="$router.go(-1)"
            flat
            class="btn-negative"
            label="否"
            v-close-popup
          />
          <q-btn
            @click="print()"
            flat
            class="btn-primary"
            label="是"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<style lang="stylus" >
.order-pop {
  width: 100%;
}

.rcvInputLabel {
  vertical-align: bottom;
  line-height: 40px;
  text-align: center;
}

#adjQtyInput {
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
      checkList: false,
      checkItem: false,
      storeRcv: false,
      adjFinish: false,
      printFinish: false,
      shipmentId: null, // 收货号输入
      printlink: null,
      shipment: {
        supplier: {}
      },
      countOrdered: null,
      countRcved: null,
      inputBar: null,
      rcvUnitsAdjId: null,
      postAdjData: {},
      ordersItem: {},
      item: {},
      adjQty: 0,
      rcvorder: [],
      tempSelected: [], // 选定行数据
      rcvedpagination: {
        page: 1,
        rowsPerPage: 0
      },
      columns: [
        {
          name: 'itemId',
          required: true,
          label: '商品编号',
          align: 'center',
          field: row => row.itemId,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'description',
          align: 'left',
          label: '商品描述',
          field: 'description'
        },
        {
          name: 'uom',
          label: '单位',
          field: 'uom'
        },
        {
          name: 'qtyExpected',
          label: '订购数量',
          field: 'qtyExpected'
        },
        {
          name: 'qtyReceived',
          label: '接收数量',
          field: 'qtyReceived'
        }
      ]
    }
  },
  created () {
    this.CHANGE_TITLE('收货明细')
    this.BTN_PAGE(true)
    this.shipmentId = this.$route.query.shipmentId
    this.getshipment(this.shipmentId)
    console.log('this.shipment')
    console.log(this.shipment)
  },
  mounted () {
  },
  watch: {
    tempSelected (val) {
      if (this.tempSelected[0]) {
        this.item = this.tempSelected[0]
        console.log(this.item)
        this.inputBar = this.item.itemId
        this.check_item()
      }
    }
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_GO', 'BTN_PAGE', 'CHANGE_TITLE', 'RETURNFALSE']),
    to_select () {
      this.$router.push({ path: '/Rcv/OrdRcvSelect' })
    },
    check_order_item (val) {
      if (val === null) {
        this.POP_MSG('条码/货号不能为空')
      } else {
        this.$api.Rcv.getitem(this.orderLoc, val).then(res => {
          if (res.data.code === 1) {
            console.log(res.data.data)
            if (val === res.data.data.item.id) {
              console.log('条码检索失败，货号检索成功')
              if (this.ordersItem.includes(res.data.data.item.id) === false) {
                this.POP_MSG('订单内无此商品，请检查！')
              } else {
                this.item = this.rcvorder.find((value, index, arr) => {
                  return value.itemId === res.data.data.item.id
                })
                console.log(this.item)
                this.check_item()
              }
            } else {
              console.log('条码检索成功')
              if (this.ordersItem.includes(res.data.data.item.id) === false) {
                this.POP_MSG('订单内无此商品，请检查！')
              } else {
                this.item = this.rcvorder.find((value, index, arr) => {
                  return value.itemId === res.data.data.item.id
                })
                console.log(this.item)
                this.check_item()
              }
            }
          } else {
            this.POP_MSG('商品无效，请检查！')
          }
        })
      }
    },
    qtyRule (val) {
      if (this.shipment.type === 'PO') {
        if (val === '') {
          this.adjQty = Number(this.item.qtyReceived)
          this.POP_MSG('收货数量不能为空')
        } else if (val > this.item.qtyExpected) {
          this.adjQty = Number(this.item.qtyReceived)
          this.POP_MSG('收货数量大于订货数量')
        } else if (val < 0) {
          this.adjQty = Number(this.item.qtyReceived)
          this.POP_MSG('收货数量不能小于0')
        } else {
          if (this.item.uom === '公斤') {
            this.adjQty = this.Number2(this.adjQty)
            console.log(this.adjQty)
            this.CreateAdj()
          } else {
            console.log(val)
            console.log(Number.isInteger(val))
            if (Number.isInteger(val) === false) {
              console.log(val)
              this.POP_MSG('非称重商品，不能输入非整数')
              this.adjQty = Number(this.item.qtyReceived)
              console.log(val)
            } else {
              this.adjQty = Number(this.adjQty)
              console.log(this.adjQty)
              console.log(val)
              this.CreateAdj()
            }
          }
        }
      } else if (this.shipment.type === 'DSD') {
        if (val === '') {
          this.adjQty = Number(this.item.qtyReceived)
          this.POP_MSG('收货数量不能为空')
        } else if (val > 9999) {
          this.adjQty = Number(this.item.qtyReceived)
          this.POP_MSG('禁止超收9999以上')
        } else if (val < 0) {
          this.adjQty = Number(this.item.qtyReceived)
          this.POP_MSG('收货数量不能小于0')
        } else {
          if (this.item.uom === '公斤') {
            this.adjQty = this.Number2(this.adjQty)
            console.log(this.adjQty)
            this.CreateAdj()
          } else {
            console.log(val)
            console.log(Number.isInteger(val))
            if (Number.isInteger(val) === false) {
              console.log(val)
              this.POP_MSG('非称重商品，不能输入非整数')
              this.adjQty = Number(this.item.qtyReceived)
              console.log(val)
            } else {
              this.adjQty = Number(this.adjQty)
              console.log(this.adjQty)
              console.log(val)
              this.CreateAdj()
            }
          }
        }
      } else if (this.shipment.type === 'PODSD') {
        if (val === '') {
          this.adjQty = Number(this.item.qtyReceived)
          this.POP_MSG('收货数量不能为空')
        } else if (val > this.item.qtyExpected * 1.5) {
          this.adjQty = Number(this.item.qtyReceived)
          this.POP_MSG('禁止超收150%以上')
        } else if (val < 0) {
          this.adjQty = Number(this.item.qtyReceived)
          this.POP_MSG('收货数量不能小于0')
        } else {
          if (this.item.uom === '公斤') {
            this.adjQty = this.Number2(this.adjQty)
            console.log(this.adjQty)
            this.CreateAdj()
          } else {
            console.log(val)
            console.log(Number.isInteger(val))
            Number.isInteger(val)
            if (Number.isInteger(val) === false) {
              console.log(val)
              this.POP_MSG('非称重商品，不能输入非整数')
              this.adjQty = Number(this.item.qtyReceived)
              console.log(val)
            } else {
              this.adjQty = Number(this.adjQty)
              console.log(val)
              this.CreateAdj()
            }
          }
        }
      } else {
        this.CreateAdj()
      }
    },
    getshipment (val) {
      this.$api.Rcv.getShipmentById(val).then(res => {
        if (res.data.code === 0) {
          this.POP_MSG(res.data.msg)
        } else {
          console.log('收货信息')
          console.log(res.data)
          this.shipment = res.data.data
          console.log(this.shipment)
          this.rcvUnitsAdjId = null
          this.countRcved = res.data.data.shipmentLines.length
          this.orderRcved = res.data.data.shipmentLines.map(val => {
            let json = {}
            json.itemId = val.itemId
            json.description = val.item.description
            json.qtyReceived = val.qtyReceived
            json.qtyExpected = val.qtyExpected
            json.uom = val.item.uom.description
            json.barcode = val.barcode
            json.unitCost = parseFloat(val.unitCost * (1 + val.costVatRate / 100)).toFixed(2)
            json.qtyCheck = val.qtyExpected - val.qtyReceived
            return json
          })
          this.rcvorder = this._.uniqBy(this.orderRcved, 'itemId')
          this.ordersItem = this.rcvorder.map(function (item) { return item['itemId'] })
          this.countOrdered = this.rcvorder.length
          if (res.data.data.order.externalNo !== null) {
            this.$api.Rcv.getOrder(res.data.data.order.externalNo).then(res => {
              // 获取订单信息
              console.log('有订单')
              console.log(res.data)
              this.orderList = res.data.data.orderLines.map(val => {
                let json = {}
                json.itemId = val.itemId
                json.description = val.item.description
                json.uom = val.item.uom.description
                json.qtyExpected = val.qtyOrdered
                json.qtyReceived = 0
                json.barcode = ''
                return json
              })
              this.rcvorder = this._.unionBy(this.orderRcved, this.orderList, 'itemId')
              this.ordersItem = this.rcvorder.map(function (item) { return item['itemId'] })
              this.countOrdered = this.ordersItem.length
            })
          }
          this.checkRcved = true
          this.checkList = true
        }
      })
    },
    check_item () {
      this.checkItem = true
      this.checkList = false
      this.adjQty = Number(this.item.qtyReceived)
    },
    po_item () {
      this.checkItem = false
      this.checkList = true
      this.inputBar = null
      // document.getElementById('bar-input').focus()
      this.$refs.bar_input.focus()
    },
    CreateAdj () {
      let postAdjData = {
        ShipmentId: this.shipment.id,
        RcvUnitsAdjId: this.rcvUnitsAdjId,
        ItemId: this.item.itemId,
        QtyReceived: this.adjQty
      }
      console.log(postAdjData)
      this.$api.Rcv.ReceiveUnitsAdjust(postAdjData).then(res => {
        if (res.data.code <= 0) {
          this.POP_MSG(res.data.msg)
        } else {
          console.log(res.data)
          this.rcvUnitsAdjId = res.data.code
          this._.set(this.item, 'qtyReceived', Number(this.adjQty))
          console.log(this.item)
          this.po_item()
        }
      })
    },
    CompleteAdj () {
      this.$api.Rcv.completeRcvUnitsAdj(this.rcvUnitsAdjId).then(res => {
        if (res.data.code === 0) {
          this.temp = true
          console.log(res.data.msg)
        } else {
          console.log(res)
          switch (this.shipment.type) {
            case 'PO':
              this.printlink = 'OrdRcv'
              break
            case 'PODSD':
              this.printlink = 'OrdDsdRcv'
              break
            case 'DSD':
              this.printlink = 'DsdRcv'
              break
          }
          this.printFinish = true
          console.log(this.printlink)
        }
      })
    },
    print () {
      let p = JSON.parse(localStorage.getItem('printer'))
      let printdata = {
        id: this.shipment.id,
        printer: p.printer,
        token: localStorage.getItem('Authorization'),
        printlink: this.printlink,
        reprint: false,
        width: this._.isNull(p.p_width) ? this.$store.state.p_width + 'cm' : p.p_width + 'cm',
        height: this._.isNull(p.p_height) ? this.$store.state.p_height + 'cm' : p.p_height + 'cm',
        top: this._.isNull(p.p_top) ? this.$store.state.p_top + 'cm' : p.p_top + 'cm',
        left: this._.isNull(p.p_left) ? this.$store.state.p_left + 'cm' : p.p_left + 'cm',
        right: this._.isNull(p.p_right) ? this.$store.state.p_right + 'cm' : p.p_right + 'cm',
        bottom: this._.isNull(p.p_bottom) ? this.$store.state.p_bottom + 'cm' : p.p_bottom + 'cm'
      }
      console.log(printdata)
      this.$api.Print.P_Rcv(printdata).then(res => {
        if (res.data.code === 0) {
          console.log(res.data.data)
          this.NotiSuccess('验货清单已打印')
          this.$router.go(-2)
        } else {
          console.log(res.data.data)
        }
      })
    }
  }
}
</script>
