<template>
  <q-page class="orderlist">
    <q-list class="q-pa-xs">
      <q-card-section class="q-pa-xs">
        <span class="q-pa-sm text-weight-bold text-black">单据号</span>
        <span>{{posPriceChangeId}}</span>
      </q-card-section>
      <q-card-section class="q-pa-xs"
                      caption>
        <span class="q-pa-sm text-weight-bold text-black">创建时间</span>
        <span class="q-pa-sm text-grey-8">{{datenow}}</span>
      </q-card-section>
      <q-card-section class="q-pa-xs"
                      caption>
        <span class="q-pa-sm text-weight-bold text-black">已录入品项数</span>
        <span class="q-pa-sm text-grey-8">{{PriceChangeData.length}}</span>
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
                 :data="PriceChangeData"
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
                    key="barcode"
                    :props="props">{{ props.row.barcode }}</q-td>
              <q-td class="rcvtd"
                    key="originalSellingPrice"
                    :props="props">{{ props.row.originalSellingPrice }}</q-td>
              <q-td class="rcvtd"
                    key="posChangePrice"
                    :props="props">{{ props.row.posChangePrice }}</q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
      <div class="rcv-btn row">
        <div class="text-grey-8 q-gutter-xs q-pa-md">
          <q-btn dense
                 class="btn-primary"
                 @click="rejectBtn()"
                 label="拒绝" />
        </div>
        <div class="text-grey-8 q-gutter-xs q-py-md q-pr-md">
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
              @click="ApprovalComfirm()"
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
      columns: [
        { name: 'itemId', align: 'left', label: '商品编码', field: 'itemId', sortable: true },
        { name: 'description', align: 'left', label: '商品描述', field: 'description' },
        { name: 'barcode', align: 'left', label: '国际条码', field: 'barcode' },
        { name: 'originalSellingPrice', align: 'left', label: '原售价', field: 'originalSellingPrice' },
        { name: 'posChangePrice', align: 'left', label: '紧急变价', field: 'posChangePrice' }
      ],
      rcvedpagination: {
        page: 1,
        rowsPerPage: 0
      },
      PriceChangeData: [],
      posPriceChangeId: null,
      datenow: null,
      status: null,
      TipsFlag: false,
      rejectFlag: false
    }
  },
  created () {
    this.CHANGE_TITLE('审批')
    this.posPriceChangeId = this.$route.query.posPriceChangeId
    this.GetPosPriceChangeById(this.posPriceChangeId)
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_GO', 'BTN_PAGE', 'CHANGE_TITLE', 'RETURNFALSE']),
    GetPosPriceChangeById (id) {
      this.$api.PriceChange.GetPosPriceChangeById(id).then(res => { // 根据id获取变价单信息
        // console.log(res)
        if (res.data.code > 0) {
          this.datenow = res.data.data.createdDate.slice(0, 10)
          this.status = this.formatStatus(res.data.data.status)
          this.PriceChangeData = res.data.data.posPriceChangeLines.map(val => {
            let json = {}
            json.id = val.id
            json.itemId = val.itemId
            json.description = val.item.description
            json.barcode = val.barcode
            json.originalSellingPrice = val.originalSellingPrice
            json.posChangePrice = val.changePrice
            return json
          })
        }
      })
    },
    ApprovalBtn () {
      this.TipsFlag = true
    },
    close () {
      this.TipsFlag = false
    },
    ApprovalComfirm () {
      this.$api.PriceChange.PosPriceChangeApproval(this.posPriceChangeId).then(res => { // 变价单审批
        console.log(res)
        if (res.data.code > 0) {
          this.$router.go(-1)
        }
      })
    },
    rejectBtn () {
      this.rejectFlag = true
    },
    rejectClose () {
      this.rejectFlag = false
    },
    rejectComfirm () {
      this.$api.PriceChange.PosPriceChangeReject(this.posPriceChangeId).then(res => { // 变价单拒绝
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
