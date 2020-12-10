<template>
  <q-page class="orderlist">
    <q-list class="q-pa-xs">
      <q-card-section class="q-pa-xs">
        <span class="q-pa-sm text-weight-bold text-black">退单编号</span>
        <span>{{rtvId}}</span>
      </q-card-section>
      <!-- <q-card-section class="q-pa-xs"
                      caption>
        <span class="q-pa-sm text-weight-bold text-black">供应商</span>
        <span class="q-pa-sm text-grey-8">{{datenow}}</span>
      </q-card-section> -->
      <q-card-section class="q-pa-xs"
                      caption>
        <span class="q-pa-sm text-weight-bold text-black">创建时间</span>
        <span class="q-pa-sm text-grey-8">{{datenow}}</span>
      </q-card-section>
      <q-card-section class="q-pa-xs"
                      caption>
        <span class="q-pa-sm text-weight-bold text-black">单据状态</span>
        <span class="q-pa-sm text-grey-8">{{status}}</span>
      </q-card-section>

      <div class="q-pt-md q-pa-sm">
        <q-table virtual-scroll
                 flat
                 :data="rtvData"
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
                    key="supplier"
                    :props="props">{{ props.row.supplier }}</q-td>
              <q-td class="rcvtd"
                    key="quantity"
                    :props="props">{{ props.row.quantity }}</q-td>
              <q-td class="rcvtd"
                    key="unitCost"
                    :props="props">{{ props.row.unitCost }}</q-td>
              <q-td class="rcvtd"
                    key="returnReason"
                    :props="props">{{ props.row.returnReason }}</q-td>
            </q-tr>
          </template>
        </q-table>
      </div>

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
            <q-btn class="btn-primary"
                   @click="close()"
                   label="否" />
            <q-btn class="btn-primary"
                   @click="comfirm()"
                   label="是" />
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
            <q-btn class="btn-primary"
                   @click="rejectClose()"
                   label="否" />
            <q-btn class="btn-primary"
                   @click="rejectComfirm()"
                   label="是" />
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
      rejectFlag: false,
      TipsFlag: false,
      itemOrBarcode: null,
      datenow: null,
      rtvId: null,
      rcvedpagination: {
        page: 1,
        rowsPerPage: 0
      },
      rtvData: [],
      columns: [
        { name: 'itemId', align: 'left', label: '商品编码', field: 'itemId', sortable: true },
        { name: 'description', align: 'left', label: '商品描述', field: 'description' },
        { name: 'supplier', align: 'left', label: '供应商', field: 'supplier' },
        { name: 'quantity', align: 'left', label: '申请数量', field: 'quantity' },
        { name: 'unitCost', align: 'left', label: '退货成本', field: 'unitCost' },
        { name: 'returnReason', align: 'left', label: '退货原因', field: 'returnReason' }
      ],
      status: null
    }
  },
  created () {
    this.CHANGE_TITLE('审批')
    this.rtvId = this.$route.query.rtvId
    this.GetReturnIntentionById(this.rtvId)
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_GO', 'BTN_PAGE', 'CHANGE_TITLE', 'RETURNFALSE']),
    GetReturnIntentionById (id) {
      this.$api.Rtv.GetReturnIntentionById(id).then(res => {
        if (res.data.code > 0) {
          this.datenow = res.data.data.createdDate.slice(0, 10)
          this.status = this.formatStatus(res.data.data.status)
          this.rtvData = res.data.data.returnIntentionLines.map(val => {
            let json = {}
            json.id = val.id
            json.itemId = val.item.id
            json.description = val.item.description
            json.supplier = val.supplier.name
            json.quantity = val.quantity
            json.unitCost = val.unitCost
            json.returnReason = val.returnReason.description
            return json
          })
        } else {
          this.POP_MSG(res.data.msg)
        }
      })
    },
    ApprovalBtn () {
      this.TipsFlag = true
    },
    close () {
      this.TipsFlag = false
    },
    comfirm () { // 退货申请单确认审批
      this.TipsFlag = false
      this.$api.Rtv.ReturnIntentionApproval(this.rtvId).then(res => {
        console.log(res)
        if (res.data.code > 0) {
          this.$router.go(-1)
        } else {
          this.POP_MSG(res.data.msg)
        }
      })
    },
    rejectBtn () {
      this.rejectFlag = true
    },
    rejectClose () {
      this.rejectFlag = false
    },
    rejectComfirm () { // 退货申请单拒绝审批
      this.rejectFlag = false
      this.$api.Rtv.ReturnIntentionReject(this.rtvId).then(res => {
        if (res.data.code > 0) {
          this.$router.go(-1)
        } else {
          this.POP_MSG(res.data.msg)
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
