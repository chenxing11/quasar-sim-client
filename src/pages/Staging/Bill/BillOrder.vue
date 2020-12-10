<template>
  <q-page class="orderlist">
    <q-list class="q-pa-xs">
      <q-card-section class="q-pa-xs">
        <span class="q-pa-sm text-weight-bold text-black">出清编号</span>
        <span>{{billId}}</span>
      </q-card-section>
      <q-card-section class="q-pa-xs"
                      caption>
        <span class="q-pa-sm text-weight-bold text-black">创建时间</span>
        <span class="q-pa-sm text-grey-8">{{datenow}}</span>
      </q-card-section>
      <q-card-section class="q-pa-xs"
                      caption>
        <span class="q-pa-sm text-weight-bold text-black">状态</span>
        <span class="q-pa-sm text-grey-8">{{datenow}}</span>
      </q-card-section>

      <div class="q-pt-md q-pa-sm">
        <q-table table-style="max-height: 300px"
                 virtual-scroll
                 flat
                 :data="billData"
                 :pagination.sync="rcvedpagination"
                 :rows-per-page-options=[0]
                 :columns="columns">
          <template v-slot:body="props">
            <q-tr class="allRcv">
              <q-td class="rcvtd"
                    key="itemId"
                    :props="props">{{ props.row.itemId }}</q-td>
              <q-td class="rcvtd"
                    key="barCode"
                    :props="props">{{ props.row.barCode }}</q-td>
              <q-td class="rcvtd"
                    key="description"
                    :props="props">{{ props.row.description }}</q-td>
              <q-td class="rcvtd"
                    key="normalPrice"
                    :props="props">{{ props.row.normalPrice }}</q-td>
              <q-td class="rcvtd"
                    key="outPrice"
                    :props="props">{{ props.row.outPrice }}</q-td>
              <q-td class="rcvtd"
                    key="outQty"
                    :props="props">{{ props.row.outQty }}</q-td>
              <q-td class="rcvtd"
                    key="outRate"
                    :props="props">{{ props.row.outRate }}</q-td>
              <q-td class="rcvtd"
                    key="outCause"
                    :props="props">{{ props.row.outCause }}</q-td>
              <q-td class="rcvtd"
                    @click.native="DeleteBtn(props.row)">
                <q-icon style="fong-size:20px;"
                        name="close"
                        class="cursor-pointer" />
              </q-td>
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
      billId: null,
      datenow: null,
      billData: [],
      rcvedpagination: {
        page: 1,
        rowsPerPage: 0
      },
      columns: [
        { name: 'itemId', align: 'left', label: '商品编码', field: 'itemId', sortable: true },
        { name: 'barCode', align: 'left', label: '出清条码', field: 'barCode' },
        { name: 'description', align: 'left', label: '出清描述', field: 'description' },
        { name: 'normalPrice', align: 'left', label: '正常售价', field: 'normalPrice' },
        { name: 'outPrice', align: 'left', label: '出清售价', field: 'outPrice' },
        { name: 'outQty', align: 'left', label: '出清数量', field: 'outQty' },
        { name: 'outRate', align: 'left', label: '出清毛利率', field: 'outRate' },
        { name: 'outCause', align: 'left', label: '出清原因', field: 'outCause' }
      ]
    }
  },
  created () {
    this.billtId = this.$route.query.billtId
    this.GetInventoryAdjustById(this.billtId)
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_GO', 'BTN_PAGE', 'CHANGE_TITLE', 'RETURNFALSE']),
    GetInventoryAdjustById () {

    }
  }
}
</script>
