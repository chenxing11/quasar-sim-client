<template>
  <q-page class="orderlist">
    <q-list class="q-pa-xs">
      <q-card-section class="q-pa-xs">
        <span class="q-pa-sm text-weight-bold text-black">返仓单编号</span>
        <span>{{rtwId}}</span>
      </q-card-section>
      <q-card-section class="q-pa-xs"
                      caption>
        <span class="q-pa-sm text-weight-bold text-black">创建时间</span>
        <span class="q-pa-sm text-grey-8">{{datenow}}</span>
      </q-card-section>
      <q-card-section class="q-pa-xs"
                      caption>
        <span class="q-pa-sm text-weight-bold text-black">状态</span>
        <span class="q-pa-sm text-grey-8">工作表</span>
      </q-card-section>
      <!-- <q-select class="q-pa-xs" outlined  dense style="width:280px;" v-model="ReturnReasons" :options="ReturnReasonsList">
        <template v-slot:before>
          <span class="q-pa-sm text-weight-bold text-black" style="font-size:14px; ">返仓原因</span>
        </template>
      </q-select> -->

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
                 :data="rtwData"
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
        <div class="text-grey-8 q-gutter-xs q-pa-md">
          <q-btn dense
                 @click="RtwSubmit()"
                 class="btn-primary"
                 label="提交" />
        </div>
      </div>

      <q-dialog v-model="itemFlag">
        <q-card class="q-pa-md"
                style="width:100%">
          <q-card-section class="q-pa-xs q-pt-md" caption>
            <span class="q-pa-sm text-weight-bold text-black">商品编号</span>
            <span class="q-pa-sm text-grey-8">{{returnItemInfo.itemId}}</span>
          </q-card-section>

          <q-card-section class="q-pa-xs" caption>
            <span class="q-pa-sm text-weight-bold text-black">商品描述</span>
            <span class="q-pa-sm text-grey-8">{{returnItemInfo.description}}</span>
          </q-card-section>
          <q-card-section class="q-pa-xs" caption>
            <span class="q-pa-sm text-weight-bold text-black">供应商</span>
            <span class="q-pa-sm text-grey-8">{{returnItemInfo.primarySupplierName+' '+ returnItemInfo.primarySupplierId}}</span>
          </q-card-section>

          <q-card-section class="q-pa-xs row items-center" caption>
            <span class="q-pa-sm text-weight-bold text-black">返仓原因</span>
            <q-select v-model="ReturnReasons" style="width:180px" :options="ReturnReasonsList"/>
          </q-card-section>

          <q-card-section class="q-pa-xs row items-center" caption>
            <span class="q-pa-sm text-weight-bold text-black">申请数量</span>
            <q-input id="adjQtyInput"
                       :input-style="{ 'text-align': 'center', 'width' : '180px' }"
                       color="black"
                       @keydown.enter="comfirmBtn()"
                       type="number"
                       v-model.number="quantity"
                       :dense="true" />
          </q-card-section>

          <q-item class="q-pa-none q-py-sm">
            <q-card-section class="q-pa-xs" caption>
              <span class="q-pa-sm text-weight-bold text-black">可用库存</span>
              <span class="q-pa-sm text-grey-8">{{returnItemInfo.availableQty}}</span>
            </q-card-section>
            <q-card-section class="q-pa-xs" caption>
              <span class="q-pa-sm text-weight-bold text-black">转移预留</span>
              <span class="q-pa-sm text-grey-8">{{returnItemInfo.tsfReservedQty}}</span>
            </q-card-section>
          </q-item>
          <q-item class="q-pa-none q-py-sm">
            <q-card-section class="q-pa-xs" caption>
              <span class="q-pa-sm text-weight-bold text-black">仓库最后到货价</span>
              <span class="q-pa-sm text-grey-8">{{returnItemInfo.warehouseCost}}</span>
            </q-card-section>
            <q-card-section class="q-pa-xs" caption>
              <span class="q-pa-sm text-weight-bold text-black">返仓成本</span>
              <span class="q-pa-sm text-grey-8">{{returnItemInfo.avCost}}</span>
            </q-card-section>
          </q-item>
          <q-item class="q-pa-none q-py-sm">
            <q-card-section class="q-pa-xs" caption>
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
            <div class="text-h6">库存调整</div>
          </q-card-section>
          <div class="row justify-center">是否提交当前库存调整单?</div>
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
      rtwId: null,
      rcvedpagination: {
        page: 1,
        rowsPerPage: 0
      },
      rtwData: [],
      columns: [
        { name: 'itemId', align: 'left', label: '商品编码', field: 'itemId', sortable: true },
        { name: 'description', align: 'left', label: '商品描述', field: 'description' },
        { name: 'supplier', align: 'left', label: '供应商', field: 'supplier' },
        { name: 'quantity', align: 'left', label: '申请数量', field: 'quantity' },
        { name: 'unitCost', align: 'left', label: '返仓成本', field: 'unitCost' },
        { name: 'returnReason', align: 'left', label: '返仓原因', field: 'returnReason' }
      ],
      LocationId: null,
      returnItemInfo: {},
      ReturnReasonsList: [
        { value: 'S', label: '门店原因' },
        { value: 'V', label: '供应商原因' },
        { value: 'WH', label: '仓库原因' }
      ],
      ReturnReasons: { value: null, label: null },
      quantity: null
    }
  },
  created () {
    this.CHANGE_TITLE('新建返仓')
    this.LocationId = this.$store.state.location.id
    this.rtwId = this.$route.query.rtwId
    if (this.rtwId !== null) {
      this.datenow = this.$route.query.createdDate
      this.GetReturnToWhById(this.rtwId)
    } else {
      this.datenow = date.formatDate(timeStamp, 'YYYY-MM-DD')
    }
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
            this.$api.Rtw.GetItemInfoForReturnToWh(this.LocationId, id).then(res => {
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
          this.CreateReturnToWh()
        } else {
          if (Number.isInteger(this.quantity) === false) {
            this.POP_MSG('非称重商品，不能输入非整数')
          } else {
            this.CreateReturnToWh()
          }
        }
      }
    },
    CreateReturnToWh () { // 创建申请单头
      if (this.rtwId === null) {
        this.$api.Rtw.CreateReturnToWh(this.LocationId).then(res => { // 创建申请单头
          console.log(res)
          if (res.data.code > 0) {
            this.rtwId = res.data.code
            this.CreateOrUpdateReturnToWhLine()
          }
        })
      } else {
        this.CreateOrUpdateReturnToWhLine()
      }
    },
    CreateOrUpdateReturnToWhLine () { // 创建申请单行
      this.$api.Rtw.CreateOrUpdateReturnToWhLine(
        this.rtwId,
        this.returnItemInfo.toLocationId,
        this.returnItemInfo.itemId,
        this.returnItemInfo.primarySupplierId,
        this.ReturnReasons.value,
        this.quantity,
        this.returnItemInfo.avCost
      ).then(res => {
        console.log(res)
        if (res.data.code > 0) {
          this.itemFlag = false
          this.quantity = null
          this.ReturnReasons = { value: null, label: null }
          this.GetReturnToWhById(this.rtwId)
        } else {
          this.POP_MSG(res.data.msg)
        }
      })
    },
    GetReturnToWhById (id) { // 根据Id获取申请单
      this.$api.Rtw.GetReturnToWhById(id).then(res => {
        console.log(res)
        if (res.data.code > 0) {
          this.rtwData = res.data.data.returnToWhLines.map(val => {
            let json = {}
            json.id = val.id
            json.itemId = val.item.id
            json.description = val.item.description
            json.supplier = val.supplier.name
            json.quantity = val.quantity
            json.unitCost = val.unitCost
            json.returnReason = this.formatReason(val.reason)
            return json
          })
        } else {
          this.POP_MSG(res.data.msg)
        }
      })
    },
    DeleteBtn (row) {
      this.$api.Rtw.RemoveReturnToWhLineById(row.id).then(res => {
        console.log(res)
        if (res.data.code > 0) {
          this.GetReturnToWhById(this.rtwId)
        } else {
          this.POP_MSG(res.data.msg)
        }
      })
    },
    RtwSubmit () {
      this.submitFlag = true
    },
    closeSubmit () {
      this.submitFlag = false
    },
    confirmSubmit () {
      this.submitFlag = false
      this.$api.Rtw.ReturnToWhSubmit(this.rtwId).then(res => {
        if (res.data.code > 0) {
          this.$router.go(-1)
        } else {
          this.POP_MSG(res.data.msg)
        }
      })
    },
    formatReason (val) {
      var text
      switch (val) {
        case 'S':
          text = '门店原因'
          break
        case 'V':
          text = '供应商原因'
          break
        case 'WH':
          text = '仓库原因'
          break
      }
      return text
    }
  }
}
</script>
