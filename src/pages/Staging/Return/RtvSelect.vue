
<template>
  <q-page>
    <div>
      <div class="flex flex-center q-px-md">
        <q-form
          @submit="RETURNFALSE()"
          @keydown.enter="get_rtw(externalNo)"
          class="orderinput"
        >
          <q-input
            autofocus
            outlined
            v-model.number="externalNo"
            label="退货单号"
          >
            <template v-slot:append>
              <q-icon
                name="close"
                @click="externalNo = null"
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
        > 无进行中的退货单</div>
        <q-table
          v-if='!temp'
          class=" self-center col"
          title="退货暂存单"
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
            <div class=" full-width text-primary text-weight-bolder"> 退货暂存单</div>
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
                    @click="get_rtw(props.row.externalNo)"
                  >
                    <div><span class="q-pa-xs">退货单号</span><span class="q-pa-xs">{{ props.row.externalNo }}</span></div>
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
      externalNo: null, // 号输入
      rtvId: null,
      loc: null,
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
          label: '退货单号',
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
    this.CHANGE_TITLE('退货至供应商')
    this.BTN_PAGE(true)
    this.get_rtwed(this.$store.state.location.id)
  },
  mounted () {
  },
  watch: {
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_GO', 'BTN_PAGE', 'CHANGE_TITLE', 'RETURNFALSE']),
    get_rtwed (id) {
      this.$api.Rtv.ListRtvByLoc(id).then(res => {
        if (res.data.code === 0) {
          this.temp = true
          console.log(res.data.msg)
        } else {
          this.temp = false
          console.log(res.data)
          this.shipmentLinesTemp = res.data.data.map(val => {
            let json = {}
            json.externalNo = val.return.externalNo
            json.supplierName = val.return.supplier.id + ' ' + val.return.supplier.name
            json.status = val.return.status
            json.shipmentStatus = val.status
            json.shipmentId = val.id
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
          this.get_rtwed(this.$store.state.location.id)
        } else {
          this.POP_MSG(res.data.msg)
        }
      })
    },
    get_rtw (val) {
      if (val === null || val === '') {
        this.POP_MSG('退货单号不能为空')
      } else {
        this.$api.Rtv.getRtv(val).then(res => { // 获取订单信息
          if (res.data.code === 0) {
            this.POP_MSG(res.data.msg)
          } else if (res.data.data.status !== 'A') {
            this.POP_MSG('退货单已关闭')
          } else {
            console.log('退货单信息')
            console.log(res.data.data)
            if (res.data.data.locationId !== this.$store.state.location.id) {
              this.POP_MSG('该退货单不是 ' + this.$store.state.location.id + ' 门店退货单')
            } else {
              this.rtvId = res.data.data.id
              this.loc = res.data.data.locationId
              console.log(this.loc)
              this.$router.push({ path: '/Return/Rtv', query: { externalNo: val, rtvId: this.rtvId, loc: this.loc } })
            }
          }
        })
      }
    }
  }
}
</script>
