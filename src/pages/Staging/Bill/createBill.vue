<template>
  <q-page class="orderlist">
    <q-list class="q-pa-xs">
      <q-card-section class="q-pa-xs">
        <span class="q-pa-sm text-weight-bold text-black">出清编号</span>
        <span>{{billId}}</span>
      </q-card-section>

      <q-card-section class="q-pa-xs"
                      caption>
        <span class="q-pa-sm text-weight-bold text-black">创建时间</span>
        <span class="q-pa-sm text-grey-8">{{datenow}}</span>
      </q-card-section>

      <div class="q-pt-md q-pa-sm items-center">
        <q-form @keydown.enter="getitem(itemOrBarcode)"
                @submit="RETURNFALSE()"
                class="orderinput">
          <q-input dense
                   outlined
                   autofocus
                   v-model.number="itemOrBarcode"
                   label="商品条码">
            <template v-slot:append>
              <q-icon name="close"
                      @click="itemOrBarcode = null"
                      class="cursor-pointer" />
            </template>
          </q-input>
        </q-form>
      </div>

      <div class="q-pt-md q-pa-sm">
        <q-table table-style="max-height: 300px"
                 virtual-scroll
                 flat
                 :data="billData"
                 :pagination.sync="rcvedpagination"
                 :rows-per-page-options=[0]
                 :columns="columns">
          <template v-slot:body="props">
            <q-tr class="allRcv">
              <q-td class="rcvtd"
                    key="itemId"
                    :props="props">{{ props.row.itemId }}</q-td>
              <q-td class="rcvtd"
                    key="barCode"
                    :props="props">{{ props.row.barCode }}</q-td>
              <q-td class="rcvtd"
                    key="description"
                    :props="props">{{ props.row.description }}</q-td>
              <q-td class="rcvtd"
                    key="normalPrice"
                    :props="props">{{ props.row.normalPrice }}</q-td>
              <q-td class="rcvtd"
                    key="outPrice"
                    :props="props">{{ props.row.outPrice }}</q-td>
              <q-td class="rcvtd"
                    key="outQty"
                    :props="props">{{ props.row.outQty }}</q-td>
              <q-td class="rcvtd"
                    key="outRate"
                    :props="props">{{ props.row.outRate }}</q-td>
              <q-td class="rcvtd"
                    key="outCause"
                    :props="props">{{ props.row.outCause }}</q-td>
              <q-td class="rcvtd"
                    @click.native="DeleteBtn(props.row)">
                <q-icon style="fong-size:20px;"
                        name="close"
                        class="cursor-pointer" />
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>

      <div class="rcv-btn row">
        <div class="text-grey-8 q-gutter-xs q-pa-md">
          <q-btn dense
                 @click="SubmitBtn()"
                 class="btn-primary"
                 label="提交" />
        </div>
      </div>

      <q-dialog v-model="itemFlag">
        <q-card class="q-pa-md"
                style="width:100%">
          <q-card-section class="q-pa-xs q-pt-md"
                          caption>
            <span class="q-pa-sm text-weight-bold text-black">商品编号</span>
            <span class="q-pa-sm text-grey-8">11111111</span>
          </q-card-section>

          <q-card-section class="q-pa-xs"
                          caption>
            <span class="q-pa-sm text-weight-bold text-black">商品描述</span>
            <span class="q-pa-sm text-grey-8">11111111</span>
          </q-card-section>
          <q-card-section class="q-pa-xs"
                          caption>
            <span class="q-pa-sm text-weight-bold text-black">正常售价</span>
            <span class="q-pa-sm text-grey-8">11111111</span>
          </q-card-section>
          <q-card-section class="q-pa-xs"
                          caption>
            <span class="q-pa-sm text-weight-bold text-black">可用库存</span>
            <span class="q-pa-sm text-grey-8">11111111</span>
          </q-card-section>
          <q-card-section class="q-pa-xs"
                          caption>
            <span class="q-pa-sm text-weight-bold text-black">平均成本</span>
            <span class="q-pa-sm text-grey-8">11111111</span>
          </q-card-section>
          <q-card-section class="q-pa-xs"
                          caption>
            <span class="q-pa-sm text-weight-bold text-black">出清商品描述</span>
            <span class="q-pa-sm text-grey-8">11111111</span>
          </q-card-section>
          <q-card-section class="q-pa-xs"
                          caption>
            <span class="q-pa-sm text-weight-bold text-black">出清商品编码</span>
            <span class="q-pa-sm text-grey-8">11111111</span>
          </q-card-section>

          <q-card-section class="q-pa-xs row items-center"
                          caption>
            <span class="q-pa-sm text-weight-bold text-black">出清原因</span>
            <q-select v-model="outCause"
                      dense
                      style="width:180px"
                      :options="outCauseList" />
          </q-card-section>

          <q-card-section class="q-pa-xs row items-center"
                          caption>
            <span class="q-pa-sm text-weight-bold text-black">出清数量</span>
            <q-input :input-style="{ 'text-align': 'center', 'width' : '180px' }"
                     color="black"
                     type="number"
                     ref="qtyOutBill"
                     @keydown.enter="OutBill()"
                     v-model.number="qtyOutBill"
                     :dense="true" />
          </q-card-section>

          <q-card-section class="q-pa-xs row items-center"
                          caption>
            <span class="q-pa-sm text-weight-bold text-black">出清售价</span>
            <q-input :input-style="{ 'text-align': 'center', 'width' : '180px' }"
                     color="black"
                     type="number"
                     ref="outPrice"
                     @keydown.enter="OutBillPirce()"
                     v-model.number="outPrice"
                     :dense="true" />
          </q-card-section>

          <q-card-section class="q-pa-xs row items-center"
                          caption>
            <span class="q-pa-sm text-weight-bold text-black">出清毛利率</span>
            <q-input :input-style="{ 'text-align': 'center', 'width' : '180px' }"
                     color="black"
                     type="number"
                     ref="outRate"
                     v-model.number="outRate"
                     @keydown.enter="comfirmBtn()"
                     :dense="true" />
          </q-card-section>

          <div class="row items-center justify-end">
            <div class="text-grey-8 q-gutter-xs q-pa-md">
              <q-btn dense
                     class="btn-primary"
                     @click="comfirmBtn()"
                     label="确定" />
            </div>
          </div>
        </q-card>
      </q-dialog>

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
      itemFlag: false,
      itemOrBarcode: null,
      datenow: null,
      billData: [],
      rcvedpagination: {
        page: 1,
        rowsPerPage: 0
      },
      columns: [
        { name: 'itemId', align: 'left', label: '商品编码', field: 'itemId', sortable: true },
        { name: 'barCode', align: 'left', label: '出清条码', field: 'barCode' },
        { name: 'description', align: 'left', label: '出清描述', field: 'description' },
        { name: 'normalPrice', align: 'left', label: '正常售价', field: 'normalPrice' },
        { name: 'outPrice', align: 'left', label: '出清售价', field: 'outPrice' },
        { name: 'outQty', align: 'left', label: '出清数量', field: 'outQty' },
        { name: 'outRate', align: 'left', label: '出清毛利率', field: 'outRate' },
        { name: 'outCause', align: 'left', label: '出清原因', field: 'outCause' }
      ],
      qtyOutBill: null,
      outPrice: null,
      outRate: null,
      outCause: null,
      outCauseList: []
    }
  },
  created () {
    this.CHANGE_TITLE('新建出清')
    this.LocationId = this.$store.state.location.id
    this.billId = this.$route.query.billId
    if (this.billId !== null) {
      this.datenow = this.$route.query.createdDate
      // this.GetInventoryAdjustById(this.inventoryAdjustId)
    } else {
      this.datenow = date.formatDate(timeStamp, 'YYYY-MM-DD')
    }
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_GO', 'BTN_PAGE', 'CHANGE_TITLE', 'RETURNFALSE']),
    getitem () {
      this.itemFlag = true
    },
    SubmitBtn () {

    },
    DeleteBtn () {

    },
    comfirmBtn () {
      this.itemFlag = false
    },
    OutBill () {
      this.$refs.outPrice.focus()
    },
    OutBillPirce () {
      this.$refs.outRate.focus()
    }
  }
}
</script>
