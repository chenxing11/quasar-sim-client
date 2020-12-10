<template>
  <q-page class="orderlist">
    <q-list class="q-pa-xs">
      <q-card-section class="q-pa-xs">
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
                @click="AdjustSubmit()"
                 class="btn-primary"
                 label="提交" />
        </div>
      </div>

      <q-dialog v-model="StockAdgFlag">
        <q-card class="q-pa-md"
                style="width:100%">
          <q-card-section class="q-pa-xs q-pt-md" caption>
            <span class="q-pa-sm text-weight-bold text-black">商品编号</span>
            <span class="q-pa-sm text-grey-8">{{mdse.itemId}}</span>
          </q-card-section>

          <q-card-section class="q-pa-xs" caption>
            <span class="q-pa-sm text-weight-bold text-black">商品描述</span>
            <span class="q-pa-sm text-grey-8">{{mdse.description}}</span>
          </q-card-section>

          <q-card-section class="q-pa-xs row items-center" caption>
            <span class="q-pa-sm text-weight-bold text-black">调整原因</span>
            <!-- <q-input id="adjQtyInput"
                       :input-style="{ 'text-align': 'center', 'width' : '120px' }"
                       ref="adjQtyInput"
                       color="black"
                       type="number"
                       @keydown.enter="comfirmBtn()"
                       v-model.number="AdgCause"
                       :dense="true" /> -->
            <q-select v-model="AdjustReasons" style="width:180px" :options="AdjustReasonsList"/>
          </q-card-section>

          <q-card-section class="q-pa-xs row items-center" caption>
            <span class="q-pa-sm text-weight-bold text-black">调整数量</span>
            <q-input id="adjQtyInput"
                       :input-style="{ 'text-align': 'center', 'width' : '180px' }"
                       color="black"
                       ref="qtyAdjusted"
                       @keydown.enter="comfirmBtn()"
                       type="number"
                       v-model.number="qtyAdjusted"
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
      datenow: null,
      StockAdgFlag: false,
      submitFlag: false,
      inventoryAdjustId: null,
      itemOrBarcode: null,
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
      inventoryAdjustData: [],
      AdjustReasonsList: [],
      AdjustReasons: { value: null, label: null, sign: null },
      qtyAdjusted: null,
      // itemId: null,
      // AdgCause: null,
      LocationId: null,
      mdse: {},
      LocSohInfo: {} // 库存信息
    }
  },
  watch: {
    StockAdgFlag (val) {
      if (!val) {
        this.AdjustReasons = { value: null, label: null, sign: null }
        this.qtyAdjusted = null
      }
    },
    AdjustReasons (val) {
      console.log(val)
      if (val.value !== null) {
        this.$nextTick(() => {
          this.$refs.qtyAdjusted.focus()
        })
      }
    }
  },
  created () {
    this.CHANGE_TITLE('新建库存调整')
    this.LocationId = this.$store.state.location.id
    this.inventoryAdjustId = this.$route.query.inventoryAdjustId
    if (this.inventoryAdjustId !== null) {
      this.datenow = this.$route.query.createdDate
      this.GetInventoryAdjustById(this.inventoryAdjustId)
    } else {
      this.datenow = date.formatDate(timeStamp, 'YYYY-MM-DD')
    }
    this.ListAllInventoryAdjustReasons()
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_GO', 'BTN_PAGE', 'CHANGE_TITLE', 'RETURNFALSE']),
    getitem (itemOrBarcode) { // 扫描
      if (itemOrBarcode === '') {
        this.POP_MSG('条码/货号不能为空')
      } else if (itemOrBarcode === null) {
        this.POP_MSG('条码/货号不能为空')
      } else {
        this.$api.Item.getShop(this.LocationId, itemOrBarcode).then(res => { // 获取商品信息
          console.log(res)
          if (Number(res.data.code) === 1) {
            this.itemOrBarcode = null
            this.StockAdgFlag = true
            this.mdse = res.data.data
          } else {
            this.POP_MSG(res.data.msg)
          }
        })
        this.$api.Erp.GetItemLocSoh(this.LocationId, itemOrBarcode).then(res => { // 获取库存信息
          console.log(res)
          if (res.data.code > 0) {
            this.LocSohInfo = res.data.data
          }
        })
      }
    },
    comfirmBtn () { // 确认调整数量
      if (this.qtyAdjusted === null || this.qtyAdjusted === '') {
        this.POP_MSG('调整数量不能为空')
      } else if (this.AdjustReasons.value === null) {
        this.POP_MSG('调整原因不能为空')
      } else {
        if (this.mdse.sellingUom === '公斤') {
          this.qtyAdjusted = this.Number2(this.qtyAdjusted)
          this.adjustmentFun()
        } else {
          if (Number.isInteger(this.qtyAdjusted) === false) {
            this.POP_MSG('非称重商品，不能输入非整数')
          } else {
            this.adjustmentFun()
          }
        }
      }
    },
    adjustmentFun () {
      if (this.qtyAdjusted <= 0) {
        this.POP_MSG('调整数量不能小于等于0')
        this.qtyAdjusted = null
      } else {
        if (this.AdjustReasons.sign === 'N') {
          if (this.qtyAdjusted > this.LocSohInfo.stock_on_hand) {
            this.POP_MSG('调减库存时,不能大于现有库存量')
          } else {
            this.CreateInventoryAdjust()
          }
        } else {
          this.CreateInventoryAdjust()
        }
        // this.CreateInventoryAdjust()
      }
      // if (this.AdjustReasons.sign === 'N') {
      //   if (this.qtyAdjusted >= 0) {
      //     this.POP_MSG('调整数量不能大于等于0')
      //     this.qtyAdjusted = null
      //   } else {
      //     this.CreateInventoryAdjust()
      //   }
      // } else if (this.AdjustReasons.sign === 'P') {
      //   if (this.qtyAdjusted <= 0) {
      //     this.POP_MSG('调整数量不能小于等于0')
      //     this.qtyAdjusted = null
      //   } else {
      //     this.CreateInventoryAdjust()
      //   }
      // }
    },
    CreateInventoryAdjust () { // 创建库存调整单头
      if (this.inventoryAdjustId === null) {
        this.$api.Inventory.CreateInventoryAdjust(this.LocationId).then(res => {
          console.log(res)
          if (res.data.code > 0) {
            this.inventoryAdjustId = res.data.code
            this.CreateOrUpdateInventoryAdjustLine()
          }
        })
      } else {
        this.CreateOrUpdateInventoryAdjustLine()
      }
    },
    CreateOrUpdateInventoryAdjustLine () {
      this.$api.Inventory.CreateOrUpdateInventoryAdjustLine( // 创建和更新库存调整单行
        this.inventoryAdjustId,
        this.mdse.itemId,
        this.AdjustReasons.value,
        this.qtyAdjusted,
        this.LocSohInfo.stock_on_hand,
        this.LocSohInfo.av_cost
      ).then(res => {
        console.log(res)
        this.StockAdgFlag = false
        this.AdjustReasons = { value: null, label: null, sign: null }
        this.qtyAdjusted = null
        this.GetInventoryAdjustById(this.inventoryAdjustId)
      })
    },
    GetInventoryAdjustById (id) { // 根据id获取库存调整单
      this.$api.Inventory.GetInventoryAdjustById(id).then(res => {
        console.log(res)
        if (res.data.code > 0) {
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
    DeleteBtn (row) { // 移除调整单行
      console.log(row)
      this.$api.Inventory.RemoveInventoryAdjustLineById(row.id).then(res => {
        if (res.data.code > 0) {
          this.GetInventoryAdjustById(this.inventoryAdjustId)
        }
      })
    },
    AdjustSubmit () { // 提交库存调整单
      this.submitFlag = true
      // this.$api.Inventory.InventoryAdjustSubmit(this.inventoryAdjustId).then(res => {
      //   // console.log(res)
      //   if (res.data.code > 0) {
      //     this.$router.go(-1)
      //   }
      // })
    },
    closeSubmit () {
      this.submitFlag = false
    },
    confirmSubmit () { // 提交库存调整单
      this.submitFlag = false
      this.$api.Inventory.InventoryAdjustSubmit(this.inventoryAdjustId).then(res => {
        // console.log(res)
        if (res.data.code > 0) {
          this.$router.go(-1)
        } else {
          this.POP_MSG(res.data.msg)
        }
      })
    },
    ListAllInventoryAdjustReasons () { // 获取库存调整原因
      this.$api.Inventory.ListAllInventoryAdjustReasons().then(res => {
        // console.log(res)
        this.AdjustReasonsList = res.data.data.map(val => {
          let json = {}
          json.value = val.id
          json.label = val.description
          json.sign = val.sign
          return json
        })
      })
    }
  }
}
</script>
