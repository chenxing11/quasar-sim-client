
<template>
  <q-page>
    <div>
      <div class="flex flex-center q-pa-sm">
        <q-form
          @keydown.enter="get_order(orderNo)"
          @submit="RETURNFALSE()"
          class="orderinput"
        >
          <q-input
            autofocus
            outlined
            v-model.number="orderNo"
            label="订单号"
          >
            <template v-slot:append>
              <q-icon
                name="close"
                @click="orderNo = null"
                class="cursor-pointer"
              />
            </template>
          </q-input>
        </q-form>
      </div>
      <q-separator spaced />
      <div class="column items-center">
        <div
          v-if='temp'
          class=" full-width text-primary text-weight-bolder text-center"
        > 无进行中的收货单</div>
        <q-table
          v-if='!temp'
          class=" self-center col"
          title="订单收货暂存单"
          :data="shipmentLinesTemp"
          :columns="columns"
          row-key="externalNo"
          style="width:100%"
          grid
          hide-header
          hide-bottom
          :pagination.sync="rcvedpagination"
          :rows-per-page-options=[0]
        >
          <template v-slot:top>
            <div class=" full-width text-primary text-weight-bolder"> 收货暂存单</div>
          </template>
          <template v-slot:item="props">
            <div
              class="q-pa-xs text-primary"
              style="width:100%"
            >
              <q-card>
                <q-card-section horizontal>
                  <q-card-section
                    class="col"
                    @click="get_order(props.row.externalNo)"
                  >
                    <div><span class="q-pa-xs">订单号</span><span class="q-pa-xs">{{ props.row.externalNo }}</span></div>
                    <div><span class="q-pa-xs">供应商</span><span class="q-pa-xs">{{ props.row.supplierName }}</span></div>
                  </q-card-section>

                  <q-card-actions
                    v-if="props.row.shipmentStatus ==='P'"
                    class="col-2"
                  >
                    <q-btn
                      flat
                      round
                      color="primary"
                      icon="close"
                      @click="deleteShipment(props.row.shipmentId)"
                    />
                  </q-card-actions>
                </q-card-section>

              </q-card>
            </div>
          </template>
        </q-table>
      </div>
    </div>
    <q-dialog v-model="deleteFlag">
      <q-card style="width:200px">
        <q-card-section class="row items-center justify-center">
          <div class="text-h6">删除</div>
        </q-card-section>
        <div class="row justify-center">确定删除?</div>
        <div class="q-mb-md q-mt-md justify-around row">
          <q-btn class="btn-primary"
                  @click="closeBtn()"
                  label="否" />
          <q-btn class="btn-primary"
                  @click="confirmBtn()"
                  label="是" />
        </div>
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

#orderCostInput, #orderQtyInput {
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
      temp: true,
      orderNo: null, // 订单号输入
      orderId: null,
      dsdStatus: false,
      shipmentLinesTemp: [], // 暂存单
      tempSelected: [], // 暂存单选定行数据
      rcvedpagination: {
        page: 1,
        rowsPerPage: 0
      },
      columns: [
        {
          name: 'externalNo',
          required: true,
          label: '订单号',
          align: 'left',
          field: row => row.externalNo,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'supplierName', align: 'center', label: '供应商', field: 'supplierName', sortable: true }
        // { name: 'status', label: '状态', field: 'status', sortable: true }
      ], // 暂存表单
      deleteFlag: false,
      shipmentId: null
    }
  },
  created () {
    this.CHANGE_TITLE('订单收货')
    this.BTN_PAGE(true)
    this.get_rcved(this.$store.state.location.id)
  },
  mounted () {
  },
  watch: {
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_GO', 'BTN_PAGE', 'CHANGE_TITLE', 'RETURNFALSE']),
    get_rcved (id) {
      this.$api.Rcv.getPoListShipment(id).then(res => {
        if (res.data.code === 0) {
          this.temp = true
          console.log(res.data.msg)
        } else {
          this.temp = false
          this.shipmentLinesTemp = res.data.data.map(val => {
            let json = {}
            json.externalNo = val.order.externalNo
            json.supplierName = val.order.supplier.name
            json.status = val.order.status
            json.shipmentId = val.id
            json.shipmentStatus = val.status
            return json
          })
          console.log(' ↓暂存单')
          console.log(this.shipmentLinesTemp)
          console.log('↓订单')
          console.log(res.data.data)
        }
      })
    },
    deleteShipment (id) {
      this.deleteFlag = true
      this.shipmentId = id
    },
    closeBtn () {
      this.deleteFlag = false
      this.shipmentId = null
    },
    confirmBtn () { // 删除配送单列表
      this.$api.Ship.DeleteShipmentById(this.shipmentId).then(res => {
        this.deleteFlag = false
        console.log(res)
        if (res.data.code > 0) {
          this.get_rcved(this.$store.state.location.id)
        } else {
          this.POP_MSG(res.data.msg)
        }
      })
    },
    get_order (val) {
      if (val === null || val === '') {
        this.POP_MSG('订单号不能为空')
      } else {
        this.$api.Rcv.getOrder(val).then(res => { // 获取订单信息
          if (res.data.code === 0) {
            this.POP_MSG(res.data.msg)
          } else if (res.data.data.status === 'C') {
            this.POP_MSG('订单已关闭')
          } else if (res.data.data.supplier.dsdInd === 1) {
            this.POP_MSG('该订单为永续订单')
          } else {
            console.log('订单信息')
            console.log(res.data.data)
            if (res.data.data.orderLines[0].locationId !== this.$store.state.location.id) {
              this.POP_MSG('该订单不是 ' + this.$store.state.location.id + ' 门店订单')
            } else {
              this.orderId = res.data.data.id
              this.$router.push({ path: '/Rcv/OrdRcv', query: { orderNo: val, orderId: this.orderId, loc: this.$store.state.location.id } })
            }
          }
        })
      }
    }
  }
}
</script>
