<template>
  <q-page class="orderlist">
    <div class="q-pa-md">
      <q-table
        :title="title"
        flat
        :pagination.sync="rcvedpagination"
        :rows-per-page-options=[0]
        :data="data"
        :columns="columns">
        <template v-slot:body="props">
          <q-tr :class="props.row.process > 0 ? 'partRcv' : 'allRcv'">
            <q-td key="areaName" :props="props">{{ props.row.areaName }}</q-td>
            <q-td key="tot" :props="props">{{ props.row.tot }}</q-td>
            <q-td key="process" :props="props" @click="NotFinish(props.row)"><a href="javascript:void(0)" :class="props.row.process > 0 ? 'partRcv' : 'allRcv'">{{ props.row.process }}</a></q-td>
            <q-td key="finish" :props="props" >{{ props.row.finish }}</q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <div class="rcv-btn">
      <div class="text-grey-8 q-gutter-xs q-pa-md">
        <q-btn class="btn-primary" :disable="!endStocktakeStatus"  @click="endStocktake()" label="结束盘点"/>
      </div>
    </div>
    <q-dialog v-model="endFlag">
    <q-card style="width:220px">
      <q-card-section class="row items-center">
        <div class="text-h6">结束盘点</div>
      </q-card-section>

      <q-card-section>
        <div>是否结束盘点编号为{{externalNo}}的盘点?</div>
      </q-card-section>
      <div class="q-mb-md q-mt-md justify-around row">
        <q-btn class="btn-primary" @click="cancelEnd()" label="否"/>
        <q-btn class="btn-primary" @click="confirmEnd()" label="是"/>
      </div>
    </q-card>
  </q-dialog>
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
      endStocktakeStatus: true,
      endFlag: false,
      title: '门店盘点中',
      columns: [
        { name: 'areaName', align: 'left', label: '区域', field: 'areaName', sortable: true },
        { name: 'tot', align: 'left', label: '任务总量', field: 'tot' },
        { name: 'process', align: 'left', label: '未盘任务', field: 'process' },
        { name: 'finish', align: 'left', label: '已盘任务', field: 'finish' }
      ],
      data: [],
      StocktakeId: null,
      StocktakeLocationId: null,
      number: 0,
      areaId: null,
      groupId: null,
      externalNo: null
    }
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_GO', 'BTN_PAGE', 'CHANGE_TITLE']),
    NotFinish (props) {
      this.$router.push({ path: '/Stocktake/Shopowner', query: { data: JSON.stringify(props) } })
    },
    getStocktakeLayoutLineCount () { // 获取布局明细列表
      this.$api.Stocktake.getStocktakeLayoutLineCount(
        this.StocktakeLocationId,
        this.areaId,
        this.groupId
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
        // console.log(this.number)
        if (this.number > 0) {
          this.title = '门店盘点中'
          // console.log(this.endStocktakeStatus)
          // this.endStocktakeStatus = false
        } else {
          console.log(this.endStocktakeStatus)
          let params = {
            externalNo: this.externalNo
          }
          this.$api.Stocktake.getStocktakeList(params).then(res => {
            console.log(res)
            console.log(res.data.data[0].status)
            if (res.data.data[0].status === 'C') {
              this.title = '盘点已结盘'
              this.endStocktakeStatus = false
            } else {
              this.title = '盘点已完成'
              this.endStocktakeStatus = true
            }
          })
        }
        console.log(this.number)
      })
    },
    endStocktake () { // 结束盘点
      console.log(this.number)
      if (this.number > 0) {
        this.POP_MSG('存在未完成盘点的货架')
      } else {
        this.endFlag = true
      }
    },
    cancelEnd () {
      this.endFlag = false
    },
    confirmEnd () {
      this.$api.Stocktake.closeStocktake(this.StocktakeId).then(res => { // 结束盘点
        if (res.data.code === 1) {
          console.log(res)
          this.NotiSuccess(res.data.msg)
          this.$router.back(-1)
        } else {
          this.POP_MSG(res.data.msg)
        }
      })
    }
  },
  created () {
    this.CHANGE_TITLE('盘点进度查询')
    this.StocktakeId = localStorage.getItem('StocktakeId')
    this.externalNo = localStorage.getItem('externalNo')
    this.StocktakeLocationId = localStorage.getItem('StocktakeLocationId')
    this.getStocktakeLayoutLineCount()
  }
}
</script>
