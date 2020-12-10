<template>
  <q-page  class="">
    <div class="q-pa-md">
      <q-btn class="btn-back col-2 text-primary" flat
             icon="arrow_back_ios"
             style="font-size:1rem;"
             to='/WebStocktake/Manage' />
    <div class="q-pa-md">
    <div>
      <q-tabs no-shadow
                  v-model="panel"
                  class="text-black"
                  active-color="primary"
                  active-bg-color="white"
                  indicator-color="primary"
                  align="left"
                  dense
                  no-caps>
            <q-tab name="CloseStocktake"
                   label="盘点进度" />
          </q-tabs>
      <q-tab-panels  v-model="panel" animated class="rounded-borders">
        <q-tab-panel name="CloseStocktake">
          <q-table
      flat
      :data="stocktakeCount"
      :columns="Countcolumns"
      table-style="max-height: 400px"
      virtual-scroll
      :pagination.sync="pagination"
      :rows-per-page-options="[0]"
      hide-bottom
      row-key="index"
    > //S123
    <template v-slot:header="props">
        <q-tr :props="props">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            class="text-black" style="font-size:1rem;font-weight:bold;"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td class="" key="id" :props="props">{{ props.row.id }}</q-td>
          <q-td class="" key="StocktakeStore" :props="props">{{ props.row.StocktakeStore }}</q-td>
          <q-td class="" key="externalNo" :props="props">{{ props.row.externalNo }}</q-td>
          <q-td class="" key="areaDescription" :props="props">{{ props.row.areaDescription }}</q-td>
          <q-td class="" key="status" :props="props">{{ format(props.row.num) }}</q-td>
        </q-tr>
      </template>
    </q-table>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
            <div class="row justify-end"  >
        <div class="text-grey-8 q-gutter-xs q-pa-md">
          <q-btn  :disable="sum" class="btn-primary" label="结束盘点" @click="stocktakeFinish = true"/>
        </div>
      </div>
      <q-dialog v-model="stocktakeFinish" persistent >
            <q-card class="poptip col-5 q-px-lg">
              <q-card-section align="center" class="text-h6">结束盘点</q-card-section>
              <q-card-section class="row justify-center">
                <span class="q-ml-sm">是否结束当前盘点？</span>
              </q-card-section>

              <q-card-actions align="center">
                <q-btn flat label="否" class="btn-negative"  v-close-popup/>
                <q-btn flat label="是" @click="close(StocktakeId)" class="btn-primary"  v-close-popup/>
              </q-card-actions>
            </q-card>
          </q-dialog>
    </div>
  </q-page>
</template>

<style lang="stylus" >
</style>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'PageStoreRcvOrder',
  data () {
    return {
      StocktakeLocationId: null,
      StocktakeId: null,
      StocktakeStore: null,
      stocktakeCount: [],
      stocktakeFinish: false,
      sum: true,
      panel: 'CloseStocktake',
      pagination: {
        page: 1,
        rowsPerPage: 0
      },
      Countcolumns: [
        {
          name: 'id',
          required: true,
          label: '序号',
          field: row => row.index,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'StocktakeStore', label: '门店编号', field: 'StocktakeStore' },
        { name: 'externalNo', label: '盘点编号', field: 'externalNo' },
        { name: 'areaDescription', label: '位置', field: 'areaDescription' },
        { name: 'status', label: '盘点进度', field: 'status' }
      ],
      externalNo: null
    }
  },
  created () {
    this.externalNo = this.$route.query.externalNo
    this.StocktakeId = this.$route.query.StocktakeId
    this.StocktakeStore = this.$route.query.StocktakeStore
    this.StocktakeLocationId = this.$route.query.StocktakeLocationId
    this.getStocktakeCount(this.StocktakeLocationId)
    console.log(this.$refs)
  },
  mounted () {
  },
  computed: {
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_PAGE']),
    getStocktakeCount (id) {
      this.$api.Stocktake.getStocktakeLayoutLineCount(id).then(res => {
        // 获取信息
        console.log(res.data.data)
        this.sum = Boolean((res.data.data.map(item => item.processing)).reduce((x, y) => x + y, 0))
        console.log(this.sum)
        this.stocktakeCount = res.data.data.map((val, index) => {
          let json = {}
          json.id = index + 1
          json.StocktakeStore = this.StocktakeStore
          json.StocktakeId = this.StocktakeId
          json.areaId = val.areaId
          json.areaDescription = val.areaDescription
          json.num = val.total - val.finished
          return json
        })
        console.log(this.stocktakeCount)
      })
    },
    close (id) {
      this.$api.Stocktake.closeStocktake(id).then(res => {
        console.log(res)
        if (res.data.code !== 1) {
          this.POP_MSG(res.data.msg)
        } else {
          this.NotiSuccess(res.data.msg)
          this.$router.go(-1)
        }
      })
    },
    format (status) {
      var TypeText
      switch (status) {
        case 0 :
          TypeText = '已完成'
          break
        default:
          TypeText = '进行中'
      }
      return TypeText
    }
  }
}
</script>
