<template>
  <q-page class="orderlist">
    <q-list class="q-pa-xs">
      <q-card-section class="q-pa-xs row items-center">
        <span class="q-pa-sm text-weight-bold text-black">库存调整单号</span>
        <span>{{inventoryAdjustId}}</span>
        <!-- <q-input outlined
                 autofocus
                 disable
                 dense
                 style="width:200px"
                 v-model="inventoryAdjustId"
                 class="q-pa-sm text-grey-8"></q-input> -->
      </q-card-section>
      <q-card-section class="q-pa-xs"
                      caption>
        <span class="q-pa-sm text-weight-bold text-black">创建时间</span>
        <span class="q-pa-sm text-grey-8">{{datenow}}</span>
      </q-card-section>
      <q-card-section class="q-pa-xs"
                      caption>
        <span class="q-pa-sm text-weight-bold text-black">已录入品项数</span>
        <span class="q-pa-sm text-grey-8">{{inventoryAdjustData.length}}</span>
      </q-card-section>
      <q-card-section class="q-pa-xs"
                      caption>
        <span class="q-pa-sm text-weight-bold text-black">单据状态</span>
        <span class="q-pa-sm text-grey-8">{{status}}</span>
      </q-card-section>

      <div class="q-pt-md q-pa-sm">
        <q-table table-style="max-height: 300px"
                 virtual-scroll
                 flat
                 :data="inventoryAdjustData"
                 :pagination.sync="rcvedpagination"
                 :rows-per-page-options=[0]
                 :columns="columns">
          <template v-slot:body="props">
            <q-tr class="allRcv">
              <q-td class="rcvtd"
                    key="itemId"
                    :props="props">{{ props.row.itemId }}</q-td>
              <q-td class="rcvtd"
                    key="description"
                    :props="props">{{ props.row.description }}</q-td>
              <q-td class="rcvtd"
                    key="unitCost"
                    :props="props">{{ props.row.unitCost }}</q-td>
              <q-td class="rcvtd"
                    key="qtyBeforeAdjusted"
                    :props="props">{{ props.row.qtyBeforeAdjusted }}</q-td>
              <q-td class="rcvtd"
                    key="qtyAdjusted"
                    :props="props">{{ props.row.qtyAdjusted }}</q-td>
              <q-td class="rcvtd"
                    key="inventoryAdjustReasonId"
                    :props="props">{{ props.row.inventoryAdjustReasonId }}</q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
      <!-- <div class="text-red">单品/整单调整金额超过正负2000，需地区营运总监、大区财务总监审批</div> -->
      <div class="rcv-btn row">
        <div class="text-grey-8 q-gutter-xs q-py-md">
          <q-btn dense
                 @click="rejectBtn()"
                 class="btn-primary"
                 label="拒绝" />
        </div>
        <div class="text-grey-8 q-gutter-xs q-pa-md">
          <q-btn dense
                 class="btn-primary"
                 @click="ApprovalBtn()"
                 label="审批" />
        </div>
      </div>

      <q-dialog v-model="TipsFlag">
        <q-card style="width:200px">
          <q-card-section class="row justify-center">
            <div class="text-h6">审批</div>
          </q-card-section>
          <div class="row justify-center q-pa-md">是否确认审批?</div>
          <div class="q-mb-md q-mt-md justify-around row">
            <q-btn
              class="btn-primary"
              @click="close()"
              label="否"
            />
            <q-btn
              class="btn-primary"
              @click="comfirm()"
              label="是"
            />
          </div>
        </q-card>
      </q-dialog>

      <q-dialog v-model="rejectFlag">
        <q-card style="width:200px">
          <q-card-section class="row justify-center">
            <div class="text-h6">拒绝</div>
          </q-card-section>
          <div class="row justify-center q-pa-md">是否确认拒绝?</div>
          <div class="q-mb-md q-mt-md justify-around row">
            <q-btn
              class="btn-primary"
              @click="rejectClose()"
              label="否"
            />
            <q-btn
              class="btn-primary"
              @click="rejectComfirm()"
              label="是"
            />
          </div>
        </q-card>
      </q-dialog>
    </q-list>
  </q-page>
