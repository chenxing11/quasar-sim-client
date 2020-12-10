<template>
<q-page class="orderlist">
<br>
  <q-list>
    <q-item class="q-pa-xs row">
      <q-item-section  class="text-weight-bold col-3 q-pl-md">盘点区域</q-item-section>
     <q-input outlined dense v-model="obj.areaName" :disable="disable" class="col-6 items-center" style="line-height:40px;"></q-input>
    </q-item>
  </q-list>
  <div class="q-pa-md">
      <q-table
        flat
        :data="data"
       :pagination.sync="rcvedpagination"
      :rows-per-page-options=[0]
        :columns="columns">
      </q-table>
    </div>
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
        { name: 'area', align: 'left', label: '区域', field: 'area', sortable: true },
        { name: 'groupId', align: 'left', label: '品类组', field: 'groupId', sortable: true },
        { name: 'zone', align: 'left', label: '通道号', field: 'zone' },
        { name: 'bay', align: 'left', label: '货架号', field: 'bay' }
      ],
      disable: true,
      data: [],
      obj: {},
      Area: null,
      StocktakeLocationId: null,
      status: 'IP'
    }
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_GO', 'BTN_PAGE', 'CHANGE_TITLE']),
    getStocktakeLayoutLines () { // 获取布局明细列表
      this.$api.Stocktake.getStocktakeLayoutLines(
        this.StocktakeLocationId,
        this.status,
        this.obj.areaId,
        null
      ).then(res => {
        // console.log(res)
        this.data = res.data.data.map(val => {
          let json = {}
          json.area = this.obj.areaName
          json.groupId = val.groupId
          json.zone = val.zone
          json.bay = val.bay
          return json
        })
      })
    }
  },
  created () {
    this.CHANGE_TITLE('盘点进度查询')
    this.obj = JSON.parse(this.$route.query.data)
    this.StocktakeLocationId = localStorage.getItem('StocktakeLocationId')
    this.getStocktakeLayoutLines()
    // console.log(this.obj)
  }
}
</script>
