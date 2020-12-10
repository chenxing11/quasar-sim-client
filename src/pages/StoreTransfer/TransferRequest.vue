<template>
  <q-page class="orderlist">
    <q-list class="q-pa-xs">
      <q-item-section>
        <q-card-section class="q-pa-xs"
                        caption>
          <span class="q-pa-sm text-weight-bold text-black">申请门店</span>
          <span class="q-pa-sm text-grey-8">{{toLocation}}</span>
        </q-card-section>

        <q-card-section class="q-pa-xs row items-center">
          <span class="q-pa-sm text-weight-bold text-black">接受门店</span>
          <q-input outlined
                   autofocus
                   :disable="fromLocationFlag"
                   dense
                   style="width:200px"
                   v-model="fromLocation"
                   @keydown.enter="fromLocationBtn()"
                   class="q-pa-sm text-grey-8"></q-input>
        </q-card-section>
      </q-item-section>

      <q-card-section class="q-pa-xs"
                      caption>
        <span class="q-pa-sm text-weight-bold text-black">收货编号</span>
        <span class="q-pa-sm text-grey-8">{{ transferId }}</span>
      </q-card-section>

      <q-card-section class="q-pa-xs"
                      caption>
        <span class="q-pa-sm text-weight-bold text-black">申请时间</span>
        <span class="q-pa-sm text-grey-8">{{ datenow }}</span>
      </q-card-section>

      <q-card-section class="q-pa-xs"
                      caption>
        <span class="q-pa-sm text-weight-bold text-black">已添加品项数</span>
        <span class="q-pa-sm text-grey-8">{{ RequestData.length }}</span>
      </q-card-section>

      <div class="q-pt-md q-pa-sm items-center">
        <q-form @keydown.enter="getitem(itemOrBarcode)"
                @submit="RETURNFALSE()"
                class="orderinput">
          <q-input ref="scan"
                   dense
                   outlined
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
                 :data="RequestData"
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
                    key="primaryBarcode"
                    :props="props">{{ props.row.primaryBarcode }}</q-td>
              <q-td class="rcvtd"
                    key="requestQty"
                    :props="props">{{ props.row.requestQty }}</q-td>
              <q-td class="rcvtd"
                    @click.native="deleteBtn(props.row)">
                <q-icon style="fong-size:20px;"
                        name="close"
                        class="cursor-pointer" />
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>

      <div class="rcv-btn row">
        <div class="text-grey-8 q-gutter-xs q-py-md">
          <q-btn dense
                 @click="cancelTransferRequest()"
                 class="btn-primary"
                 label="取消调拨" />
        </div>
        <div class="text-grey-8 q-gutter-xs q-pa-md">
          <q-btn dense
                 class="btn-primary"
                 @click="submitTransferRequest()"
                 label="提交调拨" />
        </div>
      </div>

      <q-dialog v-model="commodityFlag">
        <q-card class="q-pa-md"
                style="width:100%">
          <q-card-section class="q-pa-xs q-pb-md"
                          caption>
            <span class="q-pa-sm text-weight-bold text-black">已添加品项数</span>
            <span class="q-pa-sm text-grey-8">{{ RequestData.length }}</span>
          </q-card-section>
          <q-separator inset />

          <q-card-section class="q-pa-xs q-pt-md"
                          caption>
            <span class="q-pa-sm text-weight-bold text-black">商品编号</span>
            <span class="q-pa-sm text-grey-8">{{commodity.itemId}}</span>
          </q-card-section>

          <q-card-section class="q-pa-xs"
                          caption>
            <span class="q-pa-sm text-weight-bold text-black">商品描述</span>
            <span class="q-pa-sm text-grey-8">{{commodity.description}}</span>
          </q-card-section>

          <q-form @submit="RETURNFALSE()"
                  @keydown.enter="qtyRule(RequestQty)">
            <q-card-actions class="q-pa-xs"
                            style="width:100%"
                            caption
                            line="1">
              <span class="InputLabel q-pa-sm text-weight-bold text-black">申请数量</span>
              <q-input id="adjQtyInput"
                       :input-style="{ 'text-align': 'center', 'width' : '120px' }"
                       color="black"
                       autofocus
                       :suffix=" item.uom"
                       v-model.number="RequestQty"
                       :dense="true" />
            </q-card-actions>
          </q-form>

          <div class="row items-center justify-end">
            <div class="text-grey-8 q-gutter-xs q-py-md">
              <q-btn dense
                     @click="detailsView()"
                     class="btn-primary"
                     label="查看明细" />
            </div>
            <div class="text-grey-8 q-gutter-xs q-pa-md">
              <q-btn dense
                     @click="qtyRule(RequestQty)"
                     class="btn-primary"
                     label="继续扫描" />
            </div>
          </div>
        </q-card>
      </q-dialog>

      <q-dialog v-model="submitFlag">
        <q-card style="width:200px">
          <q-card-section class="row items-center justify-center">
            <div class="text-h6">是否提交调拨</div>
          </q-card-section>
          <div class="row justify-center">是否提交当前调拨单?</div>
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

      <q-dialog v-model="QtyRuleFlag">
        <q-card style="width:200px">
          <q-card-section class="row items-center">
            <div>录入数量操过999，是否确定录入</div>
            <q-space />
          </q-card-section>
          <div class="q-mb-md q-mt-md justify-around row">
            <q-btn class="btn-primary" @click="cancelQtyRule()" label="否"/>
            <q-btn class="btn-primary" @click="confirmQtyRule()" label="是"/>
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
      QtyRuleFlag: false,
      fromLocationFlag: false,
      toLocation: null, // 申请门店
      toLocationId: null,
      fromLocationId: null, // 接受门店ID
      fromLocation: null,
      itemOrBarcode: null, // 商品条码
      columns: [
        { name: 'itemId', align: 'left', label: '商品编码', field: 'itemId', sortable: true },
        { name: 'description', align: 'left', label: '商品描述', field: 'description' },
        { name: 'primaryBarcode', align: 'left', label: '国际条码', field: 'primaryBarcode' },
        { name: 'requestQty', align: 'left', label: '申请数量', field: 'requestQty' }
      ],
      rcvedpagination: {
        page: 1,
        rowsPerPage: 0
      },
      commodityFlag: false,
      submitFlag: false,
      RequestQty: null,
      item: {
        uom: ''
      },
      datenow: null,
      commodity: {},
      transferId: null,
      RequestData: [],
      listStore: [],
      createFlag: 1
    }
  },
  created () {
    this.CHANGE_TITLE('调拨申请')
    let locationList = JSON.parse(localStorage.getItem('locationList'))
    this.toLocation = locationList.label
    this.toLocationId = locationList.id
    this.transferId = this.$route.query.transferId
    if (this.transferId !== null) {
      this.datenow = this.$route.query.createdDate
    } else {
      this.datenow = date.formatDate(timeStamp, 'YYYY-MM-DD')
    }
    this.GetTransferById(this.transferId)
    this.listStores()
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_GO', 'BTN_PAGE', 'CHANGE_TITLE', 'RETURNFALSE']),
    listStores () { // 获取门店列表
      this.$api.Basic.listStores().then(res => {
        this.listStore = res.data.data.map(val => {
          if (val.type === 'S') {
            return val
          }
        })
      })
    },
    getitem (val) {
      if (this.fromLocationId === null || this.fromLocationId === '') {
        this.POP_MSG('接受门店不能为空')
      } else if (val === null || val === '') {
        this.POP_MSG('订单号不能为空')
      } else {
        this.$api.Item.getShop(this.toLocationId, val).then(res => { // 根据商品编码或条码获取门店商品信息
          if (res.data.code > 0) {
            this.$api.Item.getShop(this.fromLocationId, val).then(response => {
              if (response.data.code > 0) {
                this.commodityFlag = true
                this.itemOrBarcode = null
                this.commodity = response.data.data
                this.item.uom = response.data.data.sellingUom
                if (this.createFlag) {
                  this.TransferRequestCreate()
                }
              } else {
                this.POP_MSG(response.data.msg)
              }
            })
          } else {
            this.POP_MSG(res.data.msg)
          }
        })
      }
    },
    TransferRequestCreate () {
      this.$api.Transfer.TransferRequestCreate(this.toLocationId, this.fromLocationId).then(res => { // 店间调拨请求创建
        console.log(res)
        if (res.data.code > 0) {
          this.transferId = res.data.data.transferId
          this.fromLocationFlag = true
          this.createFlag--
        }
      })
    },
    fromLocationBtn () { // 匹配是否有该门店
      let flag = true
      for (let i = 0; i < this.listStore.length; i++) {
        if (Number(this.fromLocation) === Number(this.listStore[i].id) && Number(this.fromLocation) !== Number(this.toLocationId)) {
          this.fromLocationId = this.listStore[i].id
          this.fromLocation = this.listStore[i].id + '-' + this.listStore[i].name
          this.$nextTick(() => {
            this.$refs.scan.focus()
          })
          // this.$api.Transfer.TransferRequestCreate(this.toLocationId, this.fromLocationId).then(res => { // 店间调拨请求创建
          //   console.log(res)
          //   if (res.data.code > 0) {
          //     this.transferId = res.data.data.transferId
          //     this.fromLocationFlag = true
          //     this.$nextTick(() => {
          //       this.$refs.scan.focus()
          //     })
          //   }
          // })
          flag = true
          break
        } else {
          flag = false
        }
      }
      if (flag === false) {
        this.POP_MSG('门店错误')
      }
    },
    qtyRule () {
      if (this.commodity.sellingUom === '公斤') {
        if (this.RequestQty > 999) {
          this.QtyRuleFlag = true
        } else if (this.RequestQty < 0) {
          this.POP_MSG('盘点数量不可为负数')
        } else {
          this.RequestQty = this.Number2(this.RequestQty)
          this.confirmQtyRule()
        }
      } else {
        if (Number.isInteger(this.RequestQty) === false) {
          this.POP_MSG('非称重商品，不能输入非整数')
        } else {
          if (this.RequestQty > 999) {
            this.QtyRuleFlag = true
          } else if (this.RequestQty < 0) {
            this.POP_MSG('盘点数量不可为负数')
          } else {
            this.RequestQty = Number(this.RequestQty)
            this.confirmQtyRule()
          }
        }
      }
    },
    confirmQtyRule () {
      this.$api.Transfer.TransferItemRequest( // 店间调拨商品请求
        this.transferId,
        this.commodity.itemId,
        this.commodity.primaryBarcode,
        this.RequestQty
      ).then(res => {
        console.log(res)
        if (res.data.code > 0) {
          this.commodityFlag = false
          this.QtyRuleFlag = false
          this.RequestQty = null
          this.GetTransferById(this.transferId)
        } else {
          this.POP_MSG(res.data.msg)
          this.commodityFlag = false
          this.RequestQty = null
        }
      })
    },
    cancelQtyRule () {
      this.QtyRuleFlag = false
      this.RequestQty = null
    },
    detailsView () {
      this.commodityFlag = false
    },
    submitTransferRequest () {
      this.submitFlag = true
    },
    confirmSubmit () {
      this.$api.Transfer.SubmitStoreTransferRequest(this.transferId).then(res => { // 店间调拨申请提交
        console.log(res)
        if (res.data.code > 0) {
          this.submitFlag = false
          this.$router.go(-2)
        } else {
          this.POP_MSG(res.data.msg)
        }
      })
    },
    closeSubmit () {
      this.submitFlag = false
    },
    GetTransferById (val) {
      this.$api.Transfer.GetTransferById(val).then(res => { // 通过转移单号获取转移单信息
        console.log(res)
        if (res.data.code > 0) {
          this.RequestData = res.data.data.transferLines.map(val => {
            let json = {}
            json.itemId = val.itemId
            json.transferLineId = val.id
            json.primaryBarcode = val.barcode
            json.description = val.item.description
            json.requestQty = val.requestQty
            return json
          })
          this.fromLocationId = res.data.data.fromLocation.id
          this.fromLocation = res.data.data.fromLocation.id + '-' + res.data.data.fromLocation.name
          this.fromLocationFlag = true
          this.$nextTick(() => {
            this.$refs.scan.focus()
          })
        }
      })
    },
    deleteBtn (row) {
      this.$api.Transfer.StoreTransferItemDelete(row.transferLineId).then(res => { // 店间调拨商品删除
        console.log(res)
        if (res.data.code > 0) {
          this.GetTransferById(this.transferId)
        } else {
          this.POP_MSG(res.data.msg)
        }
      })
    },
    cancelTransferRequest () {
      this.$api.Transfer.StoreTransferRequestCancel(this.transferId).then(res => { // 店间调拨申请取消
        console.log(res)
        if (res.data.code > 0) {
          this.$router.go(-2)
        } else {
          this.POP_MSG(res.data.msg)
        }
      })
    }
  }
}
</script>
<style scoped>
</style>
