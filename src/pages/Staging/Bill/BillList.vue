<template>
  <q-page>
    <div>
      <div class="row items-center justify-start q-pa-sm">
        <div class="text-grey-8 q-gutter-xs q-py-md">
          <q-btn dense
                 @click="get_order(null, null)"
                 class="btn-primary"
                 label="新建" />
        </div>
      </div>
      <q-separator spaced />
      <div class="column items-center">
        <h6 v-if='temp'>{{msg}}</h6>
        <q-table v-if='!temp'
                 class=" self-center col"
                 title="出清暂存单"
                 :data="billList"
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
            <q-card>
                <q-card-section horizontal>
                  <q-card-section
                    class="col"
                    @click="get_order(props.row.id, props.row.createdDate)"
                  >
                    <div><span class="q-pa-xs">退单编号</span><span class="q-pa-xs">{{ props.row.id }}</span></div>
                    <div><span class="q-pa-xs">创建时间</span><span class="q-pa-xs">{{ props.row.createdDate }}</span></div>
                    <!-- <div><span class="q-pa-xs">状态</span><span class="q-pa-xs">{{ props.row.status }}</span></div> -->
                  </q-card-section>

                  <q-card-actions
                    class="col-2"
                  >
                    <q-btn
                      flat
                      round
                      color="primary"
                      icon="close"
                      @click="deleteShipment(props.row.Id)"
                    />
                  </q-card-actions>
                </q-card-section>

              </q-card>
            </div>
          </template>
        </q-table>
      </div>
    </div>
    <q-dialog v-model="deleteFlag">
      <q-card style="width:200px">
        <q-card-section class="row items-center justify-center">
          <div class="text-h6">删除</div>
        </q-card-section>
        <div class="row justify-center">确定删除?</div>
        <div class="q-mb-md q-mt-md justify-around row">
          <q-btn class="btn-primary"
                  @click="closeBtn()"
                  label="否" />
          <q-btn class="btn-primary"
                  @click="confirmBtn()"
                  label="是" />
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
      temp: false,
      columns: [
        {
          name: 'id',
          required: true,
          label: '出清编号',
          align: 'left',
          field: row => row.id,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'createdDate', align: 'center', label: '创建时间', field: 'createdDate', sortable: true }
      ],
      billList: [],
      tempSelected: [],
      rcvedpagination: {
        page: 1,
        rowsPerPage: 0
      },
      LocationId: null,
      billId: null,
      msg: null,
      deleteFlag: false,
      shipmentId: null
    }
  },
  watch: {
  },
  created () {
    this.CHANGE_TITLE('出清列表')
    this.LocationId = this.$store.state.location.id
    this.getList(this.LocationId)
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_GO', 'BTN_PAGE', 'CHANGE_TITLE', 'RETURNFALSE']),
    get_order (id, createdDate) {
      this.$router.push({ path: '/Bill/createBill', query: { billId: id, createdDate: createdDate } })
    },
    getList (LocationId) {

    },
    deleteShipment (id) {
      this.deleteFlag = true
      this.shipmentId = id
    },
    closeBtn () {
      this.deleteFlag = false
      this.shipmentId = null
    },
    confirmBtn () {
      alert('删除')
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
