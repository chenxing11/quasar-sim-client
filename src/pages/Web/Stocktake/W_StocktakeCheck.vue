<template>
  <q-page  class="">
    <div class="q-pa-md">
      <q-btn class="btn-back col-2 text-primary" flat
             icon="arrow_back_ios"
             style="font-size:1rem;"
             to='/WebStocktake/Imp' />
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
            <q-tab name="LayoutList"
                   label="通道货架列表" />
            <q-tab name="UserList"
                   label="盘点人员采集表" />
          </q-tabs>
      <q-tab-panels  v-model="panel" animated class="rounded-borders">
        <q-tab-panel name="LayoutList">
          <q-table
      flat
      :data="LayoutList"
      :columns="layoutcolumns"
      row-key="index"
      table-style="max-height: 500px"
      virtual-scroll
      :pagination.sync="pagination"
      :rows-per-page-options="[0]"
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
        <q-tr :props="props">
          <q-td class="" key="id" :props="props">{{ props.row.id }}</q-td>
          <q-td class="" key="locationId" :props="props">{{ props.row.locationId }}</q-td>
          <q-td class="" key="zone" :props="props">{{ props.row.zone }}</q-td>
          <q-td class="" key="bayFrom" :props="props">{{ props.row.bayFrom }}</q-td>
          <q-td class="" key="bayTo" :props="props">{{ props.row.bayTo }}</q-td>
          <q-td class="" key="groupId" :props="props">{{ props.row.groupId }}</q-td>
          <q-td class="" key="groupName" :props="props">{{ props.row.groupName }}</q-td>
          <q-td class="" key="areaName" :props="props">{{ props.row.areaName }}</q-td>
          <q-td class="" key="createdBy" :props="props">{{ props.row.createdBy }}</q-td>
          <q-td class="" key="createdDate" :props="props">{{ props.row.createdDate }}</q-td>
        </q-tr>
      </template>
    </q-table>
        </q-tab-panel>

        <q-tab-panel name="UserList">
          <q-table
      flat
      :data="userList"
      :columns="usercolumns"
      row-key="index"
      table-style="max-height: 500px"
      virtual-scroll
      :pagination.sync="pagination"
      :rows-per-page-options="[0]"
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
        <q-tr :props="props">
          <q-td class="" key="id" :props="props">{{ props.row.id }}</q-td>
          <q-td class="" key="locationId" :props="props">{{ props.row.locationId }}</q-td>
          <q-td class="" key="userName" :props="props">{{ props.row.userName }}</q-td>
          <q-td class="" key="userCode" :props="props">{{ props.row.userCode }}</q-td>
          <q-td class="" key="password" :props="props">{{ props.row.password }}</q-td>
          <q-td class="" key="description" :props="props">{{ props.row.description }}</q-td>
          <q-td class="" key="groupList" :props="props">{{ props.row.groupList }}</q-td>
          <q-td class="" key="createdBy" :props="props">{{ props.row.createdBy }}</q-td>
          <q-td class="" key="createdDate" :props="props">{{ props.row.createdDate }}</q-td>
        </q-tr>
      </template>
    </q-table>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
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
      LayoutList: [],
      userList: [],
      panel: 'LayoutList',
      pagination: {
        rowsPerPage: 0
      },
      usercolumns: [
        {
          name: 'id',
          required: true,
          label: '序号',
          field: row => row.index,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'locationId', label: '门店编号', field: 'locationId' },
        { name: 'userName', label: '盘点人员', field: 'userName' },
        { name: 'userCode', label: '工号', field: 'userCode' },
        { name: 'password', label: '密码', field: 'password' },
        { name: 'description', label: '岗位', field: 'description' },
        { name: 'groupList', label: '品类组', field: 'groupList' },
        { name: 'createdBy', label: '创建人', field: 'createdBy' },
        { name: 'createdDate', label: '创建时间', field: 'createdDate' }
      ],
      layoutcolumns: [
        {
          name: 'id',
          required: true,
          label: '序号',
          field: row => row.index,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'locationId', label: '门店编号', field: 'locationId' },
        { name: 'zone', label: '通道号', field: 'zone' },
        { name: 'bayFrom', label: '货架起', field: 'bayFrom' },
        { name: 'bayTo', label: '货架止', field: 'bayTo' },
        { name: 'groupId', label: '品类组', field: 'groupId' },
        { name: 'groupName', label: '品类组名称', field: 'groupName' },
        { name: 'areaName', label: '区域', field: 'areaName' },
        { name: 'createdBy', label: '创建人', field: 'createdBy' },
        { name: 'createdDate', label: '创建时间', field: 'createdDate' }
      ]
    }
  },
  created () {
    this.StocktakeLocationId = this.$route.query.StocktakeLocationId
    this.locationId = this.$route.query.LocationId
    this.getStocktakeLayout(this.StocktakeLocationId)
    console.log(this.$refs)
  },
  mounted () {
  },
  computed: {
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_PAGE']),
    getStocktakeLayout (id) {
      this.$api.Stocktake.getStocktakeUsersImp(id).then(res => {
        // 获取信息
        console.log(res.data.data)
        let createdBy = res.data.data.createdBy
        let createdDate = res.data.data.createdDate.substr(0, 10)
        this.userList = res.data.data.stocktakeUsersImpLines.map((val, index) => {
          let json = {}
          json.id = index + 1
          json.userName = val.userName
          json.userCode = val.userCode
          json.locationId = this.locationId
          json.password = val.password
          json.groupList = val.groupList
          json.description = val.role.description
          json.createdBy = createdBy
          json.createdDate = createdDate
          return json
        })
        console.log(this.userList)
      })
      this.$api.Stocktake.getStocktakeLayoutImp(id).then(res => {
        // 获取信息
        console.log(res.data.data.stocktakeLayoutImpLines)
        let createdBy = res.data.data.createdBy
        let createdDate = res.data.data.createdDate.substr(0, 10)
        this.LayoutList = res.data.data.stocktakeLayoutImpLines.map((val, index) => {
          var groupName
          if (val.group === null) {
            groupName = null
          } else {
            groupName = val.group.name
          }
          let json = {}
          json.id = index + 1
          json.zone = val.zone
          json.bayFrom = val.bayFrom
          json.locationId = this.locationId
          json.bayTo = val.bayTo
          json.groupId = val.groupId
          json.groupName = groupName
          json.areaId = val.areaId
          json.areaName = val.area.description
          json.createdBy = createdBy
          json.createdDate = createdDate
          return json
        })
        console.log(this.LayoutList)
      })
    }
  }
}
</script>
