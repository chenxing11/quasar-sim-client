<template>
  <q-page  class="">
    <div class="q-pa-md">
    <div class="row">
      <q-input outlined dense v-model="stocktakeDate"  class="col-4 q-py-xs q-px-lg"  mask="date">
        <template v-slot:before>
        <div class=" self-stretch column justify-center">
             <span class="text-bold text-black " style="font-size:1rem;color:#black;">盘点日期</span>
             </div>
        </template>
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy ref="stocktakeDate" transition-show="scale" transition-hide="scale">
            <q-date v-model="stocktakeDate" @input="() => $refs.stocktakeDate.hide()" />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <q-input outlined dense v-model="externalNo" class="col-4 q-py-xs q-px-lg" >
      <template v-slot:before>
        <div class=" self-stretch column justify-center">
             <span class="text-bold text-black " style="font-size:1rem;color:#black;">盘点编号</span>
             </div>
        </template>
    </q-input>
    <q-select outlined dense v-model="stocktakeStatus" class="col-4 q-py-xs q-px-lg" :options="stocktakeStatusList">
      <template v-slot:before>
        <div class=" self-stretch column justify-center">
             <span class="text-bold text-black" style="font-size:1rem;color:#black;">盘点状态</span>
             </div>
        </template>
    </q-select>
    <q-select outlined dense v-model="stocktakeType" class="col-4 q-py-xs q-px-lg" :options="stocktakeTypeList">
      <template v-slot:before>
        <div class=" self-stretch column justify-center">
             <span class="text-bold text-black" style="font-size:1rem;color:#black;">盘点类型</span>
             </div>
        </template>
    </q-select>
    <div class="col-8 q-py-xs q-px-lg q-gutter-lg self-end justify-center text-right">
      <q-btn class="btn-primary" label="清空" @click="clearSelect()"/>
    <q-btn class="btn-primary" label="查询" @click="getstocktakeList()"/>
  </div>
    </div>
    </div>
    <div class="q-pa-md">
    <q-table
      flat
      :data="stocktakeList"
      :columns="columns"
      row-key="name"
    >
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
        <q-tr :props="props" :class="formatStatus(props.row.stocktakeStatus,1)?'blacklist':'redlist'">
                    <q-td class="" key="externalNo" :props="props">{{ props.row.externalNo }}</q-td>
          <q-td class="" key="locationId" :props="props">{{ props.row.locationId }}</q-td>
          <q-td class="" key="stocktakeType" :props="props">{{ formatType(props.row.stocktakeType) }}</q-td>
          <q-td class="" key="stocktakeStatus" :props="props">{{ formatStatus(props.row.stocktakeStatus,0) }}</q-td>
          <q-td class="" key="stocktakeDate" :props="props">{{ props.row.stocktakeDate }}</q-td>
          <q-td class="" key="stocktakeCreateDate" :props="props">{{ props.row.stocktakeCreateDate }}</q-td>
          <q-td class="text-center">
            <q-btn class="text-primary" @click="close(props.row.StocktakeId, props.row.externalNo, props.row.locationId, props.row.StocktakeLocationId)" flat>编辑</q-btn>
            <q-btn class="text-primary" @click="stocktakeCancel = true, cancelId= props.row.StocktakeId" :disable="formatStatus(props.row.stocktakeStatus,1)" flat>作废</q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
  <q-dialog v-model="stocktakeCancel" persistent >
            <q-card class="poptip col-5 q-px-lg">
              <q-card-section align="center" class="text-h6">作废盘点</q-card-section>
              <q-card-section class="row justify-center">
                <span class="q-ml-sm">是否作废当前盘点？</span>
              </q-card-section>

              <q-card-actions align="center">
                <q-btn flat label="否" class="btn-negative"  v-close-popup/>
                <q-btn flat label="是" @click="cancel(cancelId)" class="btn-primary"  v-close-popup/>
              </q-card-actions>
            </q-card>
          </q-dialog>
  </q-page>
</template>

<style lang="stylus" >
</style>

<script>
import { mapMutations } from 'vuex'
// let printtime = date.formatDate(timeStamp, 'YYYY-MM-DDTHH:mm:ss.SSSZ')

