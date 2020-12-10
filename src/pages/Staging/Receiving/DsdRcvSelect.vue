
<template>
  <q-page>
    <div>
      <div class="flex flex-center q-px-md">
        <q-form
          @keydown.enter="get_Newsupplier(supplierNo,null)"
          @submit="RETURNFALSE()"
          class="orderinput"
        >
          <q-input
            autofocus
            outlined
            v-model.number="supplierNo"
            label="供应商号"
          >
            <template v-slot:append>
              <q-icon
                name="close"
                @click="supplierNo = null"
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
          v-if="!temp"
          class="self-center col"
          title="订单收货暂存单"
          :data="shipmentLinesTemp"
          :columns="columns"
          row-key="externalNo"
          style="width:100%"
          grid
          hide-header
          hide-bottom
          :pagination.sync="rcvedpagination"
          :rows-per-page-options="[0]"
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
                    @click="get_supplier(props.row.supplierNo,props.row.shipmentId)"
                  >
                    <div><span class="q-pa-xs">收货号</span><span class="q-pa-xs">{{ props.row.shipmentId }}</span></div>
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
      temp: false,
      supplierNo: null, // 供应商号输入
      dsdStatus: false,
      shipmentLinesTemp: [], // 暂存单
      tempSelected: [], // 暂存单选定行数据
      orderLoc: '', // 订单门店
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
        {
          name: 'supplierName',
          align: 'center',
          label: '供应商',
          field: 'supplierName',
          sortable: true
        }
        // { name: 'status', label: '状态', field: 'status', sortable: true }
      ], // 暂存表单
      deleteFlag: false,
      shipmentId: null
    }
  },
  created () {
    this.CHANGE_TITLE('永续收货')
    this.get_rcved(this.$store.state.location.id)
  },
  mounted () { },
  watch: {
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_GO', 'BTN_PAGE', 'CHANGE_TITLE', 'RETURNFALSE']),
    get_rcved (id) {
      this.$api.Rcv.getDsdListShipment(id).then(res => {
        if (res.data.code === 0) {
          this.temp = true
          console.log(res.data.msg)
        } else {
          this.temp = false
          this.shipmentLinesTemp = res.data.data.map(val => {
            console.log(res.data.data)
            let json = {}
            json.shipmentId = val.id
            json.supplierNo = val.supplier.id
            json.supplierName = val.supplier.name
            json.shipmentStatus = val.status
            return json
          })
          console.log(' ↓ this.shipmentLinesTemp')
          console.log(this.shipmentLinesTemp)
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
    get_supplier (supplierNo, id) {
      this.$router.push({
        path: '/Rcv/DsdRcv',
        query: {
          supplierNo: supplierNo,
          shipmentId: id,
          loc: this.$store.state.location.id
        }
      })
    },
    get_Newsupplier (supplierNo, id) {
      if (supplierNo === '') {
        this.POP_MSG('供应商号不能为空')
      } else {
        this.shipmentId = id
        console.log(this.shipmentId)
        this.$api.Rcv.getSupplier(supplierNo).then(res => {
          // 获取供应商信息
          if (res.data.code === 0) {
            this.POP_MSG(res.data.msg)
          } else if (res.data.data.dsdInd === 0) {
            this.POP_MSG('该供应商非永续供应商')
          } else {
            console.log('供应商信息')
            console.log(res.data.data)
            console.log('用户门店')
            console.log(this.$store.state.location.id)
            this.supplier = res.data.data
            this.supplierType = res.data.data.dsdInd
            if (this.supplierType === 0) {
              this.dsdStatus = true
            }
            console.log('supplier')
            console.log(this.supplier)
            // console.log(this.$store.state.orderId)
            this.$router.push({
              path: '/Rcv/DsdRcv',
              query: {
                supplierNo: this.supplierNo,
                shipmentId: this.shipmentId,
                loc: this.$store.state.location.id
              }
            })
          }
        })
      }
    }
  }
}
</script>
