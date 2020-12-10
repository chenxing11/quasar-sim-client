<template>
  <q-page class="orderlist">
    <!-- <q-list>
    <q-item class="q-pa-xs row">
      <q-item-section  class="text-weight-bold col-3 q-pl-md">盘点区域</q-item-section>
      <q-select class="col-6" outlined dense v-model="area" :options="areaOptions" />
    </q-item>
    <q-item class="q-pa-xs">
      <q-item-section  class="text-weight-bold col-3 q-pl-md">品类组</q-item-section>
      <q-select class="col-6" outlined dense v-model="category" :options="categoryOptions" />
    </q-item>
  </q-list> -->
    <div class="q-pa-md">
      <q-table
        :title="title"
        flat
        :rows-per-page-options=[0]
        hide-bottom
        :data="data"
        :columns="columns">
        <template v-slot:body="props">
          <q-tr :class="props.row.process > 0 ? 'partRcv' : 'allRcv'">
            <q-td key="areaName" :props="props">{{ props.row.areaName }}</q-td>
            <q-td key="tot" :props="props">{{ props.row.tot }}</q-td>
            <q-td key="process" :props="props">{{ props.row.process }}</q-td>
            <q-td key="finish" :props="props" >{{ props.row.finish }}</q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <div class="rcv-btn">
      <div class="text-grey-8 q-gutter-xs q-pa-md">
        <q-btn class="btn-primary" @click="allStocktake()" label="查看明细"/>
      </div>
    </div>
  </q-page>
</template>
<script>
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      title: '门店盘点中',
      columns: [
        { name: 'areaName', align: 'left', label: '区域', field: 'areaName', sortable: true },
        { name: 'tot', align: 'left', label: '任务总量', field: 'tot' },
        { name: 'process', align: 'left', label: '未盘任务', field: 'process' },
        { name: 'finish', align: 'left', label: '已盘任务', field: 'finish' }
      ],
      data: [],
      number: 0
    }
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_GO', 'BTN_PAGE', 'CHANGE_TITLE']),
    allStocktake () {
      this.$router.push({ path: '/Stocktake/NotFinishStocktake' })
    },
    getStocktakeLayoutLineCount () { // 获取布局明细列表
      this.$api.Stocktake.getStocktakeLayoutLineCount(
        this.StocktakeLocationId,
        null,
        null
      ).then(res => {
        console.log(res)
        this.data = res.data.data.map(val => {
          let json = {}
          json.areaName = val.areaDescription
          json.areaId = val.areaId
          json.tot = val.total
          json.finish = val.finished
          if (val.processing > 0) {
            this.number++
          }
          json.process = val.processing
          return json
        })
        if (this.number > 0) {
          this.title = '门店盘点中'
        } else {
          this.title = '盘点已完成'
        }
      })
    }
  },
  created () {
    this.CHANGE_TITLE('盘点进度查询')
    this.StocktakeLocationId = localStorage.getItem('StocktakeLocationId')
    this.getStocktakeLayoutLineCount()
  }
}
</script>
