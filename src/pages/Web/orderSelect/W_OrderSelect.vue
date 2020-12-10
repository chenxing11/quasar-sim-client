<template>
  <q-page class="">
    <div class="q-pa-md">
      <div class="row">
        <div class="q-px-lg self-stretch column justify-center">
          <span class="text-bold text-black "
                style="font-size:1rem;color:#black;">功能类型</span>
        </div>
        <div class="q-gutter-sm">
          <q-radio v-model="DocumentType"
                   val="PO"
                   label="直送收货" />
          <q-radio v-model="DocumentType"
                   val="WTS"
                   label="配送收货" />
          <q-radio v-model="DocumentType"
                   val="STS"
                   label="店间调拨" />
          <q-radio v-model="DocumentType"
                   val="RTV"
                   label="退货" />
          <q-radio v-model="DocumentType"
                   val="STW"
                   label="返仓" />
        </div>
      </div>
      <div class="row">
        <q-input outlined
                 dense
                 type="number"
                 v-model.number="documentNumber"
                 class="col-4 q-py-xs q-px-lg">
          <template v-slot:before>
            <div class=" self-stretch column justify-center">
              <span class="text-bold text-black "
                    style="font-size:1rem;color:#black;">{{ orderName }}</span>
            </div>
          </template>
        </q-input>

        <q-input outlined
                 dense
                 v-model="startDate"
                 class="col-4 q-py-xs q-px-lg"
                 mask="date">
          <template v-slot:before>
            <div class=" self-stretch column justify-center">
              <span class="text-bold text-black "
                    style="font-size:1rem;color:#black;">收货时间</span>
            </div>
          </template>
          <template v-slot:append>
            <q-icon name="event"
                    class="cursor-pointer">
              <q-popup-proxy ref="startDate"
                             transition-show="scale"
                             transition-hide="scale">
                <q-date v-model="startDate"
                        @input="() => $refs.startDate.hide()" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-input outlined
                 dense
                 v-model="endDate"
                 class="col-3 q-pr-xl"
                 mask="date">
          <template v-slot:append>
            <q-icon name="event"
                    class="cursor-pointer">
              <q-popup-proxy ref="endDate"
                             transition-show="scale"
                             transition-hide="scale">
                <q-date v-model="endDate"
                        @input="() => $refs.endDate.hide()" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>

      <div class="row">
        <q-input outlined
                 dense
                 v-model.number="shipmentId"
                 type="number"
                 class="col-4 q-py-xs q-px-lg">
          <template v-slot:before>
            <div class=" self-stretch column justify-center">
              <span class="text-bold text-black "
                    style="font-size:1rem;color:#black;">收货编号</span>
            </div>
          </template>
        </q-input>

        <q-select outlined
                  dense
                  v-model="orderStatus"
                  class="col-4 q-py-xs q-px-lg"
                  :options="orderStatusList">
          <template v-slot:before>
            <div class=" self-stretch column justify-center">
              <span class="text-bold text-black "
                    style="font-size:1rem;color:#black;">{{ orderStatusName }}</span>
            </div>
          </template>
        </q-select>

        <div class="col-2 q-py-xs  q-gutter-lg self-end justify-center text-left">
          <q-btn class="btn-primary"
                 @click="getListShipments()"
                 label="查询" />
        </div>
      </div>
      <div class="row" v-if="supplierFlag">
        <q-input outlined
                 dense
                 v-model.number="SupplierId"
                 type="number"
                 class="col-4 q-py-xs q-px-lg">
          <template v-slot:before>
            <div class=" self-stretch column justify-center">
              <span class="text-bold text-black "
                    style="font-size:1rem;color:#black;">供应商编号</span>
            </div>
          </template>
        </q-input>
      </div>

      <div class="q-pa-md">
        <q-table flat
                 :data="orderList"
                 :columns="columns"
                 row-key="name">
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th v-for="col in props.cols"
                    :key="col.name"
                    width="25%"
                    :props="props"
                    class="text-black"
                    style="font-size:1rem;font-weight:bold;text-align:center">
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props"
                  @dblclick.native="details(props.row)">
              <q-td class="text-align"
                    key="documentNumber"
                    :props="props">{{ props.row.documentNumber }}</q-td>
              <q-td class="text-align"
                    key="shipmentId"
                    :props="props">{{ props.row.shipmentId }}</q-td>
              <q-td class="text-align"
                    key="date"
                    :props="props">{{ props.row.date }}</q-td>
              <q-td class="text-align"
                    key="status"
                    :props="props">{{ formatStatus(props.row.status) }}</q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
