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
              <span class="q-pa-sm text-weight-bold text-black">配送单编号</span>
              <span class="q-pa-sm text-grey-8">{{ bolNo }}</span>
            </q-card-section>
            <q-card-section
              class="q-pa-xs"
              caption
            >
              <span class="q-pa-sm text-weight-bold text-black">货源仓</span>
              <span class="q-pa-sm text-grey-8">{{ fromLocationName }}</span>
            </q-card-section>
            <q-card-section
              class="q-pa-xs"
              caption
              line="1"
            >
              <span class="q-pa-sm text-weight-bold text-black">箱数总计</span>
              <span class="q-pa-sm text-grey-8">{{Total}}</span>
            </q-card-section>
          </q-item-section>
        </q-list>
      </q-item-section>
      <q-separator spaced />
      <q-table
        class="rcvedlist self-center col"
        :data="wtsOrder"
        :columns="columns"
        row-key="index"
        flat
        dense
        :pagination.sync="rcvedpagination"
        :rows-per-page-options="[0]"
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
            >{{ props.row.itemId }}</q-td>
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
            >{{ props.row.qtyReceived }}</q-td>
            <q-td
              class="rcvtd"
              key="qtyWTS"
              :props="props"
            >{{ props.row.qtyWTS }}</q-td>
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
          label="全部接收"
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
          <span class="q-ml-sm">是否完成当前收货？</span>
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
            @click="comfirmShipment()"
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
          <span class="q-ml-sm">是否进行配送单打印？</span>
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

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'PageStoreRcvOrder',
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
      orderList: [], // 订单行明细
      wtsOrder: [], // 列表行
      countRcved: 0,
      orderId: null,
      orderRcved: [], // 收货行明细
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
          label: '箱数',
          field: 'qtyExpected',
          sortable: true
        },
        {
          name: 'qtyReceived',
          label: '件数',
          field: 'qtyReceived',
          sortable: true
        },
        {
          name: 'qtyWTS',
          label: '配送数量',
          field: 'qtyWTS',
          sortable: true
        },
        {
          name: 'barcode',
          align: 'right',
          label: '国际条码',
          field: 'barcode',
          sortable: true
        }
      ],
      orderNo: null,
      fromLocationName: null,
      bolNo: null,
      shipmentId: null,
      Total: 0
    }
  },
  created () {
    this.CHANGE_TITLE('收货明细')
    this.BTN_PAGE(true)
    this.orderNo = this.$route.query.orderNo
    this.bolNo = this.$route.query.bolNo
    this.getorder()
  },
  computed: {},
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_PAGE', 'CHANGE_TITLE']),
    getorder () {
      this.$api.Ship.GetWTSShipmentByBolNo(this.bolNo).then(res => { // 获取配送单详情
        console.log(res)
        this.fromLocationName = res.data.data.fromLocation.name
        this.shipmentId = res.data.data.id
        this.wtsOrder = res.data.data.shipmentLines.map(val => {
          let json = {}
          json.itemId = val.item.id
          json.description = val.item.description
          json.barcode = val.barcode
          json.qtyWTS = val.qtyExpected
          json.qtyReceived = val.qtyExpected
          if (val.suppPackSize === null) {
            json.qtyExpected = 0
          } else {
            json.qtyExpected = parseInt(val.qtyExpected / val.suppPackSize)
          }
          this.Total += json.qtyExpected
          return json
        })
        // console.log(this.wtsOrder)
      })
    },
    comfirmShipment () { // 收货完成
      this.$api.Ship.CompleteWTSShipment(this.shipmentId).then(res => { // 配送单收货
        console.log(res)
        if (res.data.code === 1) {
          console.log(res.data)
          this.printFinish = true
        } else if (res.data.code < 1) {
          this.POP_MSG(res.data.msg)
        } else {
          this.POP_MSG('确认收货失败，请重新提交')
        }
      })
    },
    print () {
      let p = JSON.parse(localStorage.getItem('printer'))
      let printdata = {
        id: this.shipmentId,
        printer: p.printer,
        token: localStorage.getItem('Authorization'),
        printlink: 'Wts',
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
<style lang="stylus" ></style>
