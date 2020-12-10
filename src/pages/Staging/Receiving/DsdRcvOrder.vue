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
              <span class="q-pa-sm text-weight-bold text-black">收货号</span>
              <span class="q-pa-sm text-grey-8">{{ shipment.id }}</span>
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
              key="unitCost"
              :props="props"
            >{{ props.row.unitCost }}</q-td>

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
            @click="$router.go(-2)"
            class="btn-negative"
            v-close-popup
          />
          <q-btn
            flat
            label="是"
            @click="print()"
            class="btn-primary"
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
      shipment: {
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
          label: '商品编号',
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
        }, {
          name: 'qtyReceived',
          label: '接收数量',
          field: 'qtyReceived',
          sortable: true
        },
        {
          name: 'uom',
          label: '单位',
          field: 'uom',
          sortable: false
        },
        {
          name: 'unitCost',
          label: '含税进价',
          field: 'unitCost',
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
    this.getshipment(this.shipmentId)
  },
  computed: {

  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_PAGE', 'CHANGE_TITLE']),
    getshipment (val) {
      this.$api.Rcv.getShipmentById(val).then(res => {
        console.log('收货信息')
        console.log(res.data)
        this.shipment = res.data.data
        console.log(this.shipment)
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
        this.rcvorder = this._.unionBy(this.orderRcved, this.orderList, 'itemId')
        console.log('orderList')
        console.log(this.orderList)
        console.log('this.orderRcved')
        console.log(this.orderRcved)
        console.log('rcvorder')
        console.log(this.rcvorder)
      })
    },
    computedRcv () {
      this.$api.Rcv.completeDsd(this.shipment.id).then(res => { // 收货完成
        if (res.data.code === this.shipment.id) {
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
        id: this.shipment.id,
        printer: p.printer,
        token: localStorage.getItem('Authorization'),
        printlink: 'DsdRcv',
        reprint: 0,
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
        } else {
          console.log(res.data.data)
        }
        this.$router.go(-2)
      })
    }
  }
}
</script>
