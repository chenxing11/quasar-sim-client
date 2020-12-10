
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
            label="配送单编号"
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

      <q-tabs
        v-model="tabs"
        v-if="!temp"
        dense
        class="text-primary"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab
          v-for="(i,index) in WarehouseSelected"
          :key="index"
          :name="i.title.fromLocationId"
          :label="i.title.name"
        />
      </q-tabs>
      <div class="column items-center">
        <h6 v-if='temp'>无进行中的配送单</h6>

        <q-tab-panels
          v-model="tabs"
          animated
        >
          <q-tab-panel
            v-for="(i,index) in WarehouseSelected"
            :key="index"
            class="q-pa-xs"
            :name="i.title.fromLocationId"
          >
            <q-table
              v-if='!temp'
              class=" self-center col"
              :data="i.bolList"
              :columns="columns"
              row-key="externalNo"
              style="width:100%"
              grid
              hide-header
              hide-bottom
              :pagination.sync="rcvedpagination"
              :rows-per-page-options=[0]
            >
              <template v-slot:item="props">
                <div
                  class="q-pa-xs text-primary"
                  style="width:100%"
                >
                  <q-card>
                    <q-card-section horizontal>
                      <q-card-section
                        class="col"
                        @click="get_order(props.row.bolNo)"
                      >
                        <div><span class="q-pa-xs">配送单编号</span><span class="q-pa-xs">{{ props.row.bolNo }}</span></div>
                        <div><span class="q-pa-xs">货源仓</span><span class="q-pa-xs">{{ props.row.name }}</span></div>
                      </q-card-section>

                      <!-- <q-card-actions
                        v-if="props.row.status ==='P'"
                        class="col-2"
                      >
                        <q-btn
                          flat
                          round
                          color="primary"
                          icon="close"
                          @click="deleteShipment(props.row.shipmentId)"
                        />
                      </q-card-actions> -->
                    </q-card-section>

                  </q-card>
                </div>
              </template>
            </q-table>
          </q-tab-panel>
        </q-tab-panels>
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
    </div>
  </q-page>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'PageStoreReceiving',
  data () {
    return {
      temp: true,
      orderNo: null, // 订单号输入
      dsdStatus: false,
      shipmentLinesTemp: [], // 暂存单
      tempSelected: [], // 暂存单选定行数据
      rcvedpagination: {
        page: 1,
        rowsPerPage: 0
      },
      columns: [
        {
          name: 'bolNo',
          required: true,
          label: '配送单编号',
          align: 'left',
          field: row => row.bolNo,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'name', align: 'center', label: '货源仓', field: 'name', sortable: true }
      ],
      toLocationId: null,
      bolNo: null,
      fromLocationName: null,
      externalNo: null,
      tabs: null,
      deleteFlag: false,
      shipmentId: null
    }
  },
  created () {
    this.CHANGE_TITLE('配送收货')
    this.get_Shipment(this.$store.state.location.id)
  },
  mounted () {
  },
  watch: {
  },
  computed: {
    WarehouseSelected: function () {
      return this._.map(this._.groupBy(this.shipmentLinesTemp, item => {
        return '{ "fromLocationId":' +
          item.fromLocationId +
          ', "name":"' +
          item.name +
          '" }'
      }), (value, key) => {
        return {
          title: JSON.parse(key),
          bolList: value
        }
      })
    }
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_GO', 'BTN_PAGE', 'CHANGE_TITLE', 'RETURNFALSE']),
    get_Shipment (id) { // 获取配送单列表
      this.$api.Ship.GetWTSShipmentList(id).then(res => {
        console.log(res)
        if (res.data.code === 0) {
          this.temp = true
        } else {
          this.temp = false
          this.shipmentLinesTemp = res.data.data.map(val => {
            let json = {}
            json.bolNo = val.bolNo
            json.shipmentId = val.id
            json.status = val.status
            json.fromLocationId = val.fromLocationId
            json.name = val.fromLocation.name
            json.toLocationId = val.toLocationId
            // json.status = val.status
            return json
          })
          this.tabs = this.shipmentLinesTemp.length === 0 ? null : this.shipmentLinesTemp[0].fromLocationId
          console.log(this.shipmentLinesTemp.findIndex(i => i === 0))
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
        console.log(res)
        this.deleteFlag = false
        if (res.data.code > 0) {
          this.get_Shipment(this.$store.state.location.id)
        } else {
          this.POP_MSG(res.data.msg)
        }
      })
    },
    get_order (val) {
      if (val === null || val === '') {
        this.POP_MSG('订单号不能为空')
      } else {
        this.$api.Ship.GetWTSShipmentByBolNo(val).then(res => { // 获取配送单详情
          console.log(res)
          if (res.data.code === 0) {
            this.POP_MSG(res.data.msg)
          } else {
            if (res.data.data.status === 'C') {
              this.POP_MSG('订单已关闭')
            } else if (res.data.data.toLocationId !== this.$store.state.location.id) {
              this.POP_MSG('该订单不是 ' + this.$store.state.location.id + ' 门店订单')
            } else {
              this.$router.push({ path: '/Rcv/WtsOrder', query: { bolNo: val } })
            }
          }
        })
      }
    }
  }
}
</script>
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
