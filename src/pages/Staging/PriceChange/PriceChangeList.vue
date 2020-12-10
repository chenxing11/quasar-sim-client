<template>
  <q-page>
    <div>
      <div class="row items-center justify-start q-pa-sm">
        <div class="text-grey-8 q-gutter-xs q-py-md">
          <q-btn dense
                 @click="createStock(null, null)"
                 class="btn-primary"
                 label="新建" />
        </div>
      </div>
      <q-separator spaced />
      <div class="column items-center">
        <h6 v-if='temp'>{{msg}}</h6>
        <q-table v-if='!temp'
                 class=" self-center col"
                 title="变价暂存单"
                 :data="PriceChangeList"
                 :columns="columns"
                 row-key="externalNo"
                 selection="single"
                 style="width:100%"
                 :selected.sync="tempSelected"
                 grid
                 hide-header
                 hide-bottom
                 :pagination.sync="rcvedpagination"
                 :rows-per-page-options=[0]>
          <template v-slot:item="props">
            <div class="q-pa-xs"
                 style="width:100%"
                 :style="props.selected ? 'transform: scale(0.95);' : ''">
              <q-card @click="props.selected =!props.selected"
                      :class="props.selected ? 'bg-grey-2' : ''">
                <q-card-section class="q-pa-xs"
                                v-for="col in props.cols.filter(col => col.name !== 'desc')"
                                :key="col.name">
                  <span class="q-pa-xs">{{ col.label }}</span>
                  <span class="q-pa-xs">{{ col.value }}</span>
                </q-card-section>
              </q-card>
            </div>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
</template>
<script>
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      temp: false,
      columns: [
        {
          name: 'id',
          required: true,
          label: '紧急变价单据号',
          align: 'left',
          field: row => row.id,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'createdDate', align: 'center', label: '创建时间', field: 'createdDate', sortable: true },
        { name: 'status', align: 'center', label: '状态', field: 'status', sortable: true }
      ],
      PriceChangeList: [],
      tempSelected: [],
      rcvedpagination: {
        page: 1,
        rowsPerPage: 0
      },
      LocationId: null,
      posPriceChangeId: null,
      msg: null
    }
  },
  watch: {
    tempSelected (val) {
      if (this.tempSelected[0]) {
        // console.log(this.tempSelected[0])
        this.posPriceChangeId = this.tempSelected[0].id
        this.createStock(this.posPriceChangeId, this.tempSelected[0].createdDate)
      }
    }
  },
  created () {
    this.CHANGE_TITLE('紧急变价')
    this.LocationId = this.$store.state.location.id
    this.getList()
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_GO', 'BTN_PAGE', 'CHANGE_TITLE', 'RETURNFALSE']),
    createStock (id, createdDate) {
      this.$router.push({ path: '/PriceChange/CreatePriceChange', query: { posPriceChangeId: id, createdDate: createdDate } })
    },
    getList () {
      this.$api.PriceChange.ListPosPriceChangeInProcByLoc(this.LocationId).then(res => {
        console.log(res)
        if (res.data.code > 0) {
          this.temp = false
          this.PriceChangeList = res.data.data.map(val => {
            let json = {}
            json.id = val.id
            json.createdDate = val.createdDate.slice(0, 10)
            json.status = this.formatStatus(val.status)
            return json
          })
        } else {
          this.temp = true
          this.msg = res.data.msg
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
