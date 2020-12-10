<template>
  <q-page class="orderlist">
    <q-list class="q-pa-xs">
      <q-card-section class="q-pa-xs row items-center">
        <span class="q-pa-sm text-weight-bold text-black">库存调整单号</span>
        <span>{{inventoryAdjustId}}</span>
      </q-card-section>
      <q-card-section class="q-pa-xs"
                      caption>
        <span class="q-pa-sm text-weight-bold text-black">创建时间</span>
        <span class="q-pa-sm text-grey-8">{{datenow}}</span>
      </q-card-section>
      <q-card-section class="q-pa-xs"
                      caption>
        <span class="q-pa-sm text-weight-bold text-black">已录入品项数</span>
        <span class="q-pa-sm text-grey-8">{{inventoryAdjustData.length}}</span>
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
                 :data="inventoryAdjustData"
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
                    key="unitCost"
                    :props="props">{{ props.row.unitCost }}</q-td>
              <q-td class="rcvtd"
                    key="qtyBeforeAdjusted"
                    :props="props">{{ props.row.qtyBeforeAdjusted }}</q-td>
              <q-td class="rcvtd"
                    key="qtyAdjusted"
                    :props="props">{{ props.row.qtyAdjusted }}</q-td>
              <q-td class="rcvtd"
                    key="inventoryAdjustReasonId"
                    :props="props">{{ props.row.inventoryAdjustReasonId }}</q-td>
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
        { name: 'unitCost', align: 'left', label: '平均成本', field: 'unitCost' },
        { name: 'qtyBeforeAdjusted', align: 'left', label: '库存', field: 'qtyBeforeAdjusted' },
        { name: 'qtyAdjusted', align: 'left', label: '调整数量', field: 'qtyAdjusted' },
        { name: 'inventoryAdjustReasonId', align: 'left', label: '调整原因', field: 'inventoryAdjustReasonId' }
      ],
      inventoryAdjustId: null,
      inventoryAdjustData: [],
      datenow: null,
      status: null
    }
  },
  created () {
    this.inventoryAdjustId = this.$route.query.inventoryAdjustId
    this.GetInventoryAdjustById(this.inventoryAdjustId)
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_GO', 'BTN_PAGE', 'CHANGE_TITLE', 'RETURNFALSE']),
    GetInventoryAdjustById (id) { // 根据id获取库存调整单
      this.$api.Inventory.GetInventoryAdjustById(id).then(res => {
        console.log(res)
        if (res.data.code > 0) {
          this.datenow = res.data.data.createdDate.slice(0, 10)
          this.status = this.formatStatus(res.data.data.status)
          this.inventoryAdjustData = res.data.data.inventoryAdjustLines.map(val => {
            let json = {}
            json.id = val.id
            json.itemId = val.itemId
            json.description = val.item.description
            json.unitCost = val.unitCost
            json.qtyAdjusted = val.qtyAdjusted
            json.qtyBeforeAdjusted = val.qtyBeforeAdjusted
            json.inventoryAdjustReasonId = val.inventoryAdjustReason.description
            return json
          })
        }
      })
    },
    formatStatus (val) {
      var text
      switch (val) {
        case 'M':
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
