<template>
  <q-page class="orderlist">
    <q-list class="q-pa-xs">
      <!-- <div class="q-pt-md q-pa-sm items-center">
        <q-form @keydown.enter="getitem(posPriceChangeId)"
                @submit="RETURNFALSE()"
                class="orderinput">
          <q-input ref="scan"
                   dense
                   outlined
                   autofocus
                   v-model.number="posPriceChangeId"
                   label="单据号">
            <template v-slot:append>
              <q-icon name="close"
                      @click="posPriceChangeId = null"
                      class="cursor-pointer" />
            </template>
          </q-input>
        </q-form>
      </div> -->
      <div class="row items-center ">
        <q-card-section class="q-pa-xs row items-center justify-between">
          <q-input outlined
                  autofocus
                  dense
                  label="紧急变价单据号"
                  v-model="posPriceChangeId"
                  class=" text-grey-8">
            <template v-slot:append>
              <q-icon name="close"
                      @click="posPriceChangeId = null"
                      class="cursor-pointer" />
            </template>
          </q-input>
        </q-card-section>
        <div class="text-grey-8 q-pl-sm">
          <q-btn color="primary" dense class=" q-px-md" label="查询" @click="getitem()" />
        </div>
      </div>
      <div class="column items-center">
        <h6 v-if='temp'>{{msg}}</h6>
        <q-table v-if='!temp'
                 class="self-center col"
                 :data="priceChangeList"
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
    </q-list>
  </q-page>
</template>
<script>
import { mapMutations } from 'vuex'
import { date } from 'quasar'
var timeStamp = Date.now()
export default {
  data () {
    return {
      temp: false,
      columns: [
        {
          name: 'id',
          required: true,
          label: '单据号',
          align: 'left',
          field: row => row.id,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'createdDate', align: 'center', label: '创建时间', field: 'createdDate', sortable: true },
        { name: 'status', align: 'center', label: '状态', field: 'status', sortable: true }
      ],
      rcvedpagination: {
        page: 1,
        rowsPerPage: 0
      },
      priceChangeList: [],
      tempSelected: [],
      posPriceChangeId: null,
      startDate: '',
      endDate: '',
      LocationId: null,
      msg: null
    }
  },
  watch: {
    tempSelected (val) {
      if (this.tempSelected[0]) {
        this.priceChangeOrder(this.tempSelected[0].id)
      }
    }
  },
  created () {
    this.CHANGE_TITLE('紧急变价查询')
    this.datenow = date.formatDate(timeStamp, 'YYYY-MM-DD')
    this.startDate = this.datenow
    this.endDate = this.datenow
    this.LocationId = this.$store.state.location.id
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_GO', 'BTN_PAGE', 'CHANGE_TITLE', 'RETURNFALSE']),
    searchBtn () {

    },
    priceChangeOrder (id) {
      this.$router.push({ path: '/PriceChange/PriceChangeOrder', query: { posPriceChangeId: id } })
      // M 已审批 S 已提交 W 工作表
    },
    getitem () {
      this.$api.PriceChange.QueryPosPriceChanges(
        this.LocationId,
        this.posPriceChangeId,
        this.startDate,
        this.endDate
      ).then(res => {
        console.log(res)
        if (res.data.code > 0) {
          this.temp = false
          this.priceChangeList = res.data.data.map(val => {
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
