<template>
  <q-page class="orderlist">
    <q-list class="q-px-md">
      <q-item-section clickable>
        <q-list>
          <q-item-section>
            <q-card-section
              class="q-pa-xs"
              caption
            >
              <span class="q-pa-sm text-weight-bold text-black">退货单号</span>
              <span class="q-pa-sm text-grey-8">{{ returns.externalNo }}</span>
              <span class="q-pa-sm text-weight-bold text-black">供应商编码</span>
              <span class="q-pa-sm text-grey-8">{{ returns.supplier.id }}</span>
            </q-card-section>
            <q-card-section
              class="q-pa-xs"
              caption
            >
              <span class="q-pa-sm text-weight-bold text-black">供应商名称</span>
              <span class="q-pa-sm text-grey-8">{{ returns.supplier.name }}</span>
            </q-card-section>
            <q-card-section
              class="q-pa-xs"
              caption
              line="1"
            >
              <span class="q-pa-sm text-weight-bold text-black">退货品项数</span>
              <span class="q-pa-sm text-grey-8">{{ returns.returnLines.length }}</span>
              <span class="q-pa-sm text-weight-bold text-black">发运品项数</span>
              <span class="q-pa-sm text-grey-8">{{ countRcved.length }}</span>
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
            autocomplete="off"
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
        class="rcvedlist self-center col"
        v-if="checkList"
        :data="rtvlines"
        :columns="columns"
        row-key="index"
        flat
        hide-bottom
        dense
        :pagination.sync="rcvedpagination"
        :rows-per-page-options=[0]
      >
        <template v-slot:body="props">
          <q-tr
            :props="props"
            :class="props.row.qtyCheck === 0?'allRcv':'partRcv'"
          >
            <q-td
              class="rcvtd"
              key="itemId"
              :props="props"
            >
              {{ props.row.itemId }}
            </q-td>
            <q-td
              class="rcvtd"
              key="description"
              :props="props"
            >{{ props.row.description }}</q-td>

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
            <q-td
              class="rcvtd"
              key="uom"
              :props="props"
            >{{ props.row.uom }}</q-td>
            <q-td
              class="rcvtd"
              key="barcode"
              :props="props"
            >{{ props.row.barcode }}</q-td>

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
          @keydown.enter="qtyRule(rtvQty)"
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
              id="rtvQtyInput"
              :input-style="{ 'text-align': 'center' }"
              color="black"
              class="q-pa-xs QtyInput"
              :suffix=" item.uom"
              autofocus
              v-model.number="rtvQty"
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
          @click="qtyRule(rtvQty)"
        />
      </div>
    </div>
    <div
      class="rcv-btn"
      v-if="checkList"
    >
      <div class="text-grey-8 q-gutter-xs q-pa-md">
        <q-btn
          class="btn-primary"
          label="取消退货"
          @click="rtvCancel = true"
        />
        <q-btn
          class="btn-primary"
          label="保存"
          @click="$router.back(-1)"
        />
        <q-btn
          :disable="shipstatus"
          class="btn-primary"
          label="发运"
          @click="rtvFinish = true"
        />
      </div>
    </div>
    <q-dialog
      v-model="rtvCancel"
      persistent
    >
      <q-card class="poptip">
        <q-card-section
          align="center"
          class="text-h6"
        >取消退货</q-card-section>
        <q-card-section class="row justify-center">
          <span class="q-ml-sm">是否取消当前退货？</span>
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
            @click="cancelRtv()"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog
      v-model="rtvFinish"
      persistent
    >
      <q-card class="poptip">
        <q-card-section
          align="center"
          class="text-h6"
        >发运退货</q-card-section>
        <q-card-section class="row justify-center">
          <span class="q-ml-sm">是否发运当前退货？</span>
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
            @click="Completertv()"
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
        >退货已发运</q-card-section>
        <q-card-section class="row justify-center">
          <span class="q-ml-sm">是否打印退货清单？</span>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn
            flat
            class="btn-negative"
            replace
            label="否"
            @click="$router.go(-1)"
            v-close-popup
          />
          <q-btn
            flat
            class="btn-primary"
            replace
            label="是"
            @click="print()"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<style lang="stylus" ></style>

