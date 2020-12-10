<template>
  <q-page class="orderlist">
    <q-list class="q-pa-xs">
      <q-item-section>
        <q-card-section
          class="q-pa-xs"
          caption
        >
          <span class="q-pa-sm text-weight-bold text-black">申请门店</span>
          <span class="q-pa-sm text-grey-8">{{ toLocationLabel }}</span>
        </q-card-section>

        <q-card-section
          v-if="shipedData.externalNo !== null"
          class="q-pa-xs"
          caption
        >
          <span class="q-pa-sm text-weight-bold text-black">外部单据编号</span>
          <span class="q-pa-sm text-grey-8">{{ shipedData.externalNo }}</span>
        </q-card-section>

        <q-card-section
          class="q-pa-xs"
          caption
        >
          <span class="q-pa-sm text-weight-bold text-black">收货编号</span>
          <span class="q-pa-sm text-grey-8">{{ shipedData.id }}</span>
        </q-card-section>

        <q-card-section
          class="q-pa-xs"
          caption
        >
          <span class="q-pa-sm text-weight-bold text-black">收货品项数</span>
          <span class="q-pa-sm text-grey-8">{{ shipedList.length }}</span>
        </q-card-section>

        <q-card-section
          class="q-pa-xs"
          caption
        >
          <span class="q-pa-sm text-weight-bold text-black">申请时间</span>
          <span class="q-pa-sm text-grey-8">{{ shipedData.createdDate.substring(0, 10) }}</span>
        </q-card-section>

        <q-card-section
          class="q-pa-xs"
          caption
        >
          <span class="q-pa-sm text-weight-bold text-black">已添加品项数</span>
          <span class="q-pa-sm text-grey-8">{{ shipedList.length }}</span>
        </q-card-section>
      </q-item-section>

      <div class="q-pt-md q-pa-sm">
        <q-table
          table-style="max-height: 300px"
          virtual-scroll
          flat
          :data="shipedList"
          :pagination.sync="rcvedpagination"
          :rows-per-page-options=[0]
          :columns="columns"
        >
          <template v-slot:body="props">
            <q-tr class="allRcv">
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
                key="requestQty"
                :props="props"
              >{{ props.row.requestQty }}</q-td>
              <q-td
                class="rcvtd"
                key="acceptQty"
                :props="props"
              >{{ props.row.acceptQty }}</q-td>
              <q-td
                class="rcvtd"
                key="shipQty"
                :props="props"
              >{{ props.row.shipQty }}</q-td>
              <q-td
                class="rcvtd"
                key="ReceiveQty"
                :props="props"
              >{{ props.row.ReceiveQty }}</q-td>
              <q-td
                class="rcvtd"
                key="primaryBarcode"
                :props="props"
              >{{ props.row.primaryBarcode }}</q-td>
            </q-tr>
          </template>
        </q-table>
      </div>

      <div class="rcv-btn row">
        <div class="text-grey-8 q-gutter-xs q-pa-md">
          <q-btn
            dense
            class="btn-primary"
            @click="acceptBtn()"
            label="全部接收"
          />
        </div>
      </div>

      <q-dialog v-model="acceptFlag">
        <q-card style="width:200px">
          <q-card-section class="row items-center justify-center">
            <div class="text-h6">是否全部接收</div>
          </q-card-section>
          <div class="row justify-center">是否全部接收当前调拨单?</div>
          <div class="q-mb-md q-mt-md justify-around row">
            <q-btn
              class="btn-primary"
              @click="close()"
              label="否"
            />
            <q-btn
              class="btn-primary"
              @click="confirmSubmit()"
              label="是"
            />
          </div>
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
          >接收已完成</q-card-section>
          <q-card-section class="row justify-center">
            <span class="q-ml-sm">是否进行接收单打印？</span>
          </q-card-section>

          <q-card-actions align="center">
            <q-btn
              flat
              class="btn-negative"
              replace
              label="否"
              @click="$router.go(-2)"
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
    </q-list>
  </q-page>
