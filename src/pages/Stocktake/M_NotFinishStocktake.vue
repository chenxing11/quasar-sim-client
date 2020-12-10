<template>
  <q-page class="orderlist">
    <br>
    <q-list>
      <!-- <q-item class="q-pa-xs row">
      <q-item-section  class="text-weight-bold col-3 q-pl-md">盘点区域</q-item-section>
      <q-select class="col-6" outlined dense v-model="area" :options="areaOptions" />
    </q-item> -->
      <!-- <q-item class="q-pa-xs">
      <q-item-section  class="text-weight-bold col-3 q-pl-md">品类组</q-item-section>
      <q-select class="col-6" outlined dense v-model="category" :options="categoryOptions" />
    </q-item> -->
      <q-item class="q-pa-xs items-center">
        <q-item-section class="text-weight-bold text-center col-3">盘点区域</q-item-section>
        <q-btn-dropdown
          :label="AreaLabel"
          style="width:40%"
        >
          <q-list>
            <q-item
              v-for="(item,index) in AreaList"
              :key="index"
              v-model="AreaLabel"
              @click="AreaLabel = item.description, AreaChangeloc(item)"
              clickable
              v-close-popup
            >
              <q-item-section>
                <q-item-label>{{item.description}}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-item>
      <q-item class="q-pa-xs items-center">
        <q-item-section class="text-weight-bold text-center col-3">品类组</q-item-section>
        <q-btn-dropdown
          :label="label"
          style="width:40%"
        >
          <q-list>
            <q-item
              v-for="(item,index) in Purchase"
              :key="index"
              v-model="label"
              @click="label = item.name, changeloc(item)"
              clickable
              v-close-popup
            >
              <q-item-section>
                <q-item-label>{{item.name}}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-item>
    </q-list>
    <div class="q-pa-md">
      <q-table
        flat
        :data="data"
        :pagination.sync="rcvedpagination"
        :rows-per-page-options=[0]
        :columns="columns"
      >
      </q-table>
    </div>
  </q-page>
</template>
<script>
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      categoryOptions: ['F1', 'F2'],
      category: 'F1',
      area: '全部',
      areaOptions: ['全部', '库区', '销售区'],
      rcvedpagination: {
        page: 1,
        rowsPerPage: 0
      },
      columns: [
        { name: 'area', align: 'left', label: '区域', field: 'area', sortable: true },
        { name: 'groupId', align: 'left', label: '品类组', field: 'groupId', sortable: true },
        { name: 'zone', align: 'left', label: '通道号', field: 'zone' },
        { name: 'bay', align: 'left', label: '货架号', field: 'bay' },
        { name: 'status', align: 'left', label: '状态', field: 'status' },
        { name: 'recordedByRealName', align: 'left', label: '录入员', field: 'recordedByRealName' }
      ],
      label: null,
      AreaLabel: null,
      Purchase: [],
      AreaList: [],
      AreaId: null,
      data: [],
      obj: {},
      groupId: null,
      status: 'IP'
    }
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_GO', 'BTN_PAGE', 'CHANGE_TITLE']),
    getStocktakeLayoutLines () { // 获取布局明细列表
      this.$api.Stocktake.getStocktakeLayoutLines(
        this.StocktakeLocationId,
        this.status,
        this.AreaId,
        this.groupId
      ).then(res => {
        console.log(res)
        if (Number(res.data.code) === 1) {
          this.data = res.data.data.map(val => {
            let json = {}
            json.area = val.area.description
            json.groupId = val.groupId
            json.zone = val.zone
            json.bay = val.bay
            json.statusId = val.status
            json.status = this.formatType(val.status)
            json.recordedByRealName = val.recordedByRealName
            return json
          })
        } else {
          this.data = []
          // this.POP_MSG(res.data.msg)
        }
      })
    },
    getStocktakeAreaList () { // 获取库区
      this.$api.Stocktake.getStocktakeAreaList(this.StocktakeLocationId).then(res => {
        console.log(res)
        let arr = [{ id: 0, description: '全部' }]
        this.AreaList = arr.concat(res.data.data)
        this.AreaLabel = this.AreaList[0].description
        this.AreaId = this.AreaList[0].id
        this.getStocktakeGroupList()
      })
    },
    getStocktakeGroupList () { // 获取品类组
      this.$api.Stocktake.getStocktakeGroupList(this.StocktakeLocationId, this.AreaId).then(res => {
        console.log(res)
        if (Number(res.data.code) === 1) {
          let arr = [{ id: 0, name: '全部' }]
          this.Purchase = arr.concat(res.data.data)
          this.label = this.Purchase[0].name
          this.groupId = this.Purchase[0].id
          this.getStocktakeLayoutLines()
        } else {
          let arr = [{ id: 0, name: '全部' }]
          this.Purchase = arr
          this.label = arr[0].name
          this.groupId = arr[0].id
          this.getStocktakeLayoutLines()
        }
      })
      // if (this.AreaId === 0) {
      //   let arr = [ { id: 0, name: '全部' } ]
      //   this.label = arr[0].name
      //   this.groupId = arr[0].id
      //   this.getStocktakeLayoutLines()
      // } else {
      //   this.$api.Stocktake.getStocktakeGroupList(this.StocktakeLocationId, this.AreaId).then(res => {
      //     console.log(res)
      //     let arr = [ { id: 0, name: '全部' } ]
      //     this.Purchase = arr.concat(res.data.data)
      //     this.label = this.Purchase[0].name
      //     this.groupId = this.Purchase[0].id
      //     this.getStocktakeLayoutLines()
      //   })
      // }
    },
    AreaChangeloc (loc) {
      this.AreaId = loc.id
      this.getStocktakeGroupList()
    },
    changeloc (loc) {
      this.groupId = loc.id
      this.getStocktakeLayoutLines()
    },
    formatType (status) {
      var TypeText
      switch (status) {
        case 'I':
          TypeText = '未录入'
          break
        case 'P':
          TypeText = '进行中'
          break
        case 'C':
          TypeText = '已录入'
          break
      }
      return TypeText
    }
  },
  created () {
    this.CHANGE_TITLE('盘点进度查询')
    this.StocktakeLocationId = localStorage.getItem('StocktakeLocationId')
    this.getStocktakeAreaList()
  }
}
</script>
