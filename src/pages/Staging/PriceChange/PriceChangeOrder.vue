<template>
  <q-page class="orderlist">
    <q-list class="q-pa-xs">
      <q-card-section class="q-pa-xs row items-center">
        <span class="q-pa-sm text-weight-bold text-black">单据号</span>
        <span>{{posPriceChangeId}}</span>
      </q-card-section>
      <q-card-section class="q-pa-xs"
                      caption>
        <span class="q-pa-sm text-weight-bold text-black">创建时间</span>
        <span class="q-pa-sm text-grey-8">{{datenow}}</span>
      </q-card-section>
      <q-card-section class="q-pa-xs"
                      caption>
        <span class="q-pa-sm text-weight-bold text-black">已录入品项数</span>
        <span class="q-pa-sm text-grey-8">{{PriceChangeData.length}}</span>
      </q-card-section>
      <q-card-section class="q-pa-xs"
                      caption>
        <span class="q-pa-sm text-weight-bold text-black">单据状态</span>
        <span class="q-pa-sm text-grey-8">{{status}}</span>
      </q-card-section>

      <div class="q-pt-md q-pa-sm">
        <q-table table-style="max-height: 300px"
                 virtual-scroll
                 flat
                 :data="PriceChangeData"
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
                    key="barcode"
                    :props="props">{{ props.row.barcode }}</q-td>
              <q-td class="rcvtd"
                    key="originalSellingPrice"
                    :props="props">{{ props.row.originalSellingPrice }}</q-td>
              <q-td class="rcvtd"
                    key="posChangePrice"
                    :props="props">{{ props.row.posChangePrice }}</q-td>
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
      rcvedpagination: {
        page: 1,
        rowsPerPage: 0
      },
      columns: [
        { name: 'itemId', align: 'left', label: '商品编码', field: 'itemId', sortable: true },
        { name: 'description', align: 'left', label: '商品描述', field: 'description' },
        { name: 'barcode', align: 'left', label: '国际条码', field: 'barcode' },
        { name: 'originalSellingPrice', align: 'left', label: '原售价', field: 'originalSellingPrice' },
        { name: 'posChangePrice', align: 'left', label: '紧急变价', field: 'posChangePrice' }
      ],
      posPriceChangeId: null,
      PriceChangeData: [],
      datenow: null,
      status: null
    }
  },
  created () {
    this.CHANGE_TITLE('紧急变价查询')
    this.posPriceChangeId = this.$route.query.posPriceChangeId
    this.GetPosPriceChangeById(this.posPriceChangeId)
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_GO', 'BTN_PAGE', 'CHANGE_TITLE', 'RETURNFALSE']),
    GetPosPriceChangeById (id) {
      this.$api.PriceChange.GetPosPriceChangeById(id).then(res => { // 根据id获取变价单信息
        // console.log(res)
        if (res.data.code > 0) {
          this.datenow = res.data.data.createdDate.slice(0, 10)
          this.status = this.formatStatus(res.data.data.status)
          this.PriceChangeData = res.data.data.posPriceChangeLines.map(val => {
            let json = {}
            json.id = val.id
            json.itemId = val.itemId
            json.description = val.item.description
            json.barcode = val.barcode
            json.originalSellingPrice = val.originalSellingPrice
            json.posChangePrice = val.changePrice
            return json
          })
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
    }
  }
}
</script>
