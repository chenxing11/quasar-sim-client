<template>
  <q-page>
    <div>
      <div class="flex flex-center q-pa-sm">
        <q-form @submit="RETURNFALSE()" @keydown.enter="TransferBills(orderNo)"
                class="orderinput">
          <q-input autofocus
                   outlined
                   v-model.number="orderNo"
                   label="调拨单编号">
            <template v-slot:append>
              <q-icon name="close"
                      @click="orderNo = null"
                      class="cursor-pointer" />
            </template>
          </q-input>
        </q-form>
      </div>

      <div class="column items-center">
        <h6 v-if='temp'>无进行中的发运单</h6>
        <q-table v-if='!temp'
                 class=" self-center col"
                 title="店间调拨发运暂存单"
                 :data="AcceptedList"
                 :columns="columns"
                 row-key="externalNo"
                 selection="single"
                 style="width:100%"
                 :selected.sync="tempSelected"
                 grid
                 hide-header
                 hide-bottom
                 :pagination.sync="rcvedpagination"
                 :rows-per-page-options=[0]>
          <template v-slot:item="props">
            <div class="q-pa-xs"
                 style="width:100%"
                 :style="props.selected ? 'transform: scale(0.95);' : ''">
              <q-card @click="props.selected =!props.selected"
                      :class="props.selected ? 'bg-grey-2' : ''">
                <q-card-section class="q-pa-xs"
                                v-for="col in props.cols.filter(col => col.name !== 'desc')"
                                :key="col.name" v-show="col.value">
                  <span class="q-pa-xs">{{ col.label }}</span>
                  <span class="q-pa-xs">{{ col.value }}</span>
                </q-card-section>
              </q-card>
            </div>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
</template>
<script>
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      temp: false,
      columns: [
        { name: 'externalNo', align: 'center', label: '外部单据编号', field: 'externalNo', sortable: true },
        {
          name: 'transferId',
          required: true,
          label: '收货编号',
          align: 'left',
          field: row => row.transferId,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'createdDate', align: 'center', label: '申请时间', field: 'createdDate', sortable: true },
        { name: 'toLocationId', align: 'center', label: '申请门店', field: 'toLocationId', sortable: true }
      ],
      rcvedpagination: {
        page: 1,
        rowsPerPage: 0
      },
      AcceptedList: [],
      tempSelected: [],
      transferId: null,
      orderNo: null,
      fromLocationId: null
    }
  },
  watch: {
    tempSelected (val) {
      if (this.tempSelected[0]) {
        this.transferId = this.tempSelected[0].transferId
        this.TransferBills(this.transferId)
      }
    }
  },
  created () {
    this.CHANGE_TITLE('调拨发运')
    let locationList = JSON.parse(localStorage.getItem('locationList'))
    this.fromLocationId = locationList.id
    this.get_StoreTransferAccepted()
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_GO', 'BTN_PAGE', 'CHANGE_TITLE', 'RETURNFALSE']),
    get_StoreTransferAccepted () {
      this.$api.Transfer.ListStoreTransferAccepted(this.fromLocationId).then(res => { // 调出门店获取已接受的店间调拨
        console.log(res)
        if (res.data.code > 0) {
          this.temp = false
          this.AcceptedList = res.data.data.map(val => {
            let json = {}
            json.transferId = val.id
            json.createdDate = val.createdDate.slice(0, 10)
            json.toLocationId = val.toLocationId
            json.fromLocationId = val.fromLocationId
            json.externalNo = val.externalNo
            return json
          })
        } else {
          this.temp = true
        }
      })
    },
    TransferBills (val) {
      if (val === null || val === '') {
        this.POP_MSG('调拨发运单不能为空')
      } else {
        this.$router.push({ path: '/StoreTransfer/TransferShip', query: { transferId: val } })
      }
    }
  }
}
</script>
