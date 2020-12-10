
<template>
  <q-page>
    <div class="flex flex-center q-px-md">
      <q-form @keydown.enter="checkshipment(shipmentId)"
              @submit="RETURNFALSE()"
              class="orderinput">
        <q-input autofocus
                 outlined
                 v-model.number="shipmentId"
                 label="收货号">
          <template v-slot:append>
            <q-icon name="close"
                    @click="shipmentId = null, checkRcved = false, checkItem = false, rcvUnitsAdjId = null"
                    class="cursor-pointer" />
          </template>
        </q-input>
      </q-form>
    </div>
    <div class="column items-center">
      <div v-if='temp'
           class=" full-width text-primary text-weight-bolder"> 今日未收货</div>
      <q-table v-if='!temp'
               class=" self-center col"
               title="今日收货清单"
               :data="shipmentLinesTemp"
               :columns="columns"
               row-key="id"
               style="width:100%"
               grid
               hide-bottom
               hide-header
               :pagination.sync="rcvedpagination"
               :rows-per-page-options=[0]>
        <template v-slot:top>
          <div class=" full-width text-primary text-weight-bolder"> 今日收货清单</div>
        </template>
        <template v-slot:item="props">
          <div class="q-pa-xs text-primary"
               style="width:100%">
            <q-card>
              <q-card-section horizontal>
                <q-card-section class="col"
                                @click="getshipment(props.row.shipmentId)">
                  <div><span class="q-pa-xs">收货号</span><span class="q-pa-xs">{{ props.row.shipmentId }}</span></div>
                  <div><span class="q-pa-xs">供应商</span><span class="q-pa-xs">{{ props.row.supplierName}}</span></div>
                </q-card-section>

              </q-card-section>

            </q-card>
          </div>
        </template>
      </q-table>
    </div>
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
      temp: false,
      shipmentId: null, // 收货号输入
      shipmentLinesTemp: [], // 暂存单
      tempSelected: [], // 暂存单选定行数据
      orders: [],
      rcvedpagination: {
        page: 1,
        rowsPerPage: 0
      },
      columns: [
        {
          name: 'shipmentId',
          required: true,
          label: '收货号',
          align: 'left',
          field: row => row.shipmentId,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'supplierName', align: 'center', label: '供应商', field: row => row.supplier.name, sortable: true }
        // { name: 'status', label: '状态', field: 'status', sortable: true }
      ] // 暂存表单
    }
  },
  created () {
    this.CHANGE_TITLE('收货数量调整')
    this.BTN_PAGE(true)
    this.get_todayComplete(this.$store.state.location.id)
  },
  mounted () {
  },
  watch: {
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_GO', 'BTN_PAGE', 'CHANGE_TITLE', 'RETURNFALSE']),
    get_todayComplete (id) {
      this.$api.Rcv.listShipmented(id).then(res => {
        if (res.data.code === 0) {
          this.temp = true
          console.log(res.data.msg)
        } else {
          console.log(res)
          this.temp = false
          this.shipmentLinesTemp = res.data.data.filter(v =>
            v.type !== 'WTS' && v.type !== 'FRSH'
          ).map(val => {
            let json = {}
            json.shipmentId = val.id
            json.supplier = val.supplier !== null ? val.supplier : null
            json.supplierName = val.supplier !== null ? val.supplier.name : null
            json.status = val.status
            return json
          })
          console.log(this.shipmentLinesTemp)
          console.log('↓订单')
          console.log(this.shipmentLinesTemp)
          this.orders = this.shipmentLinesTemp.map(function (item) { return item['shipmentId'] }) // 获取item[]用于检索
          console.log('当日订单')
          console.log(this.orders)
        }
      })
    },
    checkshipment (id) {
      if (this.orders.includes(id) === false) {
        this.POP_MSG('该订单非当日收货订单！')
      } else {
        this.getshipment(id)
      }
    },
    getshipment (id) {
      this.$api.Rcv.getShipmentById(id).then(res => {
        if (res.data.code === 0) {
          this.POP_MSG(res.data.msg)
        } else {
          console.log('收货信息')
          console.log(res.data)
          this.shipment = res.data.data
          console.log(this.shipment)
          this.$router.push({ path: '/Rcv/RcvAdjust', query: { shipmentId: id, loc: this.$store.state.location.id } })
        }
      })
    }
  }
}
</script>
