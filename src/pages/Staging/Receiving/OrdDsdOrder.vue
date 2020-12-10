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
              <span class="q-pa-sm text-weight-bold text-black">订单号</span>
              <span class="q-pa-sm text-grey-8">{{ orders.externalNo }}</span>
              <span class="q-pa-sm text-weight-bold text-black">收货号</span>
              <span class="q-pa-sm text-grey-8">{{ shipmentId }}</span>
            </q-card-section>
            <q-card-section
              class="q-pa-xs"
              caption
            >
              <span class="q-pa-sm text-weight-bold text-black">供应商</span>
              <span class="q-pa-sm text-grey-8">{{ orders.supplier.id }}</span>
              <span class="q-pa-sm text-grey-8">{{ orders.supplier.name }}</span>
            </q-card-section>
            <q-card-section
              class="q-pa-xs"
              caption
              line="1"
            >
              <span class="q-pa-sm text-weight-bold text-black">应收品项数</span>
              <span class="q-pa-sm text-grey-8">{{ orders.countOrded }}</span>
              <span class="q-pa-sm text-weight-bold text-black">已收品项数</span>
              <span class="q-pa-sm text-grey-8">{{ countRcved }}</span>
            </q-card-section>
          </q-item-section>
        </q-list>
      </q-item-section>
      <q-separator spaced />
      <q-table
        class="rcvedlist self-center col"
        :data="rcvorder"
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
              key="unitCost"
              :props="props"
            >{{ props.row.unitCost }}</q-td>
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
    </q-list>
    <div class="rcv-btn">
      <div class="text-grey-8 q-gutter-xs q-pa-md">
        <q-btn
          class="btn-primary"
          label="继续扫描"
          @click="$router.back(-1)"
        />
        <q-btn
          class="btn-primary"
          label="完成收货"
          @click="rcvFinish = true"
        />
      </div>
    </div>
    <q-dialog
      v-model="rcvFinish"
      persistent
    >
      <q-card class="poptip">
        <q-card-section
          align="center"
          class="text-h6"
        >完成收货</q-card-section>
        <q-card-section class="row justify-center">
          <span class="q-ml-sm">是否完成当前订单收货？</span>
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
            @click="computedRcv()"
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
        >收货已完成</q-card-section>
        <q-card-section class="row justify-center">
          <span class="q-ml-sm">是否打印验货清单？</span>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn
            flat
            label="否"
            class="btn-negative"
            @click="$router.go(-2)"
            v-close-popup
          />
          <q-btn
            flat
            label="是"
            class="btn-primary"
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
  name: 'PageOrdDsdOrder',
  data () {
    return {
      partRcv: 0,
      rcvedpagination: {
        page: 1,
        rowsPerPage: 0,
        sortBy: 'itemId'
      },
      rcvFinish: false,
      printFinish: false,
      orders: {
        id: Number,
        externalNo: String,
        supplier: {},
        orderLines: [],
        countOrded: 0
      },
      orderList: [],
      rcvorder: [],
      countRcved: 0,
      shipmentId: 0,
      orderRcved: [],
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
          label: '订购数量',
          field: 'qtyExpected',
          sortable: true
        },
        {
          name: 'qtyReceived',
          label: '接收数量',
          field: 'qtyReceived',
          sortable: true
        },
        {
          name: 'unitCost',
          label: '含税进价',
          field: 'unitCost',
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
    this.CHANGE_TITLE('收货明细')
    this.BTN_PAGE(true)
    this.orderNo = this.$route.query.orderNo
    this.orderId = this.$route.query.orderId
    this.shipmentId = this.$route.query.shipmentId
    this.loc = this.$route.query.loc
    this.getorder()
    console.log(this.shipmentId)
  },
  computed: {

  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_PAGE', 'CHANGE_TITLE']),
    getorder () {
      this.$api.Rcv.getOrder(this.orderNo).then(res => {
        // 获取订单信息
        this.orders = res.data.data
        this.orders.countOrded = res.data.data.orderLines.length
        this.orderList = res.data.data.orderLines.map(val => {
          let json = {}
          json.itemId = val.itemId
          json.description = val.item.description
          json.uom = val.item.uom.description
          json.qtyExpected = val.qtyOrdered
          json.unitCost = parseFloat(val.unitCost * (1 + val.costVatRate / 100)).toFixed(2)
          json.qtyReceived = 0
          json.barcode = ''
          return json
        })
        console.log('订单信息')
        console.log(res.data)
        this.$api.Rcv.getShipmentById(this.shipmentId).then(res => {
          // 获取订单信息
          console.log('收货信息')
          console.log(res.data)
          this.shipmentId = res.data.data.id
          console.log(this.shipmentId)
          this.countRcved = this._.filter(res.data.data.shipmentLines, function (o) { return o.qtyReceived > 0 }).length
          this.orderRcved = res.data.data.shipmentLines.map(val => {
            let json = {}
            json.itemId = val.itemId
            json.description = val.item.description
            json.uom = val.item.uom.description
            json.qtyReceived = val.qtyReceived
            json.qtyExpected = val.qtyExpected
            json.barcode = val.barcode
            json.unitCost = parseFloat(val.unitCost * (1 + val.costVatRate / 100)).toFixed(2)
            json.qtyCheck = val.qtyExpected - val.qtyReceived
            return json
          })
          this.rcvorder = this._.unionBy(this.orderRcved, this.orderList, 'itemId')
        })
      })
    },
    computedRcv () {
      this.$api.Rcv.completePoDsd(this.shipmentId).then(res => { // 收货完成
        if (res.data.code === this.shipmentId) {
          console.log(res.data)
          this.printFinish = true
        } else if (res.data.code < 1) {
          this.POP_MSG(res.data.msg)
        } else {
          this.NotiError('确认收货失败，请重新提交')
        }
      })
    },
    print () {
      let p = JSON.parse(localStorage.getItem('printer'))
      let printdata = {
        id: this.shipmentId,
        printer: p.printer,
        token: localStorage.getItem('Authorization'),
        printlink: 'OrdDsdRcv',
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
        this.NotiSuccess('验货清单已打印')
        this.$router.go(-2)
      })
    }
  }
}
</script>