</template>
<script>
import { mapMutations } from 'vuex'
import { date } from 'quasar'
var timeStamp = Date.now()
export default {
  data () {
    return {
      DocumentType: 'PO',
      orderName: '订单编号',
      orderStatusName: '订单状态',
      orderStatusList: [
        { value: null, label: '全部' },
        { value: 'R', label: '已收货' },
        { value: 'P', label: '进行中' },
        { value: 'S', label: '已发运' },
        { value: 'C', label: '已关闭' },
        { value: 'I', label: '输入' }
      ],
      columnsList: {
        PO: [
          {
            name: 'documentNumber',
            required: true,
            label: '订单编号',
            field: row => row.name,
            format: val => `${val}`,
            sortable: true
          },
          { name: 'shipmentId', label: '收货编号', field: 'shipmentId' },
          { name: 'date', label: '收货日期', field: 'date' },
          { name: 'status', label: '状态', field: 'status' }
        ],
        WTS: [
          {
            name: 'documentNumber',
            required: true,
            label: '配送编号',
            field: row => row.name,
            format: val => `${val}`,
            sortable: true
          },
          { name: 'shipmentId', label: '收货编号', field: 'shipmentId' },
          { name: 'date', label: '收货日期', field: 'date' },
          { name: 'status', label: '状态', field: 'status' }
        ],
        STS: [
          {
            name: 'documentNumber',
            required: true,
            label: '调拨单编号',
            field: row => row.name,
            format: val => `${val}`,
            sortable: true
          },
          { name: 'shipmentId', label: '收货编号', field: 'shipmentId' },
          { name: 'date', label: '创建日期', field: 'date' },
          { name: 'status', label: '状态', field: 'status' }
        ],
        RTV: [
          {
            name: 'documentNumber',
            required: true,
            label: '退货编号',
            field: row => row.name,
            format: val => `${val}`,
            sortable: true
          },
          { name: 'shipmentId', label: '收货编号', field: 'shipmentId' },
          { name: 'date', label: '发运日期', field: 'date' },
          { name: 'status', label: '状态', field: 'status' }
        ],
        STW: [
          {
            name: 'documentNumber',
            required: true,
            label: '返仓编号',
            field: row => row.name,
            format: val => `${val}`,
            sortable: true
          },
          { name: 'shipmentId', label: '收货编号', field: 'shipmentId' },
          { name: 'date', label: '发运日期', field: 'date' },
          { name: 'status', label: '状态', field: 'status' }
        ]
      },
      // tableFalse: false,
      columns: [],
      orderList: [],
      orderStatus: { value: null, label: '全部' },
      documentNumber: null,
      startDate: null,
      endDate: null,
      shipmentId: null,
      LocationId: null,
      supplierFlag: true,
      SupplierId: null
    }
  },
  watch: {
    DocumentType (val) {
      this.orderList = []
      this.documentNumber = null
      this.startDate = null
      this.endDate = null
      this.shipmentId = null
      this.SupplierId = null
      this.orderStatus = { value: null, label: '全部' }
      switch (val) {
        case 'PO':
          this.columns = this.columnsList.PO
          this.orderName = '订单编号'
          this.orderStatusName = '订单状态'
          this.supplierFlag = true
          break
        case 'WTS':
          this.columns = this.columnsList.WTS
          this.orderName = '配送编号'
          this.orderStatusName = '配送单状态'
          this.supplierFlag = false
          break
        case 'STS':
          this.columns = this.columnsList.STS
          this.orderName = '调拨单编号'
          this.orderStatusName = '订单状态'
          this.supplierFlag = false
          break
        case 'RTV':
          this.columns = this.columnsList.RTV
          this.orderName = '退单编号'
          this.orderStatusName = '退单状态'
          this.supplierFlag = true
          break
        case 'STW':
          this.columns = this.columnsList.STW
          this.orderName = '返仓单编号'
          this.orderStatusName = '返仓单状态'
          this.supplierFlag = false
          break
      }
    }
  },
  created () {
    this.columns = this.columnsList.PO
    this.LocationId = localStorage.getItem('Location')
    this.datenow = date.formatDate(timeStamp, 'YYYY/MM/DD')
  },
  mounted () {
    if (this.$route.query.data) {
      this.documentNumber = this.$route.query.data.documentNumber
      this.startDate = this.$route.query.data.startDate
      this.endDate = this.$route.query.data.endDate
      this.shipmentId = this.$route.query.data.shipmentId
      this.orderStatus = this.$route.query.data.orderStatus
      this.DocumentType = this.$route.query.data.DocumentType
      this.ListShipments()
    }
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_GO', 'BTN_PAGE', 'CHANGE_TITLE']),
    getListShipments () {
      this.formatString()
      if (this.documentNumber !== null || this.shipmentId !== null || (this.endDate !== null && this.startDate !== null) || this.SupplierId !== null) {
        let date = (new Date(this.endDate) - new Date(this.startDate)) / (1000 * 60 * 60 * 24)
        if (date > 30) {
          this.POP_MSG('结束时间不能大于开始时间30天')
        } else if (date < 0) {
          this.POP_MSG('开始时间不能大于结束时间')
        } else {
          this.ListShipments()
        }
      } else {
        this.POP_MSG('请输入查询条件')
      }
    },
    ListShipments () {
      this.$api.Ship.ListShipments(
        this.LocationId,
        this.DocumentType,
        this.documentNumber,
        this.shipmentId,
        this.startDate,
        this.endDate,
        this.orderStatus.value,
        this.SupplierId
      ).then(res => {
        console.log(res)
        if (res.data.code > 0) {
          if (this.DocumentType === 'PO') {
            this.orderList = res.data.data.map(val => {
              let json = {}
              json.shipmentId = val.id
              if (val.order.externalNo !== null) {
                json.documentNumber = val.order.externalNo
              } else {
                json.documentNumber = val.order.id
              }
              json.date = val.receivedDate.slice(0, 10)
              json.status = val.status
              json.link = '/WebOrderSelect/PoOrder'
              return json
            })
          } else if (this.DocumentType === 'WTS') {
            this.orderList = res.data.data.map(val => {
              let json = {}
              json.shipmentId = val.id
              json.documentNumber = val.bolNo
              json.date = val.receivedDate.slice(0, 10)
              json.status = val.status
              json.link = '/WebOrderSelect/WtsOrder'
              return json
            })
          } else if (this.DocumentType === 'STS') {
            this.orderList = res.data.data.map(val => {
              let json = {}
              json.shipmentId = val.id
              json.documentNumber = val.bolNo
              json.date = val.shippedDate.slice(0, 10)
              json.status = val.status
              json.link = '/WebOrderSelect/StsOrder'
              return json
            })
          } else if (this.DocumentType === 'RTV') {
            this.orderList = res.data.data.map(val => {
              let json = {}
              json.shipmentId = val.id
              if (val.return.externalNo !== null) {
                json.documentNumber = val.return.externalNo
              } else {
                json.documentNumber = val.return.id
              }
              json.date = val.shippedDate.slice(0, 10)
              json.status = val.status
              json.link = '/WebOrderSelect/RtvOrder'
              return json
            })
          } else if (this.DocumentType === 'STW') {
            this.orderList = res.data.data.map(val => {
              let json = {}
              json.shipmentId = val.id
              json.documentNumber = val.bolNo
              json.date = val.shippedDate.slice(0, 10)
              json.status = val.status
              json.link = '/WebOrderSelect/StwOrder'
              return json
            })
          }
        } else {
          this.orderList = []
          this.POP_MSG(res.data.msg)
        }
      })
    },
    formatStatus (val) {
      var text
      switch (val) {
        case 'C':
          text = '已关闭'
          break
        case 'R':
          text = '已收货'
          break
        case 'P':
          text = '进行中'
          break
        case 'S':
          text = '已发运'
          break
        case 'I':
          text = '输入'
          break
      }
      return text
    },
    formatString () {
      if (this.documentNumber === '') {
        this.documentNumber = null
      }
      if (this.shipmentId === '') {
        this.shipmentId = null
      }
      if (this.startDate === '') {
        this.startDate = null
      }
      if (this.endDate === '') {
        this.endDate = null
      }
      if (this.SupplierId === '') {
        this.SupplierId = null
      }
    },
    details (val) {
      var objData = {
        documentNumber: this.documentNumber,
        startDate: this.startDate,
        endDate: this.endDate,
        shipmentId: this.shipmentId,
        orderStatus: { value: null, label: '全部' },
        DocumentType: this.DocumentType
      }
      this.$router.push({ path: val.link, query: { data: val, obj: objData } })
    }
  }
}
</script>
<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
}
.text-align {
  text-align: center;
}
</style>
