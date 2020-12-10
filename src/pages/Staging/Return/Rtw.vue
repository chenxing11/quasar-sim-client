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
              <span class="q-pa-sm text-weight-bold text-black">返仓单号</span>
              <span class="q-pa-sm text-grey-8">{{ transfer.externalNo }}</span>
              <span class="q-pa-sm text-weight-bold text-black">仓库编码</span>
              <span class="q-pa-sm text-grey-8">{{ transfer.toLocationId }}</span>
            </q-card-section>
            <q-card-section
              class="q-pa-xs"
              caption
            >
              <span class="q-pa-sm text-weight-bold text-black">仓库名称</span>
              <span class="q-pa-sm text-grey-8">{{ transfer.toLocation.name }}</span>
            </q-card-section>
            <q-card-section
              class="q-pa-xs"
              caption
              line="1"
            >
              <span class="q-pa-sm text-weight-bold text-black">退货品项数</span>
              <span class="q-pa-sm text-grey-8">{{ transfer.transferLines.length }}</span>
              <span class="q-pa-sm text-weight-bold text-black">发运品项数</span>
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
        :data="rtwlines"
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
          @keydown.enter="qtyRule(rtwQty)"
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
              id="rtwQtyInput"
              color="black"
              class="q-pa-xs QtyInput"
              :input-style="{ 'text-align': 'center' }"
              :suffix=" item.uom"
              autofocus
              v-model.number="rtwQty"
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
          @click="qtyRule(rtwQty)"
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
          label="取消返仓"
          @click="rtwCancel = true"
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
          @click="rtwFinish = true"
        />
      </div>
    </div>
    <q-dialog
      v-model="rtwCancel"
      persistent
    >
      <q-card class="poptip">
        <q-card-section
          align="center"
          class="text-h6"
        >取消返仓</q-card-section>
        <q-card-section class="row justify-center">
          <span class="q-ml-sm">是否取消当前返仓？</span>
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
            @click="cancelRtw()"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog
      v-model="rtwFinish"
      persistent
    >
      <q-card class="poptip">
        <q-card-section
          align="center"
          class="text-h6"
        >发运返仓</q-card-section>
        <q-card-section class="row justify-center">
          <span class="q-ml-sm">是否发运当前返仓？</span>
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
            @click="CompleteRtw()"
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
        >返仓已发运</q-card-section>
        <q-card-section class="row justify-center">
          <span class="q-ml-sm">是否打印返仓清单？</span>
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
      rtwFinish: false,
      printFinish: false,
      rtwCancel: false,
      transfer: {
        toLocation: {
          name: null
        },
        transferLines: []
      },
      transferList: [], // 行明细
      rtwlines: [], // 列表行
      countRcved: 0,
      externalNo: null,
      shipmentId: null,
      inputBar: null,
      loc: null,
      rtwId: null,
      barcode: null,
      ordersItem: [],
      orderRcved: [], // 收货行明细
      rtwQty: 0,
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
          label: '返仓数量',
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
    this.CHANGE_TITLE('返仓基本信息')
    this.BTN_PAGE(true)
    this.externalNo = this.$route.query.externalNo
    this.rtwId = this.$route.query.rtwId
    this.loc = this.$route.query.loc
    this.getrtw()
    console.log(this.transfer.toLocation)
  },
  mounted () {
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_PAGE', 'CHANGE_TITLE', 'RETURNFALSE']),
    getrtw () {
      this.$api.Ship.GetShipmentByBolNo(this.externalNo).then(res => {
        // 获取shipment信息
        if (res.data.code !== 0) {
          console.log('有shipment')
          console.log(res.data.data)
          this.shipmentId = res.data.data.id
          this.shipstatus = false
          console.log(this.shipmentId)
          this.countRcved = this._.filter(res.data.data.shipmentLines, function (o) { return o.qtyExpected > 0 }).length
          this.$api.Rtw.getRtw(this.externalNo).then(res => {
            // 获取订单信息
            this.transfer = res.data.data
            console.log(this.transfer)
          })
          this.transferList = res.data.data.shipmentLines.map(val => {
            let json = {}
            json.itemId = val.itemId
            json.description = val.item.description
            json.uom = val.item.uom.description
            json.qtyExpected = val.qtyRequested
            json.qtyReceived = val.qtyExpected
            json.qtyCheck = val.qtyExpected - val.qtyRequested
            json.barcode = val.barcode
            return json
          })
          this.rtwlines = this._.uniqBy(this.transferList, 'itemId')
          this.ordersItem = this.rtwlines.map(function (item) { return item['itemId'] })
        } else {
          this.shipmentId = null
          console.log('未录入')
          this.$api.Rtw.getRtw(this.externalNo).then(res => {
            // 获取订单信息
            this.transfer = res.data.data
            console.log(this.transfer)
            this.transferList = res.data.data.transferLines.map(val => {
              let json = {}
              json.itemId = val.itemId
              json.description = val.item.description
              json.uom = val.item.uom.description
              json.qtyExpected = val.transferQty
              json.qtyReceived = val.shipQty
              json.qtyCheck = val.shipQty - val.transferQty
              json.barcode = ''
              return json
            })
            this.rtwlines = this._.uniqBy(this.transferList, 'itemId')
            this.ordersItem = this.rtwlines.map(function (item) { return item['itemId'] })
          })
        }
        console.log('信息')
        console.log(this.transfer)
        console.log('this.rtwlines')
        console.log(this.rtwlines)
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
                this.item = this.rtwlines.find((value, index, arr) => {
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
                this.item = this.rtwlines.find((value, index, arr) => {
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
        this.rtwQty = Number(this.item.qtyReceived)
        this.POP_MSG('收货数量不能为空')
      } else if (val > this.item.qtyExpected) {
        this.rtwQty = Number(this.item.qtyReceived)
        this.POP_MSG('输入数量大于预计数量')
      } else if (val < 0) {
        this.rtwQty = Number(this.item.qtyReceived)
        this.POP_MSG('输入数量不能小于0')
      } else {
        if (this.item.uom === '公斤') {
          this.rtwQty = this.Number2(this.rtwQty)
          console.log(this.rtwQty)
          this.CreateShipment()
        } else {
          console.log(val)
          console.log(Number.isInteger(val))
          if (Number.isInteger(val) === false) {
            console.log(val)
            this.POP_MSG('非称重商品，不能输入非整数')
            this.rtwQty = Number(this.item.qtyReceived)
            console.log(val)
          } else {
            this.rtwQty = Number(this.rtwQty)
            console.log(this.rtwQty)
            console.log(val)
            this.CreateShipment()
          }
        }
      }
    },
    check_item () {
      this.checkItem = true
      this.checkList = false
      this.rtwQty = Number(this.item.qtyReceived)
    },
    po_item () {
      this.checkItem = false
      this.checkList = true
      this.inputBar = null
      // document.getElementById('bar-input').focus()
      this.$refs.bar_input.focus()
      this.getrtw()
    },
    async CreateShipment () {
      await this.$api.Ship.GetShipmentByBolNo(this.externalNo).then(res => {
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
      this.$api.Rtw.poRtwItem({
        ShipmentId: this.shipmentId,
        TransferId: this.rtwId,
        ItemId: this.item.itemId,
        Barcode: this.barcode,
        QtyShipped: this.rtwQty
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
    CompleteRtw () {
      this.$api.Rtw.completeRtw(this.shipmentId).then(res => {
        if (res.data.code <= 0) {
          this.temp = true
          console.log(res.data.msg)
          this.POP_MSG(res.data.msg)
        } else {
          console.log(res)
          this.printFinish = true
        }
      })
    },
    cancelRtw () {
      this.$api.Rtw.cancelRtw(this.externalNo).then(res => {
        if (res.data.code <= 0) {
          this.temp = true
          console.log(res.data.msg)
          this.POP_MSG(res.data.msg)
        } else {
          console.log(res)
          this.NotiSuccess('返仓单已取消')
          this.$router.go(-1)
        }
      })
    },
    print () {
      let p = JSON.parse(localStorage.getItem('printer'))
      let printdata = {
        id: this.externalNo,
        printer: p.printer,
        token: localStorage.getItem('Authorization'),
        printlink: 'Rtw',
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
        this.NotiSuccess('返仓单已打印')
        this.$router.go(-1)
      })
    }
  }
}
</script>