<script>
import { mapMutations } from 'vuex'

export default {
  data () {
    return {
      shipstatus: true,
      lock: false,
      checkList: true,
      checkItem: false,
      partRcv: 0,
      rcvedpagination: {
        page: 1,
        rowsPerPage: 0,
        sortBy: 'itemId'
      },
      rtvCancel: false,
      rtvFinish: false,
      printFinish: false,
      returns: {
        supplier: {
          id: null,
          name: null
        },
        returnLines: []
      },
      returnList: [], // 行明细
      rtvlines: [], // 列表行
      countRcved: 0,
      externalNo: null,
      shipmentId: null,
      inputBar: null,
      loc: null,
      rtvId: null,
      barcode: null,
      ordersItem: [],
      orderRcved: [], // 收货行明细
      rtvQty: 0,
      columns: [
        {
          name: 'itemId',
          required: true,
          label: '商品编码',
          align: 'left',
          field: row => row.itemId,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'description',
          align: 'left',
          label: '商品描述',
          field: 'description',
          sortable: true
        },
        {
          name: 'qtyExpected',
          label: '退货数量',
          field: 'qtyExpected',
          sortable: true
        },
        {
          name: 'qtyReceived',
          label: '发运数量',
          field: 'qtyReceived',
          sortable: true
        },
        {
          name: 'uom',
          label: '单位',
          field: 'uom',
          sortable: true
        },
        {
          name: 'barcode',
          align: 'right',
          label: '国际条码',
          field: 'barcode',
          sortable: true
        }
      ]
    }
  },
  created () {
    this.CHANGE_TITLE('退货基本信息')
    this.BTN_PAGE(true)
    this.externalNo = this.$route.query.externalNo
    this.rtvId = this.$route.query.rtvId
    this.loc = this.$route.query.loc
    this.getrtv()
  },
  mounted () {
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_PAGE', 'CHANGE_TITLE', 'RETURNFALSE']),
    getrtv () {
      this.$api.Ship.GetShipmentByReturnId(this.rtvId).then(res => {
        console.log(res.data)
        // 获取shipment信息
        if (res.data.code !== 0) {
          console.log('有订单')
          this.shipmentId = res.data.data.id
          this.shipstatus = false
          this.countRcved = this._.filter(res.data.data.shipmentLines, function (o) { return o.qtyExpected !== 0 })
          this.$api.Rtv.getRtv(this.externalNo).then(res => {
            // 获取订单信息
            this.returns = res.data.data
          })
          this.returnList = res.data.data.shipmentLines.map(val => {
            let json = {}
            json.itemId = val.itemId
            json.description = val.item.description
            json.uom = val.item.uom.description
            json.qtyExpected = val.qtyRequested
            json.qtyReceived = val.qtyExpected
            json.barcode = val.barcode
            json.qtyCheck = val.qtyRequested - val.qtyExpected
            return json
          })
          this.rtvlines = this._.uniqBy(this.returnList, 'itemId')
          this.ordersItem = this.rtvlines.map(function (item) { return item['itemId'] })
        } else {
          this.shipmentId = null
          console.log('未录入')
          this.$api.Rtv.getRtv(this.externalNo).then(res => {
            // 获取订单信息
            this.returns = res.data.data
            this.returnList = res.data.data.returnLines.map(val => {
              let json = {}
              json.itemId = val.itemId
              json.description = val.item.description
              json.uom = val.item.uom.description
              json.qtyExpected = val.qtyRequested
              json.qtyReceived = val.qtyReturned
              json.qtyCheck = val.qtyRequested - val.qtyReturned
              json.barcode = ''
              return json
            })
            this.rtvlines = this._.uniqBy(this.returnList, 'itemId')
            this.ordersItem = this.rtvlines.map(function (item) { return item['itemId'] })
          })
        }
      })
    },

    check_order_item (val) {
      if (val === null) {
        this.POP_MSG('条码/货号不能为空')
      } else {
        this.$api.Rcv.getitem(this.loc, val).then(res => {
          if (res.data.code === 1) {
            console.log(res.data.data)
            if (val === res.data.data.item.id) {
              console.log('条码检索失败，货号检索成功')
              if (this.ordersItem.includes(res.data.data.item.id) === false) {
                this.POP_MSG('订单内无此商品，请检查！')
              } else {
                this.item = this.rtvlines.find((value, index, arr) => {
                  return value.itemId === res.data.data.item.id
                })
                this.barcode = res.data.data.primaryBarcode
                console.log('this.item')
                console.log(this.item)
                this.check_item()
              }
            } else {
              console.log('条码检索成功')
              if (this.ordersItem.includes(res.data.data.item.id) === false) {
                this.POP_MSG('订单内无此商品，请检查！')
              } else {
                this.item = this.rtvlines.find((value, index, arr) => {
                  return value.itemId === res.data.data.item.id
                })
                this.barcode = val
                console.log('this.item')
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
      if (val === '') {
        this.rtvQty = Number(this.item.qtyReceived)
        this.POP_MSG('收货数量不能为空')
      } else if (val > this.item.qtyExpected) {
        this.rtvQty = Number(this.item.qtyReceived)
        this.POP_MSG('输入数量大于预计数量')
      } else if (val < 0) {
        this.rtvQty = Number(this.item.qtyReceived)
        this.POP_MSG('输入数量不能小于0')
      } else {
        if (this.item.uom === '公斤') {
          this.rtvQty = this.Number2(this.rtvQty)
          console.log(this.rtvQty)
          this.CreateShipment()
        } else {
          console.log(val)
          console.log(Number.isInteger(val))
          if (Number.isInteger(val) === false) {
            console.log(val)
            this.POP_MSG('非称重商品，不能输入非整数')
            this.rtvQty = Number(this.item.qtyReceived)
            console.log(val)
          } else {
            this.rtvQty = Number(this.rtvQty)
            console.log(this.rtvQty)
            console.log(val)
            this.CreateShipment()
          }
        }
      }
    },
    check_item () {
      this.checkItem = true
      this.checkList = false
      this.rtvQty = Number(this.item.qtyReceived)
    },
    po_item () {
      this.checkItem = false
      this.checkList = true
      this.inputBar = null
      this.$refs.bar_input.focus()
      this.getrtv()
    },
    async CreateShipment () {
      await this.$api.Ship.GetShipmentByReturnId(this.rtvId).then(res => {
        console.log(res.data)
        if (res.data.code !== 0) {
          console.log('有订单1')
          console.log(res.data.data)
          this.shipmentId = res.data.data.id
        } else {
          console.log('无订单1')
          console.log(this.shipmentId)
        }
      })
      this.$api.Rtv.poRtvItem({
        ShipmentId: this.shipmentId,
        ReturnId: this.rtvId,
        ItemId: this.item.itemId,
        Barcode: this.barcode,
        QtyShipped: this.rtvQty
      }).then(res => {
        if (res.data.code <= 0) {
          this.POP_MSG(res.data.msg)
        } else {
          console.log(res.data)
          this._.set(this.item, 'qtyReceived', Number(this.rtvQty))
          console.log(this.item)
          this.po_item()
        }
      })
    },
    Completertv () {
      console.log(this.shipmentId)
      this.$api.Rtv.completeRtv(this.shipmentId).then(res => {
        if (res.data.code <= 0) {
          this.temp = true
          console.log(res)
          console.log(res.data.msg)
          this.POP_MSG(res.data.msg)
        } else {
          console.log(res)
          this.printFinish = true
        }
      })
    },
    cancelRtv () {
      this.$api.Rtv.cancelRtv(this.returns.externalNo).then(res => {
        if (res.data.code <= 0) {
          this.temp = true
          console.log(res.data.msg)
          this.POP_MSG(res.data.msg)
        } else {
          console.log(res)
          this.NotiSuccess('退货单已取消')
          this.$router.go(-1)
        }
      })
    },
    print () {
      let p = JSON.parse(localStorage.getItem('printer'))
      let printdata = {
        id: this.returns.externalNo,
        printer: p.printer,
        token: localStorage.getItem('Authorization'),
        printlink: 'Rtv',
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
        } else {
          console.log(res.data.data)
        }
        this.NotiSuccess('退货单已打印')
        this.$router.go(-1)
      })
    }
  }
}
</script>