export default {
  name: 'PageStoreRcvOrder',
  data () {
    return {
      stocktakeCancel: false,
      locationId: null,
      cancelId: null,
      StocktakeId: null,
      stocktakeStatus: { value: null, label: '全部' },
      externalNo: null,
      stocktakeDate: null,
      stocktakeStatusList: [
        { value: 'I', label: '未开始' },
        { value: 'P', label: '进行中' },
        { value: 'C', label: '已结盘' },
        { value: 'D', label: '已作废' },
        { value: null, label: '全部' }
      ],
      stocktakeType: { value: null, label: '全部' },
      stocktakeTypeList: [
        { value: 'FW', label: '生鲜周盘' },
        { value: 'FA', label: '生鲜月盘' },
        { value: 'M', label: '食百大盘' },
        { value: null, label: '全部' }
      ],
      pagination: {
        sortBy: 'name',
        descending: true,
        page: 2,
        rowsPerPage: 3
      },
      columns: [
        {
          name: 'externalNo',
          required: true,
          label: '盘点编号',
          field: row => row.externalNo,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'locationId', label: '门店编号', field: 'locationId' },
        { name: 'stocktakeType', label: '盘点类型', field: 'stocktakeType' },
        { name: 'stocktakeStatus', label: '盘点状态', field: 'stocktakeStatus' },
        { name: 'stocktakeDate', label: '盘点日期', field: 'stocktakeDate' },
        { name: 'stocktakeCreateDate', label: '创建日期', field: 'stocktakeCreateDate' },
        { name: 'more', align: 'center', label: '详情', field: 'more' }
      ],
      stocktakeList: []
    }
  },
  created () {
    this.locationId = localStorage.getItem('Location')
    this.getstocktakeList()
  },
  mounted () {
  },
  computed: {
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_PAGE']),
    clearSelect () {
      this.stocktakeId = null
      this.stocktakeStatus = { value: null, label: '全部' }
      this.stocktakeDate = null
      this.stocktakeType = { value: null, label: '全部' }
    },
    getstocktakeList () {
      let params = {
        status: this.stocktakeStatus.value,
        locationId: this.locationId,
        stocktakeDate: this.stocktakeDate,
        stocktakeType: this.stocktakeType.value,
        externalNo: this.externalNo
      }
      console.log(params)
      this.$api.Stocktake.getStocktakeList(params).then(res => {
        console.log(res.data.data)
        if (res.data.code === 1) {
          this.stocktakeList = res.data.data.map(val => {
            let json = {}
            json.StocktakeLocationId = val.stocktakeLocations[0].id
            json.StocktakeId = val.stocktakeLocations[0].stocktakeId
            json.externalNo = val.externalNo
            json.locationId = val.stocktakeLocations[0].locationId
            json.stocktakeType = val.type
            json.stocktakeStatus = val.status
            json.stocktakeDate = val.stocktakeDate.substr(0, 10)
            json.stocktakeCreateDate = val.createdDate.substr(0, 10)
            return json
          }).reverse()
          console.log(this.stocktakeList)
        } else {
          console.log(res)
        }
      })
    },
    close (StocktakeId, externalNo, StocktakeStore, StocktakeLocationId) {
      this.$router.replace({
        path: '/WebStocktake/Close',
        query: {
          StocktakeId: StocktakeId,
          externalNo: externalNo,
          StocktakeStore: StocktakeStore,
          StocktakeLocationId: StocktakeLocationId
        }
      })
    },
    formatStatus (status, fun) {
      if (fun === 0) {
        var text
        switch (status) {
          case 'I':
            text = '未开始'
            break
          case 'P':
            text = '进行中'
            break
          case 'C':
            text = '已结盘'
            break
          case 'D':
            text = '已废盘'
            break
        }
        return text
      } else if (fun === 1) {
        var editStatus
        switch (status) {
          case 'I':
            editStatus = false
            break
          case 'P':
            editStatus = false
            break
          case 'C':
            editStatus = true
            break
          case 'D':
            editStatus = true
            break
        }
        return editStatus
      }
    },
    formatType (status) {
      var TypeText
      switch (status) {
        case 'FW':
          TypeText = '生鲜周盘'
          break
        case 'FA':
          TypeText = '生鲜月盘'
          break
        case 'M':
          TypeText = '食百大盘'
          break
      }
      return TypeText
    },
    cancel (id) {
      this.$api.Stocktake.cancelStocktake(id).then(res => {
        console.log(res)
        if (res.data.code !== 1) {
          this.POP_MSG(res.data.msg)
        } else {
          this.NotiSuccess(res.data.msg)
          this.getstocktakeList()
        }
      })
    }
  }
}
</script>
