<template>
  <q-page class="orderlist">
    <q-list class="q-pa-xs">
      <q-card-section class="q-pa-xs">
        <span class="q-pa-sm text-weight-bold text-black">退单编号</span>
        <span>{{rtvId}}</span>
      </q-card-section>
      <q-card-section class="q-pa-xs"
                      caption>
        <span class="q-pa-sm text-weight-bold text-black">创建时间</span>
        <span class="q-pa-sm text-grey-8">{{datenow}}</span>
      </q-card-section>
      <q-card-section class="q-pa-xs"
                      caption>
        <span class="q-pa-sm text-weight-bold text-black">单据状态</span>
        <span class="q-pa-sm text-grey-8">工作表</span>
      </q-card-section>

      <div class="q-pt-md q-pa-sm items-center">
        <q-form @keydown.enter="getitem(itemOrBarcode)"
                @submit="RETURNFALSE()"
                class="orderinput">
          <q-input ref="scan"
                   dense
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
        <!-- <div class="text-grey-8 q-gutter-xs q-py-md">
          <q-btn dense
                 @click="cancelTransferRequest()"
                 class="btn-primary"
                 label="取消调拨" />
        </div> -->
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
            <span class="q-pa-sm text-grey-8">{{returnItemInfo.itemId}}</span>
          </q-card-section>

          <q-card-section class="q-pa-xs"
                          caption>
            <span class="q-pa-sm text-weight-bold text-black">商品描述</span>
            <span class="q-pa-sm text-grey-8">{{returnItemInfo.description}}</span>
          </q-card-section>
          <q-card-section class="q-pa-xs"
                          caption>
            <span class="q-pa-sm text-weight-bold text-black">供应商</span>
            <span class="q-pa-sm text-grey-8">{{returnItemInfo.primarySupplierName+' '+ returnItemInfo.primarySupplierId}}</span>
          </q-card-section>

          <q-card-section class="q-pa-xs row items-center"
                          caption>
            <span class="q-pa-sm text-weight-bold text-black">退货原因</span>
            <q-select v-model="ReturnReasons"
                      style="width:180px"
                      :options="ReturnReasonsList" />
          </q-card-section>

          <q-card-section class="q-pa-xs row items-center"
                          caption>
            <span class="q-pa-sm text-weight-bold text-black">申请数量</span>
            <q-input id="adjQtyInput"
                     :input-style="{ 'text-align': 'center', 'width' : '180px' }"
                     color="black"
                     ref="qtyAdjusted"
                     @keydown.enter="comfirmBtn()"
                     type="number"
                     v-model.number="quantity"
                     :dense="true" />
          </q-card-section>

          <q-item class="q-pa-none q-py-sm">
            <q-card-section class="q-pa-xs"
                            caption>
              <span class="q-pa-sm text-weight-bold text-black">可用库存</span>
              <span class="q-pa-sm text-grey-8">{{returnItemInfo.availableQty}}</span>
            </q-card-section>
            <q-card-section class="q-pa-xs"
                            caption>
              <span class="q-pa-sm text-weight-bold text-black">退货预留</span>
              <span class="q-pa-sm text-grey-8">{{returnItemInfo.rtvQty}}</span>
            </q-card-section>
          </q-item>
          <q-item class="q-pa-none q-py-sm">
            <q-card-section class="q-pa-xs"
                            caption>
              <span class="q-pa-sm text-weight-bold text-black">转移预留</span>
              <span class="q-pa-sm text-grey-8">{{returnItemInfo.tsfReservedQty}}</span>
            </q-card-section>
            <q-card-section class="q-pa-xs"
                            caption>
              <span class="q-pa-sm text-weight-bold text-black">退货成本</span>
              <span class="q-pa-sm text-grey-8">{{returnItemInfo.lastReceiptCost}}</span>
            </q-card-section>
          </q-item>
          <q-item class="q-pa-none q-py-sm">
            <q-card-section class="q-pa-xs"
                            caption>
              <span class="q-pa-sm text-weight-bold text-black">不可用库存</span>
              <span class="q-pa-sm text-grey-8">{{returnItemInfo.nonSellableQty}}</span>
            </q-card-section>
          </q-item>

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
      <q-dialog v-model="submitFlag">
        <q-card style="width:200px">
          <q-card-section class="row items-center justify-center">
            <div class="text-h6">退货申请</div>
          </q-card-section>
          <div class="row justify-center">是否提交当前退货申请单?</div>
          <div class="q-mb-md q-mt-md justify-around row">
            <q-btn class="btn-primary"
                   @click="closeSubmit()"
                   label="否" />
            <q-btn class="btn-primary"
                   @click="confirmSubmit()"
                   label="是" />
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
      submitFlag: false,
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
      LocationId: null,
      returnItemInfo: {},
      ReturnReasonsList: [],
      ReturnReasons: { value: null, label: null },
      quantity: null
    }
  },
  created () {
    this.CHANGE_TITLE('新建退单')
    // this.datenow = date.formatDate(timeStamp, 'YYYY-MM-DD')
    this.LocationId = this.$store.state.location.id
    this.rtvId = this.$route.query.rtvId
    if (this.rtvId !== null) {
      this.datenow = this.$route.query.createdDate
      this.GetReturnIntentionById(this.rtvId)
    } else {
      this.datenow = date.formatDate(timeStamp, 'YYYY-MM-DD')
    }
    this.ListAllReturnReasons()
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_GO', 'BTN_PAGE', 'CHANGE_TITLE', 'RETURNFALSE']),
    getitem (itemOrBarcode) {
      if (itemOrBarcode === '' || itemOrBarcode === null) {
        this.POP_MSG('条码/货号不能为空')
      } else {
        this.$api.Rcv.getitem(this.LocationId, itemOrBarcode).then(response => {
          console.log(response)
          if (response.data.code > 0) {
            this.itemOrBarcode = null
            let id = response.data.data.item.id
            this.$api.Rtw.GetItemInfoForReturnIntention(this.LocationId, id).then(res => {
              console.log(res)
              if (res.data.code > 0) {
                this.itemFlag = true
                var data = {}
                data = res.data.data
                data.itemId = response.data.data.item.id
                data.description = response.data.data.item.description
                data.uom = response.data.data.item.uom.description
                this.returnItemInfo = data
              } else {
                this.POP_MSG(res.data.msg)
              }
            })
          } else {
            this.POP_MSG(response.data.msg)
          }
        })
      }
    },
    comfirmBtn () {
      if (this.quantity === null || this.quantity === '') {
        this.POP_MSG('申请数量不能为空')
      } else if (this.quantity <= 0) {
        this.POP_MSG('申请数量不能小于或等于0')
        this.quantity = null
      } else if (this.ReturnReasons.value === null) {
        this.POP_MSG('请选择退货原因')
      } else if (this.quantity > this.returnItemInfo.availableQty) {
        this.POP_MSG('申请数量不能大于可用库存')
        this.quantity = null
      } else {
        if (this.returnItemInfo.uom === '公斤') {
          this.quantity = this.Number2(this.quantity)
          this.CreateReturnIntention()
        } else {
          if (Number.isInteger(this.quantity) === false) {
            this.POP_MSG('非称重商品，不能输入非整数')
          } else {
            this.CreateReturnIntention()
          }
        }
      }
    },
    CreateReturnIntention () { // 创建申请单头
      if (this.rtvId === null) {
        this.$api.Rtv.CreateReturnIntention(this.LocationId).then(res => {
          console.log(res)
          if (res.data.code > 0) {
            this.rtvId = res.data.code
            this.CreateOrUpdateReturnIntentionLine()
          }
        })
      } else {
        this.CreateOrUpdateReturnIntentionLine()
      }
    },
    CreateOrUpdateReturnIntentionLine () { // 创建申请单行
      this.$api.Rtv.CreateOrUpdateReturnIntentionLine(
        this.rtvId,
        this.returnItemInfo.itemId,
        this.returnItemInfo.primarySupplierId,
        this.quantity,
        this.returnItemInfo.lastReceiptCost,
        this.ReturnReasons.value
      ).then(res => {
        console.log(res)
        if (res.data.code > 0) {
          this.itemFlag = false
          this.quantity = null
          this.ReturnReasons = { value: null, label: null }
          this.GetReturnIntentionById(this.rtvId)
        }
      })
    },
    GetReturnIntentionById (id) { // 根据Id获取退货申请单
      this.$api.Rtv.GetReturnIntentionById(id).then(res => {
        console.log(res)
        if (res.data.code > 0) {
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
    DeleteBtn (row) { // 移除退货申请单行
      this.$api.Rtv.RemoveReturnIntentionLineById(row.id).then(res => {
        console.log(res)
        if (res.data.code > 0) {
          this.GetReturnIntentionById(this.rtvId)
        }
      })
    },
    SubmitBtn () {
      this.submitFlag = true
    },
    closeSubmit () {
      this.submitFlag = false
    },
    confirmSubmit () { // 提交申请单
      this.submitFlag = false
      this.$api.Rtv.ReturnIntentionSubmit(this.rtvId).then(res => {
        console.log(res)
        if (res.data.code > 0) {
          this.$router.go(-1)
        } else {
          this.POP_MSG(res.data.msg)
        }
      })
    },
    ListAllReturnReasons () { // 获取退货原因
      this.$api.Rtv.ListAllReturnReasons().then(res => {
        // console.log(res)
        if (res.data.code > 0) {
          this.ReturnReasonsList = res.data.data.map(val => {
            let json = {}
            json.value = val.id
            json.label = val.description
            return json
          }).filter(val => {
            return val.value !== 'U'
          })
          // console.log(this.ReturnReasonsList)
        }
      })
    }
  }
}
</script>
