<template>
  <q-page
    v-if="checkList"
    class="printlist"
  >
    <div class="q-pa-xs row">
      <h6 class="col-12 text-center print-title">北京华联综合超市股份有限公司<br>验货清单（配送收货）</h6>
      <q-list class="q-py-xs q-px-md row col-12">
        <q-item class="col-12 print-header">
          <q-item-section class="list-title col-6">门店: {{shipment.toLocation.id + ' ' + shipment.toLocation.name}}</q-item-section>
          <q-item-section class="list-title col-6">收货号: {{ shipment.id }}</q-item-section>
        </q-item>
        <q-item class="col-12 print-header">
          <q-item-section class="list-title col-6">仓库编号: {{ shipment.fromLocation.id }}</q-item-section>
          <q-item-section class="list-title col-6">配送单号: {{ shipment.bolNo }}</q-item-section>
        </q-item>
        <q-item class="col-12 print-header">
          <q-item-section class="list-title col-6">仓库名称: {{ shipment.fromLocation.name }}</q-item-section>
          <q-item-section class="list-title col-6">到货日期: {{ shipment.receivedDate.substr(0, 10) }}</q-item-section>
        </q-item>
        <q-item class="col-12 print-header">
          <q-item-section class="list-title col-6">仓库地址: {{ shipment.fromLocation.address }}</q-item-section>
          <q-item-section class="list-title col-6">集装箱号: </q-item-section>
        </q-item>
        <q-item class="col-12 print-header">
          <q-item-section class="list-title col-6">供应商电话: {{ shipment.fromLocation.contactPhone }}</q-item-section>
          <q-item-section class="list-title col-6">收货部电话: {{shipment.toLocation.managerPhone}}</q-item-section>
        </q-item>
        <q-item class="col-12 print-header">
          <q-item-section class="col-6 ">备注：如有收货差异请于3日内与门店联系。</q-item-section>
          <q-item-section class="col-6 reprint"><span
              v-if="reprint == 1"
              class="printsatus"
            >重复打印: {{ printtime.substr(0, 10) + ' '+ printtime.substr(11, 8) }} 打印人: {{ realname }}</span>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <q-list class="q-py-xs q-px-md">
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
          <q-tr :props="props">
            <q-td
              class="rcvtd"
              key="group"
              :props="props"
            >{{ props.row.group }}</q-td>
            <q-td
              class="rcvtd"
              key="itemId"
              :props="props"
            >
              {{ Number(props.row.itemId) }}
            </q-td>
            <q-td
              class="rcvtd"
              style="max-width:220px;white-space:normal;"
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
              key="barcode"
              :props="props"
            >{{ props.row.barcode }}</q-td>
            <q-td
              class="rcvtd"
              key="qtyExpected"
              :props="props"
            > {{ props.row.qtyExpected }}</q-td>
            <q-td
              class="rcvtd"
              key="qtyReceived"
              :props="props"
            > {{ props.row.qtyReceived }}</q-td>
          </q-tr>
        </template>
      </q-table>
    </q-list>
    <div class="q-py-xs q-px-md">
      <q-markup-table
        dense
        class="rcvedlist"
        separator="cell"
        flat
        bordered
      >
        <thead>
          <tr>
            <th class="text-center text-black">收货员</th>
            <th class="text-center text-black">验货员</th>
            <th class="text-center text-black">供应商签字</th>
            <th class="text-center text-black">收货时间</th>
            <th class="text-center text-black">安保员</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-center text-black">{{ shipment.receivedByName }}</td>
            <td class="text-center text-black"></td>
            <td class="text-center text-black"></td>
            <td class="text-center text-black">{{ shipment.receivedDate.substr(11, 8) }}</td>
            <td class="text-center text-black"></td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>
    <div class="print-btn">
      <div class="text-grey-8 q-gutter-xs q-pa-md">
        <q-btn
          v-if="btn"
          class="print-primary"
          label="返回"
          @click="$router.back(-1)"
        />
        <q-btn
          v-if="btn"
          :disable="shipment.status === 'P' || shipment.status === 'I'"
          class="print-primary"
          label="打印"
          @click="print()"
        />
      </div>
    </div>
  </q-page>
</template>

<style lang="stylus" >
.list-title {
  justify-content: flex-start;
}
</style>

