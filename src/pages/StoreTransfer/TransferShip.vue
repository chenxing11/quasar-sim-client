<template>
  <q-page class="orderlist">
    <q-list class="q-pa-xs">
      <q-item-section>

        <q-card-section
          class="q-pa-xs"
          caption
        >
          <span class="q-pa-sm text-weight-bold text-black">申请门店</span>
          <span class="q-pa-sm text-grey-8">{{ toLocationLabel }}</span>
        </q-card-section>

        <q-card-section
          v-if="shipData.externalNo !== null"
          class="q-pa-xs"
          caption
        >
          <span class="q-pa-sm text-weight-bold text-black">外部单据编号</span>
          <span class="q-pa-sm text-grey-8">{{ shipData.externalNo }}</span>
        </q-card-section>

        <q-card-section
          class="q-pa-xs"
          caption
        >
          <span class="q-pa-sm text-weight-bold text-black">收货编号</span>
          <span class="q-pa-sm text-grey-8">{{ shipData.id }}</span>
        </q-card-section>

        <q-card-section
          class="q-pa-xs"
          caption
        >
          <span class="q-pa-sm text-weight-bold text-black">收货品项数</span>
          <span class="q-pa-sm text-grey-8">{{ shipList.length }}</span>
        </q-card-section>

        <q-card-section
          class="q-pa-xs"
          caption
        >
          <span class="q-pa-sm text-weight-bold text-black">申请时间</span>
          <span class="q-pa-sm text-grey-8">{{ shipData.createdDate.substring(0, 10) }}</span>
        </q-card-section>

        <q-card-section
          class="q-pa-xs"
          caption
        >
          <span class="q-pa-sm text-weight-bold text-black">已添加品项数</span>
          <span class="q-pa-sm text-grey-8">{{ shipNo }}</span>
        </q-card-section>
      </q-item-section>

      <div class="q-pt-md q-pa-sm items-center">
        <q-form
          @submit="RETURNFALSE()"
          @keydown.enter="getitem(itemOrBarcode)"
          class="orderinput"
        >
          <q-input
            autofocus
            dense
            outlined
            v-model.number="itemOrBarcode"
            label="扫描商品"
          >
            <template v-slot:append>
              <q-icon
                name="close"
                @click="itemOrBarcode = null"
                class="cursor-pointer"
              />
            </template>
          </q-input>
        </q-form>
      </div>

      <div class="q-pt-md q-pa-sm">
        <q-table
          table-style="max-height: 300px"
          virtual-scroll
          flat
          :data="shipList"
          :pagination.sync="rcvedpagination"
          :rows-per-page-options=[0]
          :columns="columns"
        >
          <template v-slot:body="props">
            <q-tr class="allRcv">
              <q-td
                class="rcvtd"
                key="itemId"
                :props="props"
              >{{ props.row.itemId }}</q-td>
              <q-td
                class="rcvtd"
                key="description"
                :props="props"
              >{{ props.row.description }}</q-td>
              <q-td
                class="rcvtd"
                key="primaryBarcode"
                :props="props"
              >{{ props.row.primaryBarcode }}</q-td>
              <q-td
                class="rcvtd"
                key="requestQty"
                :props="props"
              >{{ props.row.requestQty }}</q-td>
              <q-td
                class="rcvtd"
                key="acceptQty"
                :props="props"
              >{{ props.row.acceptQty }}</q-td>
              <!-- <q-td class="rcvtd"
                    key="shipQty"
                    :props="props">{{ props.row.shipQty }}</q-td> -->
              <q-td
                class="rcvtd"
                key="shipQty"
                :props="props"
              >
                <div class="text-pre-wrap">{{ props.row.shipQty }}</div>
                <q-popup-edit v-model="props.row.shipQty">
                  <q-input
                    type="number"
                    v-model="props.row.shipQty"
                    @keydown.enter="commodityInfo(props.row)"
                    dense
                    autofocus
                  />
                </q-popup-edit>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>

      <div class="rcv-btn row">
        <div class="text-grey-8 q-gutter-xs q-py-md">
          <q-btn
            dense
            class="btn-primary"
            @click="cancelBtn()"
            label="调拨退回"
          />
        </div>
        <div class="text-grey-8 q-gutter-xs q-pa-md">
          <q-btn
            dense
            class="btn-primary"
            @click="acceptBtn()"
            label="调拨发运"
          />
        </div>
      </div>

      <q-dialog v-model="commodityFlag">
        <q-card
          class="q-pa-md"
          style="width:100%"
        >
          <q-card-section
            v-if="shipData.externalNo !== null"
            class="q-pa-xs q-pb-md"
            caption
          >
            <span class="q-pa-sm text-weight-bold text-black">外部单据编号</span>
            <span class="q-pa-sm text-grey-8">{{ shipData.externalNo }}</span>
          </q-card-section>

          <q-card-section
            class="q-pa-xs q-pb-md"
            caption
          >
            <span class="q-pa-sm text-weight-bold text-black">已添加品项数</span>
            <span class="q-pa-sm text-grey-8">{{ shipList.length }}</span>
          </q-card-section>
          <q-separator inset />

          <q-card-section
            class="q-pa-xs q-pt-md"
            caption
          >
            <span class="q-pa-sm text-weight-bold text-black">商品编号</span>
            <span class="q-pa-sm text-grey-8">{{ commodity.itemId }}</span>
          </q-card-section>

          <q-card-section
            class="q-pa-xs"
            caption
          >
            <span class="q-pa-sm text-weight-bold text-black">商品描述</span>
            <span class="q-pa-sm text-grey-8">{{ commodity.description }}</span>
          </q-card-section>

          <q-form
            @submit="RETURNFALSE()"
            @keydown.enter="qtyRule(shipQty)"
          >
            <q-card-actions
              class="q-pa-xs"
              style="width:100%"
              caption
              line="1"
            >
              <span class="InputLabel q-pa-sm text-weight-bold text-black">发运数量</span>
              <q-input
                id="adjQtyInput"
                :input-style="{ 'text-align': 'center', 'width' : '120px' }"
                color="black"
                autofocus
                :suffix=" item.uom"
                v-model.number="shipQty"
                :dense="true"
              />
            </q-card-actions>
          </q-form>

          <div class="row items-center justify-end">
            <div class="text-grey-8 q-gutter-xs q-py-md">
              <q-btn
                dense
                class="btn-primary"
                @click="detailsView()"
                label="查看明细"
              />
            </div>
            <div class="text-grey-8 q-gutter-xs q-pa-md">
              <q-btn
                dense
                @click="qtyRule(shipQty)"
                class="btn-primary"
                label="继续扫描"
              />
            </div>
          </div>
        </q-card>
      </q-dialog>

      <q-dialog v-model="sendFlag">
        <q-card style="width:200px">
          <q-card-section class="row items-center justify-center">
            <div class="text-h6">是否调拨发运</div>
          </q-card-section>
          <div class="row justify-center">是否发运当前调拨单?</div>
          <div class="q-mb-md q-mt-md justify-around row">
            <q-btn
              class="btn-primary"
              @click="close()"
              label="否"
            />
            <q-btn
              class="btn-primary"
              @click="confirmSubmit()"
              label="是"
            />
          </div>
        </q-card>
      </q-dialog>

      <q-dialog
        v-model="printFinish"
        persistent
      >
        <q-card class="poptip">
          <q-card-section
            align="center"
            class="text-h6"
          >发送已完成</q-card-section>
          <q-card-section class="row justify-center">
            <span class="q-ml-sm">是否进行发运单打印？</span>
          </q-card-section>

          <q-card-actions align="center">
            <q-btn
              flat
              class="btn-negative"
              replace
              label="否"
              @click="$router.go(-2)"
              v-close-popup
            />
            <q-btn
              flat
              class="btn-primary"
              replace
              label="是"
              @click="print()"
              v-close-popup
            />
          </q-card-actions>
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
        { name: 'acceptQty', align: 'left', label: '接受数量', field: 'acceptQty' },
        { name: 'shipQty', align: 'left', label: '发运数量', field: 'shipQty' }
      ],
      item: {
        uom: ''
      },
      printFinish: false,
      sendFlag: false,
      commodityFlag: false,
      rcvedpagination: {
        page: 1,
        rowsPerPage: 0
      },
      transferId: null,
      toLocationLabel: null,
      shipData: {
        createdDate: '2016-11-19T09:59:42'
      },
      shipList: [],
      itemOrBarcode: null,
      commodity: {},
      shipQty: null,
      shipNo: 0,
      shipmentId: null,
      bolNo: null
    }
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_GO', 'BTN_PAGE', 'CHANGE_TITLE', 'RETURNFALSE']),
    GetTransferById (val) {
      this.$api.Transfer.GetTransferById(val).then(res => { // 通过转移单号获取转移单信息
        console.log(res)
        this.shipNo = 0
        if (res.data.code > 0) {
          this.shipData = res.data.data
          if (res.data.data.externalNo === null) {
            this.bolNo = res.data.data.id
          } else {
            this.bolNo = res.data.data.externalNo
          }
          this.toLocationLabel = res.data.data.toLocation.id + '-' + res.data.data.toLocation.name
          this.shipList = res.data.data.transferLines.map(val => {
            let json = {}
            json.itemId = val.itemId
            json.primaryBarcode = val.barcode
            json.description = val.item.description
            json.requestQty = val.requestQty
            json.acceptQty = val.transferQty
            json.shipQty = val.shipQty
            json.uom = val.item.uom.description
            if (val.shipQty !== null) {
              this.shipNo++
            }
            return json
          })
        }
      })
    },
    getitem (val) {
      if (val === null || val === '') {
        this.POP_MSG('商品不能为空')
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
      console.log(val)
      if (val.uom === '公斤') {
        if (val.shipQty < 0) {
          this.POP_MSG('发运数量不可为负数')
        } else {
          this.StoreTransferItemShip(val)
        }
      } else {
        if (Number.isInteger(Number(val.shipQty)) === false) {
          this.POP_MSG('非称重商品，不能输入非整数')
        } else {
          if (val.shipQty < 0) {
            this.POP_MSG('发运数量不可为负数')
          } else {
            this.StoreTransferItemShip(val)
          }
        }
      }
    },
    StoreTransferItemShip (val) {
      this.$api.Transfer.StoreTransferItemShip( // 店间调拨商品发运
        this.transferId,
        val.itemId,
        val.primaryBarcode,
        val.shipQty
      ).then(res => {
        if (res.data.code > 0) {
          this.GetTransferById(this.transferId)
        } else {
          this.POP_MSG(res.data.msg)
        }
      })
    },
    qtyRule () {
      if (this.commodity.sellingUom === '公斤') {
        if (this.shipQty < 0) {
          this.POP_MSG('发运数量不可为负数')
        } else {
          this.scanBarCode()
        }
      } else {
        if (Number.isInteger(this.shipQty) === false) {
          this.POP_MSG('非称重商品，不能输入非整数')
        } else {
          if (this.shipQty < 0) {
            this.POP_MSG('发运数量不可为负数')
          } else {
            this.scanBarCode()
          }
        }
      }
    },
    scanBarCode () {
      this.$api.Transfer.StoreTransferItemShip( // 店间调拨商品发运
        this.transferId,
        this.commodity.itemId,
        this.commodity.primaryBarcode,
        this.shipQty
      ).then(res => {
        console.log(res)
        if (res.data.code > 0) {
          this.commodityFlag = false
          this.shipQty = null
          this.GetTransferById(this.transferId)
        } else {
          this.POP_MSG(res.data.msg)
          this.GetTransferById(this.transferId)
        }
      })
    },
    confirmSubmit () {
      this.$api.Transfer.StoreTransferShip(this.transferId).then(res => { // 店间调拨发运
        console.log(res)
        if (res.data.code > 0) {
          this.sendFlag = false
          this.GetShipmentByBolNo()
          this.printFinish = true
        } else {
          this.POP_MSG(res.data.msg)
        }
      })
    },
    cancelBtn () {
      this.$api.Transfer.StoreTransferShipCancel(this.transferId).then(res => { // 店间调拨发运取消
        console.log(res)
        if (res.data.code > 0) {
          this.$router.go(-2)
        } else {
          this.POP_MSG(res.data.msg)
        }
      })
    },
    print () {
      let p = JSON.parse(localStorage.getItem('printer'))
      let printdata = {
        id: this.shipmentId,
        printer: p.printer,
        token: localStorage.getItem('Authorization'),
        printlink: 'Sts',
        reprint: 0,
        width: this._.isNull(p.p_width) ? this.$store.state.p_width + 'cm' : p.p_width + 'cm',
        height: this._.isNull(p.p_height) ? this.$store.state.p_height + 'cm' : p.p_height + 'cm',
        top: this._.isNull(p.p_top) ? this.$store.state.p_top + 'cm' : p.p_top + 'cm',
        left: this._.isNull(p.p_left) ? this.$store.state.p_left + 'cm' : p.p_left + 'cm',
        right: this._.isNull(p.p_right) ? this.$store.state.p_right + 'cm' : p.p_right + 'cm',
        bottom: this._.isNull(p.p_bottom) ? this.$store.state.p_bottom + 'cm' : p.p_bottom + 'cm'
      }
      console.log(printdata)
      this.$api.Print.P_Rcv(printdata).then(res => {
        console.log(res)
        if (res.data.code === 0) {
          console.log(res.data.data)
          this.NotiSuccess('验货清单已打印')
        } else {
          console.log(res.data.data)
        }
        this.$router.go(-2)
      })
    },
    detailsView () {
      this.commodityFlag = false
      this.shipQty = null
    },
    acceptBtn () {
      this.sendFlag = true
    },
    close () {
      this.sendFlag = false
    },
    GetShipmentByBolNo () { // 通过Bol编号获取发运信息
      console.log(this.bolNo)
      this.$api.Ship.GetShipmentByBolNo(this.bolNo).then(res => {
        console.log(res)
        if (res.data.code > 0) {
          this.shipmentId = res.data.data.id
        }
      })
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
