<template>
  <q-page class="orderlist">
    <q-list class="">
      <q-item-section>
        <q-card-section class="q-pa-xs"
                        caption>
          <span class="q-pa-sm text-weight-bold text-black">申请门店</span>
          <span class="q-pa-sm text-grey-8">{{ toLocationLabel }}</span>
        </q-card-section>

        <q-card-section class="q-pa-xs"
                        caption>
          <span class="q-pa-sm text-weight-bold text-black">收货编号</span>
          <span class="q-pa-sm text-grey-8">{{ acceptData.id }}</span>
        </q-card-section>

        <q-card-section class="q-pa-xs"
                        caption>
          <span class="q-pa-sm text-weight-bold text-black">收货品项数</span>
          <span class="q-pa-sm text-grey-8">{{ acceptList.length }}</span>
        </q-card-section>

        <q-card-section class="q-pa-xs"
                        caption>
          <span class="q-pa-sm text-weight-bold text-black">申请时间</span>
          <span class="q-pa-sm text-grey-8">{{ acceptData.createdDate.substring(0, 10) }}</span>
        </q-card-section>

        <q-card-section class="q-pa-xs"
                        caption>
          <span class="q-pa-sm text-weight-bold text-black">已添加品项数</span>
          <span class="q-pa-sm text-grey-8">{{ number }}</span>
        </q-card-section>
      </q-item-section>

      <div class="q-pt-md q-pa-sm items-center">
        <q-form @submit="RETURNFALSE()"
                @keydown.enter="getitem(itemOrBarcode)"
                class="orderinput">
          <q-input autofocus
                   dense
                   outlined
                   v-model.number="itemOrBarcode"
                   label="扫描商品">
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
                 :data="acceptList"
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
              <!-- <q-td class="rcvtd"
                    key="acceptQty"
                    :props="props">{{ props.row.acceptQty }}</q-td> -->
              <q-td class="rcvtd"
                    key="acceptQty"
                    :props="props">
                <div class="text-pre-wrap">{{ props.row.acceptQty }}</div>
                <q-popup-edit v-model="props.row.acceptQty">
                  <q-input type="number" v-model="props.row.acceptQty" @keydown.enter="commodityInfo(props.row)" dense autofocus />
                </q-popup-edit>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>

      <div class="rcv-btn row">
        <div class="text-grey-8 q-gutter-xs q-py-md">
          <q-btn dense
                 class="btn-primary"
                 @click="cancelBtn()"
                 label="调拨退回" />
        </div>
        <div class="text-grey-8 q-gutter-xs q-pa-md">
          <q-btn dense
                 class="btn-primary"
                 @click="acceptBtn()"
                 label="接受调拨" />
        </div>
      </div>

      <q-dialog v-model="commodityFlag">
        <q-card class="q-pa-md"
                style="width:100%">
          <q-card-section class="q-pa-xs q-pb-md"
                          caption>
            <span class="q-pa-sm text-weight-bold text-black">已添加品项数</span>
            <span class="q-pa-sm text-grey-8">{{ acceptList.length }}</span>
          </q-card-section>
          <q-separator inset />

          <q-card-section class="q-pa-xs q-pt-md"
                          caption>
            <span class="q-pa-sm text-weight-bold text-black">商品编号</span>
            <span class="q-pa-sm text-grey-8">{{ commodity.itemId }}</span>
          </q-card-section>

          <q-card-section class="q-pa-xs"
                          caption>
            <span class="q-pa-sm text-weight-bold text-black">商品描述</span>
            <span class="q-pa-sm text-grey-8">{{ commodity.description }}</span>
          </q-card-section>
          <q-form @submit="RETURNFALSE()"
                  @keydown.enter="qtyRule(acceptQty)">
            <q-card-actions class="q-pa-xs"
                            style="width:100%"
                            caption
                            line="1">
              <span class="InputLabel q-pa-sm text-weight-bold text-black">接收数量</span>
              <q-input id="adjQtyInput"
                       :input-style="{ 'text-align': 'center', 'width' : '120px' }"
                       color="black"
                       autofocus
                       :suffix=" item.uom"
                       v-model.number="acceptQty"
                       :dense="true" />
            </q-card-actions>
          </q-form>

          <div class="row items-center justify-end">
            <div class="text-grey-8 q-gutter-xs q-py-md">
              <q-btn dense
                     class="btn-primary"
                     @click="detailsView()"
                     label="查看明细" />
            </div>
            <div class="text-grey-8 q-gutter-xs q-pa-md">
              <q-btn dense
                     class="btn-primary"
                     @click="qtyRule(acceptQty)"
                     label="继续扫描" />
            </div>
          </div>
        </q-card>
      </q-dialog>

      <q-dialog v-model="acceptFlag">
        <q-card style="width:200px">
          <q-card-section class="row items-center justify-center">
            <div class="text-h6">是否接受调拨</div>
          </q-card-section>
          <div class="row justify-center">是否接受当前调拨单?</div>
          <div class="q-mb-md q-mt-md justify-around row">
            <q-btn class="btn-primary"
                   @click="closeBtn()"
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
export default {
  data () {
    return {
      columns: [
        { name: 'itemId', align: 'left', label: '商品编码', field: 'itemId', sortable: true },
        { name: 'description', align: 'left', label: '商品描述', field: 'description' },
        { name: 'primaryBarcode', align: 'left', label: '国际条码', field: 'primaryBarcode' },
        { name: 'requestQty', align: 'left', label: '申请数量', field: 'requestQty' },
        { name: 'acceptQty', align: 'left', label: '接受数量', field: 'acceptQty' }
      ],
      item: {
        uom: ''
      },
      acceptFlag: false,
      commodityFlag: false,
      commodity: {},
      rcvedpagination: {
        page: 1,
        rowsPerPage: 0
      },
      acceptList: [],
      acceptData: {
        createdDate: '2016-11-19T09:59:42'
      },
      transferId: null,
      toLocationLabel: null,
      fromLocationId: null,
      itemOrBarcode: null,
      acceptQty: null,
      number: 0
    }
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_GO', 'BTN_PAGE', 'CHANGE_TITLE', 'RETURNFALSE']),
    GetTransferById (val) {
      this.$api.Transfer.GetTransferById(val).then(res => { // 通过转移单号获取转移单信息
        console.log(res)
        this.number = 0
        if (res.data.code > 0) {
          this.acceptData = res.data.data
          this.toLocationLabel = res.data.data.toLocation.id + '-' + res.data.data.toLocation.name
          this.acceptList = res.data.data.transferLines.map(val => {
            let json = {}
            json.itemId = val.itemId
            json.primaryBarcode = val.barcode
            json.description = val.item.description
            json.requestQty = val.requestQty
            json.acceptQty = val.transferQty
            json.uom = val.item.uom.description
            if (val.transferQty !== null) {
              this.number++
            }
            return json
          })
        }
      })
    },
    getitem (val) {
      if (val === null || val === '') {
        this.POP_MSG('商品编号不能为空')
      } else {
        this.$api.Item.getShop(this.fromLocationId, val).then(res => { // 根据商品编码或条码获取门店商品信息
          console.log(res)
          if (res.data.code === 1) {
            this.commodityFlag = true
            this.itemOrBarcode = null
            this.commodity = res.data.data
            this.item.uom = res.data.data.sellingUom
          }
        })
      }
    },
    commodityInfo (val) {
      if (val.uom === '公斤') {
        if (val.acceptQty < 0) {
          this.POP_MSG('接受数量不可为负数')
        } else {
          this.StoreTransferItemAccept(val)
        }
      } else {
        if (Number.isInteger(Number(val.acceptQty)) === false) {
          this.POP_MSG('非称重商品，不能输入非整数')
        } else {
          if (val.acceptQty < 0) {
            this.POP_MSG('接受数量不可为负数')
          } else {
            this.StoreTransferItemAccept(val)
          }
        }
      }
    },
    StoreTransferItemAccept (val) {
      this.$api.Transfer.StoreTransferItemAccept( // 店间调拨商品接受
        this.transferId,
        val.itemId,
        val.primaryBarcode,
        val.acceptQty
      ).then(res => {
        console.log(res)
        if (res.data.code > 0) {
          this.GetTransferById(this.transferId)
        } else {
          this.POP_MSG(res.data.msg)
          this.GetTransferById(this.transferId)
        }
      })
    },
    qtyRule () {
      if (this.commodity.sellingUom === '公斤') {
        if (this.acceptQty < 0) {
          this.POP_MSG('接受数量不可为负数')
        } else {
          this.scanBarCode()
        }
      } else {
        if (Number.isInteger(this.acceptQty) === false) {
          this.POP_MSG('非称重商品，不能输入非整数')
        } else {
          if (this.acceptQty < 0) {
            this.POP_MSG('接受数量不可为负数')
          } else {
            this.scanBarCode()
          }
        }
      }
    },
    scanBarCode () {
      this.$api.Transfer.StoreTransferItemAccept( // 店间调拨商品接受
        this.transferId,
        this.commodity.itemId,
        this.commodity.primaryBarcode,
        this.acceptQty
      ).then(res => {
        console.log(res)
        if (res.data.code > 0) {
          this.commodityFlag = false
          this.acceptQty = null
          this.GetTransferById(this.transferId)
        } else {
          this.POP_MSG(res.data.msg)
          this.acceptQty = null
        }
      })
    },
    confirmSubmit () {
      this.$api.Transfer.StoreTransferAccept(this.transferId).then(res => { // 店间调拨接受
        console.log(res)
        if (res.data.code > 0) {
          this.acceptFlag = false
          this.$router.go(-2)
        } else {
          this.POP_MSG(res.data.msg)
        }
      })
    },
    cancelBtn () { // 店间调拨拒绝
      this.$api.Transfer.StoreTransferReject(this.transferId).then(res => {
        console.log(res)
        if (res.data.code > 0) {
          this.$router.go(-2)
        } else {
          this.POP_MSG(res.data.msg)
        }
      })
    },
    acceptBtn () {
      this.acceptFlag = true
    },
    closeBtn () {
      this.acceptFlag = false
    },
    detailsView () {
      this.commodityFlag = false
      this.acceptQty = null
    }
  },
  created () {
    let locationList = JSON.parse(localStorage.getItem('locationList'))
    this.fromLocationId = locationList.id
    this.transferId = this.$route.query.transferId
    this.GetTransferById(this.transferId)
  }
}
</script>
