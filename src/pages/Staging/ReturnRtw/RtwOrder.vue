<template>
  <q-page class="orderlist">
    <q-list class="q-pa-xs">
      <q-card-section class="q-pa-xs">
        <span class="q-pa-sm text-weight-bold text-black">退单编号</span>
        <span>{{rtwId}}</span>
      </q-card-section>

      <q-card-section class="q-pa-xs"
                      caption>
        <span class="q-pa-sm text-weight-bold text-black">创建时间</span>
        <span class="q-pa-sm text-grey-8">{{datenow}}</span>
      </q-card-section>
      <q-card-section class="q-pa-xs"
                      caption>
        <span class="q-pa-sm text-weight-bold text-black">单据状态</span>
        <span class="q-pa-sm text-grey-8">{{status}}</span>
      </q-card-section>

      <div class="q-pt-md q-pa-sm">
        <q-table virtual-scroll
                 flat
                 :data="rtwData"
                 :pagination.sync="rcvedpagination"
                 :rows-per-page-options=[0]
                 :columns="columns">
          <template v-slot:body="props">
            <q-tr class="allRcv">
              <q-td class="rcvtd"
                    key="itemId"
                    :props="props">{{ props.row.itemId }}</q-td>
              <q-td class="rcvtd"
                    key="description"
                    :props="props">{{ props.row.description }}</q-td>
              <q-td class="rcvtd"
                    key="supplier"
                    :props="props">{{ props.row.supplier }}</q-td>
              <q-td class="rcvtd"
                    key="quantity"
                    :props="props">{{ props.row.quantity }}</q-td>
              <q-td class="rcvtd"
                    key="unitCost"
                    :props="props">{{ props.row.unitCost }}</q-td>
              <q-td class="rcvtd"
                    key="returnReason"
                    :props="props">{{ props.row.returnReason }}</q-td>
            </q-tr>
          </template>
        </q-table>
      </div>

    </q-list>
  </q-page>
</template>
<script>
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      datenow: null,
      rtwId: null,
      rcvedpagination: {
        page: 1,
        rowsPerPage: 0
      },
      rtwData: [],
      columns: [
        { name: 'itemId', align: 'left', label: '商品编码', field: 'itemId', sortable: true },
        { name: 'description', align: 'left', label: '商品描述', field: 'description' },
        { name: 'supplier', align: 'left', label: '供应商', field: 'supplier' },
        { name: 'quantity', align: 'left', label: '申请数量', field: 'quantity' },
        { name: 'unitCost', align: 'left', label: '返仓成本', field: 'unitCost' },
        { name: 'returnReason', align: 'left', label: '返仓原因', field: 'returnReason' }
      ],
      status: null
    }
  },
  created () {
    this.CHANGE_TITLE('退单详情')
    this.rtwId = this.$route.query.rtwId
    this.GetReturnToWhById(this.rtwId)
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_GO', 'BTN_PAGE', 'CHANGE_TITLE', 'RETURNFALSE']),
    GetReturnToWhById (id) {
      this.$api.Rtw.GetReturnToWhById(id).then(res => {
        console.log(res)
        if (res.data.code > 0) {
          this.datenow = res.data.data.createdDate.slice(0, 10)
          this.status = this.formatStatus(res.data.data.status)
          this.rtwData = res.data.data.returnToWhLines.map(val => {
            let json = {}
            json.id = val.id
            json.itemId = val.item.id
            json.description = val.item.description
            json.supplier = val.supplier.name
            json.quantity = val.quantity
            json.unitCost = val.unitCost
            json.returnReason = this.formatReason(val.reason)
            return json
          })
        } else {
          this.POP_MSG(res.data.msg)
        }
      })
    },
    formatStatus (val) {
      var text
      switch (val) {
        case 'A':
          text = '已审批'
          break
        case 'S':
          text = '已提交'
          break
        case 'W':
          text = '工作表'
          break
      }
      return text
    },
    formatReason (val) {
      var text
      switch (val) {
        case 'S':
          text = '门店原因'
          break
        case 'V':
          text = '供应商原因'
          break
        case 'WH':
          text = '仓库原因'
          break
      }
      return text
    }
  }
}
</script>