<script>
import { mapMutations } from 'vuex'
import { date } from 'quasar'
let timeStamp = Date.now()
// let printtime = date.formatDate(timeStamp, 'YYYY-MM-DDTHH:mm:ss.SSSZ')

export default {
  name: 'PageStoreRcvOrder',
  data () {
    return {
      realname: null,
      rcvedpagination: {
        page: 1,
        rowsPerPage: 0,
        sortBy: 'itemId'
      },
      bolno: null,
      printtime: null,
      orders: {},
      orderList: [],
      supplier: {
        settlementCenter: {
          description: null
        }
      },
      rcvorder: [{
        barcode: Number,
        description: String,
        itemId: Number,
        qtyCheck: Number,
        qtyExpected: Number,
        qtyReceived: Number
      }],
      orderRcved: [],
      checkList: true,
      printstatus: false,
      btn: false,
      columns: [
        {
          name: 'group',
          required: true,
          label: '品类组',
          align: 'left'
        },
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
          field: 'description'
        },
        {
          name: 'uom',
          label: '单位',
          field: 'uom'
        },
        {
          name: 'barcode',
          align: 'right',
          label: '商品条码',
          field: 'barcode'
        },
        {
          name: 'qtyExpected',
          label: '配送数量',
          field: 'qtyExpected'
        },
        {
          name: 'qtyReceived',
          label: '实收数量',
          field: 'qtyReceived'
        }
      ],
      shipment: {
        toLocation: { id: null, name: null },
        fromLocation: { id: null, name: null }
      }
    }
  },
  created () {
    this.reprint = this.$route.query.reprint
    this.printer = this.$route.query.printer
    this.btn = this.$route.query.btn
    this.getlist(this.$route.query.id, this.$route.query.token)
  },
  mounted () {
    this.printtime = date.formatDate(timeStamp, 'YYYY-MM-DDTHH:mm:ss.SSSZ')
  },
  computed: {
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_PAGE']),
    print () {
      let p = JSON.parse(localStorage.getItem('printer'))
      let printdata = {
        id: this.$route.query.id,
        printer: this.printer,
        token: localStorage.getItem('Authorization'),
        printlink: 'Wts',
        reprint: 1,
        width: this._.isNull(p.p_width) ? this.$store.state.p_width + 'cm' : p.p_width + 'cm',
        height: this._.isNull(p.p_height) ? this.$store.state.p_height + 'cm' : p.p_height + 'cm',
        top: this._.isNull(p.p_top) ? this.$store.state.p_top + 'cm' : p.p_top + 'cm',
        left: this._.isNull(p.p_left) ? this.$store.state.p_left + 'cm' : p.p_left + 'cm',
        right: this._.isNull(p.p_right) ? this.$store.state.p_right + 'cm' : p.p_right + 'cm',
        bottom: this._.isNull(p.p_bottom) ? this.$store.state.p_bottom + 'cm' : p.p_bottom + 'cm'
      }
      this.$api.Print.P_Rcv(printdata).then(res => {
        if (res.data.code === 0) {
          console.log(res.data.data)
          this.NotiSuccess('验货清单已打印')
        } else {
          console.log(res.data.data)
        }
      })
    },
    getlist (id, token) {
      this.$api.Print.P_info(token).then(res => {
        this.realname = res.data.data.realname
      })
      this.$api.Print.P_getShipmentById(id, token).then(res => {
        if (res.data.code === 0) {
          this.POP_MSG(res.data.msg)
        } else {
          this.bolno = res.data.data.bolNo
          console.log(res.data.data)
          console.log(this.bolno)
          this.$api.Print.P_GetWTSShipmentByBolNo(this.bolno, token).then(res => {
            console.log(res.data.data)
            this.shipment = res.data.data
            this.rcvorder = res.data.data.shipmentLines.map(val => {
              let json = {}
              json.group = val.item.group.name
              json.itemId = val.itemId
              json.description = val.item.description
              json.uom = val.item.uom.description
              json.barcode = val.barcode
              json.qtyExpected = val.qtyExpected
              json.qtyReceived = val.qtyReceived
              return json
            })
          })
          console.log(this.shipment)
          // this.ordersItem = this.rcvorder.map(function (item) { return item['itemId'] })
          // this.checkRcved = true
          this.checkList = true
        }
      })
    }
  }
}
</script>
