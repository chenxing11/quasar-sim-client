<template>
  <q-page class="orderlist">
    <q-list class="q-pa-xs">

      <div class="row item-center">
        <q-input class="col q-px-xs q-pb-sm"
                 filled
                 dense
                 v-model="startDate"
                 mask="date"
                 :rules="['date']"
                 label="开始日期">
          <template v-slot:append>
            <q-icon name="event"
                    class="cursor-pointer">
              <q-popup-proxy ref="startDate"
                             transition-show="scale"
                             transition-hide="scale">
                <q-date v-model="startDate"
                        @input="() => $refs.startDate.hide()" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-input class="col q-px-xs q-pb-sm"
                 filled
                 dense
                 v-model="endDate"
                 mask="date"
                 :rules="['date']"
                 label="结束日期">
          <template v-slot:append>
            <q-icon name="event"
                    class="cursor-pointer">
              <q-popup-proxy ref="endDate"
                             transition-show="scale"
                             transition-hide="scale">
                <q-date v-model="endDate"
                        @input="() => $refs.endDate.hide()" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="row items-center">
        <q-card-section class="q-pa-xs row items-center col-6 justify-between">
          <q-input outlined
                  autofocus
                  dense
                  label="库存调整单号"
                  v-model="inventoryAdjustId"
                  class=" text-grey-8">
          </q-input>
        </q-card-section>
        <div class="text-grey-8 q-pl-sm col-6">
          <q-btn color="primary" dense class=" q-px-md" label="查询" @click="searchBtn()" />
        </div>
      </div>
      <!-- <div class="rcv-btn row">
        <div class="text-grey-8 q-gutter-xs q-pa-md">
          <q-btn dense
                 @click="searchBtn()"
                 class="btn-primary"
                 label="查询" />
        </div>
      </div> -->
      <div class="column items-center">
        <h6 v-if='temp'>{{msg}}</h6>
        <q-table v-if='!temp'
                 class="self-center col"
                 :data="InvAdjustList"
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
          label: '库存调整单号',
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
      InvAdjustList: [],
      tempSelected: [],
      inventoryAdjustId: null,
      startDate: '',
      endDate: '',
      LocationId: null,
      msg: null
    }
  },
  watch: {
    tempSelected (val) {
      if (this.tempSelected[0]) {
        this.InvAdjustOrder(this.tempSelected[0].id)
      }
    }
  },
  created () {
    this.CHANGE_TITLE('库存调整查询')
    this.datenow = date.formatDate(timeStamp, 'YYYY-MM-DD')
    this.startDate = this.datenow
    this.endDate = this.datenow
    this.LocationId = this.$store.state.location.id
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_GO', 'BTN_PAGE', 'CHANGE_TITLE', 'RETURNFALSE']),
    searchBtn () {
      if (this.inventoryAdjustId !== null || this.startDate || this.endDate) {
        let date = (new Date(this.endDate) - new Date(this.startDate)) / (1000 * 60 * 60 * 24)
        // console.log(date)
        if (date > 7) {
          this.POP_MSG('结束时间不能大于开始时间7天')
        } else if (date < 0) {
          this.POP_MSG('开始时间不能大于结束时间')
        } else {
          this.$api.Inventory.QueryInventoryAdjusts(
            this.LocationId,
            this.inventoryAdjustId,
            this.startDate,
            this.endDate
          ).then(res => {
            console.log(res)
            if (res.data.code > 0) {
              this.temp = false
              this.InvAdjustList = res.data.data.map(val => {
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
        }
      }
    },
    InvAdjustOrder (id) {
      this.$router.push({ path: '/Inv/InvAdjustOrder', query: { inventoryAdjustId: id } })
      // M 已审批 S 已提交 W 工作表
    },
    formatStatus (val) {
      var text
      switch (val) {
        case 'M':
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
