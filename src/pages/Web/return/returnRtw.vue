<template>
  <q-page class="q-pa-md">
    <!-- <div class="">
      <q-btn class="btn-back col-2 text-primary"
             flat
             icon="arrow_back_ios"
             style="font-size:1rem;"
             @click="$router.go(-1)" />
    </div> -->
    <div class="q-pa-md">
      <q-table flat
               :data="rtwList"
               :columns="columns">
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th v-for="col in props.cols"
                  :key="col.name"
                  width="20%"
                  :props="props"
                  class="text-black"
                  style="font-size:1rem;font-weight:bold;text-align:center">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td class=""
                  key="id"
                  :props="props">{{ props.row.id }}</q-td>
            <q-td class=""
                  key="locationId"
                  :props="props">{{ props.row.locationId }}</q-td>
            <q-td class=""
                  key="createdByName"
                  :props="props">{{ props.row.createdByName }}</q-td>
            <q-td class=""
                  key="createdDate"
                  :props="props">{{ props.row.createdDate }}</q-td>
            <q-td class=""
                  key="status"
                  :props="props">{{ props.row.status }}</q-td>
            <q-td class="text-center">
              <q-btn class="text-primary"
                     @click="approvalBtn(props.row)"
                     flat>审批</q-btn>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-page>
</template>
<script>
export default {
  data () {
    return {
      columns: [
        {
          name: 'id',
          required: true,
          label: '返仓编号',
          align: 'center',
          field: row => row.index,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'locationId', align: 'center', label: '门店', field: 'locationId' },
        { name: 'createdByName', align: 'center', label: '创建人', field: 'createdByName' },
        { name: 'createdDate', align: 'center', label: '创建时间', field: 'createdDate' },
        { name: 'status', align: 'center', label: '状态', field: 'status' },
        { name: 'more', align: 'center', label: '详情', field: 'more' }
      ],
      rtwList: [],
      LocationId: null
    }
  },
  created () {
    this.LocationId = this.$store.state.location.id
    this.getlist()
  },
  methods: {
    approvalBtn (row) {
      this.$router.push({ path: '/return/rtwApproval', query: { rtwId: row.id } })
    },
    getlist () {
      this.$api.Rtw.ListReturnToWhInSubmittedByLoc(this.LocationId).then(res => {
        console.log(res)
        if (res.data.code > 0) {
          this.temp = false
          this.rtwList = res.data.data.map(val => {
            let json = {}
            json.id = val.id
            json.locationId = val.fromLocationId
            json.createdByName = val.createdByName
            json.createdDate = val.createdDate.slice(0, 10)
            json.status = this.formatStatus(val.status)
            return json
          })
        }
      })
    },
    formatStatus (val) {
      var text
      switch (val) {
        case 'A':
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
