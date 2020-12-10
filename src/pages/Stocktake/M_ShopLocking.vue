<template>
  <q-page class="orderlist">
  <br>
    <q-list class="q-pa-xs row items-center">
      <!-- <q-item class="q-pa-xs row"> -->
    <q-item-section  class="text-weight-bold col-2 q-pl-md">门店</q-item-section>
    <div class="col-8">
          <q-btn-dropdown
            dense
            id="loc-drop"
            style="width:100%"
            color="white"
            text-color="black"
            :label='locationLabel'
      no-caps >
      <q-list>
        <q-item bordered   v-for="(loc, index) in locationListTemp" :key="index"
         v-model="locationLabel" @click="locationLabel = loc.label, changeloc(loc)" clickable v-close-popup>
          <q-item-section>
            <q-item-label class="text-center">{{ loc.label }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
    </div>
    </q-list>

    <div class="q-pa-xs">
      <q-table
        flat
        :data="stocktakeList"
        :columns="columns"
        row-key="index"
        hide-bottom>
        <template v-slot:body="props">
          <q-tr  class="allRcv">
            <q-td class="rcvtd" key="externalNo" :props="props">{{ props.row.externalNo }}</q-td>
              <q-td class="" key="description" :props="props">{{ props.row.description }}</q-td>
              <q-td class="rcvtd" key="stocktakeType" :props="props">{{ formatType(props.row.stocktakeType) }}</q-td>
              <!-- <q-td class="" key="stocktakeStatus" :props="props">{{ formatStatus(props.row.stocktakeStatus,0) }}</q-td> -->
              <q-td class="rcvtd" key="stocktakeDate" :props="props">{{ props.row.stocktakeDate }}</q-td>
              <!-- <q-td class="" key="stocktakeCreateDate" :props="props">{{ props.row.stocktakeCreateDate }}</q-td> -->
              <q-td class="text-center">
                <q-btn color="primary" style="width:50px;"  v-if="props.row.externalNo !== stockId" @click="locking(props.row)">锁定</q-btn>
                <q-btn color="red" style="width:50px;" v-if="props.row.externalNo === stockId">已锁定</q-btn>
              </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>

  <q-dialog v-model="icon">
    <q-card>
      <q-card-section class="row items-center">
        <div class="text-h6">是否确定锁定当前盘点</div>
        <q-space />
        <!-- <q-btn icon="close" flat round dense v-close-popup /> -->
      </q-card-section>
      <!-- <q-card-section>

      </q-card-section> -->
      <div class="q-mb-md q-mt-md justify-around row">
        <q-btn class="btn-primary" @click="cancel()" label="否"/>
        <q-btn class="btn-primary" @click="confirm()" label="是"/>
      </div>
    </q-card>
  </q-dialog>

  </q-page>
</template>
<script>
import { mapMutations } from 'vuex'
import { date } from 'quasar'
var timeStamp = Date.now()
export default {
  data () {
    return {
      icon: false,
      locationLabel: '',
      locationListTemp: [],
      columns: [
        {
          name: 'externalNo',
          required: true,
          label: '盘点编号',
          field: row => row.externalNo,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'description', label: '盘点名称', field: 'description' },
        { name: 'stocktakeType', label: '盘点类型', field: 'stocktakeType' },
        // { name: 'stocktakeStatus', label: '盘点状态', field: 'stocktakeStatus' },
        { name: 'stocktakeDate', label: '盘点日期', field: 'stocktakeDate' },
        // { name: 'stocktakeCreateDate', label: '创建日期', field: 'stocktakeCreateDate' },
        { name: 'more', align: 'center', label: '是否锁定', field: 'more' }
      ],
      locationList: [],
      locationId: null,
      stocktakeStatus: { value: null, label: '全部' },
      stocktakeType: { value: null, label: '全部' },
      stocktakeDate: null,
      stocktakeId: null,
      stocktakeList: [],
      stockId: null,
      row: null,
      datenow: null,
      externalNo: null
    }
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_GO', 'BTN_PAGE', 'CHANGE_TITLE', 'GET_STOREID', 'GET_STOCKTAKELOCATIONID', 'GET_STOCKTAKEID']),
    checkUser () {
      let StoreId = localStorage.getItem('Location')
      this.$api.Basic.listStores().then(res => {
        console.log(res)
        this.locationList = res.data.data.map(val => {
          let json = {}
          json.id = val.id
          json.name = val.name
          json.label = val.id + '-' + val.name
          json.printer = val.printer
          return json
        })
        this.locationListTemp = this.locationList

        this.locationList.map((val, index) => {
          if (val.id === Number(StoreId)) {
            this.locationLabel = val.label
            this.locationId = val.id
            localStorage.setItem('StoreId', this.locationId)
            this.GET_STOREID(this.locationId)
          }
        })
        this.getstocktakeList()
      })
    },
    getstocktakeList () { // 获取门店锁定列表
      let params = {
        status: this.stocktakeStatus.value,
        locationId: this.locationId,
        stocktakeDate: this.stocktakeDate,
        stocktakeType: this.stocktakeType.value,
        externalNo: this.stocktakeId
      }
      this.stockId = localStorage.getItem('externalNo')
      this.$api.Stocktake.getStocktakeList(params).then(res => {
        console.log(res)
        if (res.data.code === 1) {
          this.stocktakeList = res.data.data.map(val => {
            let json = {}
            json.StocktakeLocationId = val.stocktakeLocations[0].id
            json.description = val.description
            json.externalNo = val.externalNo
            json.stocktakeId = val.stocktakeLocations[0].stocktakeId
            json.locationId = val.stocktakeLocations[0].locationId
            json.stocktakeType = val.type
            json.stocktakeStatus = val.status
            json.stocktakeDate = val.stocktakeDate.substr(0, 10)
            json.stocktakeCreateDate = val.createdDate.substr(0, 10)
            return json
          }).filter(val => {
            return val.stocktakeDate === this.datenow
          })
          console.log(this.stocktakeList)
        } else {
          this.stocktakeList = []
        }
      })
    },
    locking (row) {
      this.icon = true
      this.row = row
      console.log(row)
    },
    confirm () {
      localStorage.setItem('StocktakeLocationId', this.row.StocktakeLocationId)
      localStorage.setItem('StocktakeId', this.row.stocktakeId)
      localStorage.setItem('StoreId', this.row.locationId)
      localStorage.setItem('stocktakeDate', this.row.stocktakeDate)
      localStorage.setItem('stocktakeType', this.row.stocktakeType)
      localStorage.setItem('externalNo', this.row.externalNo)
      this.GET_STOCKTAKELOCATIONID(this.row.StocktakeLocationId)
      this.GET_STOCKTAKEID(this.row.stocktakeId)
      this.GET_STOREID(this.row.locationId)
      this.getstocktakeList()
      this.icon = false
    },
    cancel () {
      this.icon = false
      this.row = null
    },
    changeloc (val) {
      this.locationId = val.id
      // localStorage.setItem('StoreId', val.id)
      // this.GET_STOREID(val.id)
      this.getstocktakeList()
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
    }
  },
  created () {
    this.CHANGE_TITLE('盘点门店锁定')
    this.checkUser()
    this.datenow = date.formatDate(timeStamp, 'YYYY-MM-DD')
    console.log(this.datenow)
  }
}
</script>