</template>
<script>
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      columns: [
        { name: 'itemId', align: 'left', label: '商品编码', field: 'itemId', sortable: true },
        { name: 'description', align: 'left', label: '商品描述', field: 'description' },
        { name: 'requestQty', align: 'left', label: '申请数量', field: 'requestQty' },
        { name: 'acceptQty', align: 'left', label: '接受数量', field: 'acceptQty' },
        { name: 'shipQty', align: 'left', label: '发运数量', field: 'shipQty' },
        { name: 'ReceiveQty', align: 'left', label: '接收数量', field: 'ReceiveQty' },
        { name: 'primaryBarcode', align: 'left', label: '国际条码', field: 'primaryBarcode' }

      ],
      rcvedpagination: {
        page: 1,
        rowsPerPage: 0
      },
      acceptFlag: false,
      printFinish: false,
      shipedList: [],
      shipedData: {
        createdDate: '2016-11-19T09:59:42'
      },
      toLocationLabel: null,
      shipmentId: null,
      bolNo: null
    }
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_GO', 'BTN_PAGE', 'CHANGE_TITLE', 'RETURNFALSE']),
    GetTransferById (val) {
      this.$api.Transfer.GetTransferById(val).then(res => {
        console.log(res)
        if (res.data.code > 0) {
          this.shipedData = res.data.data
          if (res.data.data.externalNo === null) {
            this.bolNo = res.data.data.id
          } else {
            this.bolNo = res.data.data.externalNo
          }
          this.toLocationLabel = res.data.data.toLocation.id + '-' + res.data.data.toLocation.name
          this.shipedList = res.data.data.transferLines.map(val => {
            let json = {}
            json.itemId = val.itemId
            json.primaryBarcode = val.barcode
            json.description = val.item.description
            json.requestQty = val.requestQty
            json.acceptQty = val.transferQty
            json.shipQty = val.shipQty
            json.ReceiveQty = val.shipQty
            return json
          })
        }
      })
    },
    confirmSubmit () { // 店间调拨一键接收
      this.$api.Transfer.StoreTransferReceiveTotally(this.transferId).then(res => {
        console.log(res)
        if (res.data.code > 0) {
          this.acceptFlag = false
          this.GetShipmentReceivingByBolNo()
          this.printFinish = true
        } else {
          this.POP_MSG(res.data.msg)
        }
      })
    },
    // commodityInfo (val) {
    //   if (val.ReceiveQty > val.shipQty) {
    //     this.POP_MSG('接收数量不能大于发运数量')
    //   } else {
    //     console.log(val)
    //     this.$api.Transfer.StoreTransferItemReceive( // 店间调拨商品接收
    //       this.transferId,
    //       val.itemId,
    //       val.primaryBarcode,
    //       val.ReceiveQty
    //     ).then(res => {
    //       console.log(res)
    //       if (res.data.code > 0) {
    //         this.GetTransferById(this.transferId)
    //       } else {
    //         this.POP_MSG(res.data.msg)
    //       }
    //     })
    //   }
    // },
    print () {
      let p = JSON.parse(localStorage.getItem('printer'))
      let printdata = {
        id: this.shipmentId,
        printer: p.printer,
        token: localStorage.getItem('Authorization'),
        printlink: 'StsReceive',
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
        console.log(res)
        if (res.data.code === 0) {
          console.log(res.data.data)
          this.NotiSuccess('验货清单已打印')
        } else {
          console.log(res.data.data)
        }
        this.$router.go(-2)
      })
    },
    GetShipmentReceivingByBolNo () { // 通过Bol编号获取收货信息
      this.$api.Ship.GetShipmentReceivingByBolNo(this.bolNo).then(res => {
        console.log(res)
        if (res.data.code > 0) {
          this.shipmentId = res.data.data.id
        }
      })
    },
    acceptBtn () {
      this.acceptFlag = true
    },
    close () {
      this.acceptFlag = false
    }
  },
  created () {
    let locationList = JSON.parse(localStorage.getItem('locationList'))
    this.fromLocationId = locationList.id
    this.transferId = this.$route.query.transferId
    this.GetTransferById(this.transferId)
  }
}
</script>