</template>
<script>
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      rcvedpagination: {
        page: 1,
        rowsPerPage: 0
      },
      columns: [
        { name: 'itemId', align: 'left', label: '商品编码', field: 'itemId', sortable: true },
        { name: 'description', align: 'left', label: '商品描述', field: 'description' },
        { name: 'unitCost', align: 'left', label: '平均成本', field: 'unitCost' },
        { name: 'qtyBeforeAdjusted', align: 'left', label: '库存', field: 'qtyBeforeAdjusted' },
        { name: 'qtyAdjusted', align: 'left', label: '调整数量', field: 'qtyAdjusted' },
        { name: 'inventoryAdjustReasonId', align: 'left', label: '调整原因', field: 'inventoryAdjustReasonId' }
      ],
      inventoryAdjustId: null,
      inventoryAdjustData: [],
      datenow: null,
      TipsFlag: false,
      rejectFlag: false,
      status: null
    }
  },
  created () {
    this.inventoryAdjustId = this.$route.query.inventoryAdjustId
    this.GetInventoryAdjustById(this.inventoryAdjustId)
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_GO', 'BTN_PAGE', 'CHANGE_TITLE', 'RETURNFALSE']),
    GetInventoryAdjustById (id) { // 根据id获取库存调整单
      this.$api.Inventory.GetInventoryAdjustById(id).then(res => {
        console.log(res)
        if (res.data.code > 0) {
          this.datenow = res.data.data.createdDate.slice(0, 10)
          this.status = this.formatStatus(res.data.data.status)
          this.inventoryAdjustData = res.data.data.inventoryAdjustLines.map(val => {
            let json = {}
            json.id = val.id
            json.itemId = val.itemId
            json.description = val.item.description
            json.unitCost = val.unitCost
            json.qtyAdjusted = val.qtyAdjusted
            json.qtyBeforeAdjusted = val.qtyBeforeAdjusted
            json.inventoryAdjustReasonId = val.inventoryAdjustReason.description
            return json
          })
        }
      })
    },
    ApprovalBtn () { // 单品/整单调整金额不超过正负2000
      var num = 0, sum = 0
      this.inventoryAdjustData.map(val => {
        let TotalAmount = val.unitCost * val.qtyAdjusted
        sum += val.unitCost * val.qtyAdjusted
        if (TotalAmount > 2000 || TotalAmount < -2000) {
          num++
        }
      })
      if (num > 0 || sum > 2000 || sum < -2000) {
        // this.TipsFlag = true
        // this.POP_MSG('单品/整单调整金额超过正负2000，需地区营运总监、大区财务总监审批')
        this.$q.notify({
          position: 'top',
          timeout: 2000,
          color: 'red',
          message: '单品/整单调整金额超过正负2000，需地区营运总监、大区财务总监审批'
        })
        this.TipsFlag = true
      } else {
        this.TipsFlag = true
      }
    },
    comfirm () { // 审批
      this.$api.Inventory.InventoryAdjustApproval(this.inventoryAdjustId).then(res => {
        console.log(res)
        if (res.data.code > 0) {
          this.$router.go(-1)
        }
      })
    },
    close () {
      this.TipsFlag = false
    },
    rejectBtn () { // 拒绝
      this.rejectFlag = true
      // this.$api.Inventory.InventoryAdjustReject(this.inventoryAdjustId).then(res => {
      //   console.log(res)
      //   if (res.data.code > 0) {
      //     this.$router.go(-1)
      //   }
      // })
    },
    rejectClose () {
      this.rejectFlag = false
    },
    rejectComfirm () {
      this.$api.Inventory.InventoryAdjustReject(this.inventoryAdjustId).then(res => {
        console.log(res)
        if (res.data.code > 0) {
          this.rejectFlag = false
          this.$router.go(-1)
        }
      })
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
