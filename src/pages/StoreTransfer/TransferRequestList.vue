<template>
  <q-page>
    <div>
      <div class="row items-center justify-start q-pa-sm">
        <div class="text-grey-8 q-gutter-xs q-py-md">
          <q-btn dense
                 @click="createTransferBills(null, null)"
                 class="btn-primary"
                 label="创建申请单" />
        </div>
      </div>
      <q-separator spaced />
      <div class="column items-center">
        <h6 v-if='temp'>无进行中的申请单</h6>
        <q-table v-if='!temp'
                 class=" self-center col"
                 title="店间调拨申请单"
                 :data="StoreTransferList"
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
                                :key="col.name">
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
        // { name: 'number', align: 'center', label: '申请品项数', field: 'number', sortable: true }
      ],
      StoreTransferList: [],
      rcvedpagination: {
        page: 1,
        rowsPerPage: 0
      },
      tempSelected: [],
      orderNo: null,
      transferId: null,
      toLocationId: null
    }
  },
  watch: {
    tempSelected (val) {
      if (this.tempSelected[0]) {
        console.log(this.tempSelected[0])
        this.transferId = this.tempSelected[0].transferId
        this.createTransferBills(this.transferId, this.tempSelected[0].createdDate)
      }
    }
  },
  created () {
    this.CHANGE_TITLE('调拨申请')
    let locationList = JSON.parse(localStorage.getItem('locationList'))
    this.toLocationId = locationList.id
    this.get_StoreTransferList()
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_GO', 'BTN_PAGE', 'CHANGE_TITLE', 'RETURNFALSE']),
    get_StoreTransferList () { // 获取店间调拨申请列表
      this.$api.Transfer.ListStoreTransferRequestInProc(this.toLocationId).then(res => {
        console.log(res)
        if (res.data.code === 1) {
          this.temp = false
          this.StoreTransferList = res.data.data.map(val => {
            let json = {}
            json.transferId = val.id
            json.createdDate = val.createdDate.slice(0, 10)
            json.toLocationId = val.toLocationId
            json.fromLocationId = val.fromLocationId
            return json
          })
        } else {
          this.temp = true
        }
      })
    },
    createTransferBills (id, createdDate) {
      this.$router.push({ path: '/StoreTransfer/TransferRequest', query: { transferId: id, createdDate: createdDate } })
    }
  }
}
</script>
