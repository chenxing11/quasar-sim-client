<template>
  <q-page class="orderlist">
    <q-list class="q-pa-xs">
      <q-card-section class="q-pa-xs">
        <span class="q-pa-sm text-weight-bold text-black">紧急变价单据号</span>
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
                 :data="PriceChangeData"
                 :pagination.sync="rcvedpagination"
                 :rows-per-page-options=[0]
                 :columns="columns">
          <template v-slot:body="props">
            <q-tr class="allRcv" @click="edit(props.row)">
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
              <q-td class="rcvtd"
                    @click.native="DeleteLineBtn(props.row)">
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
                  @click="priceChangeSubmit()"
                 class="btn-primary"
                 label="完成变价" />
        </div>
        <!-- <div class="text-grey-8 q-gutter-xs q-pa-md">
          <q-btn dense
                 class="btn-primary"
                 label="继续扫描" />
        </div> -->
      </div>
      <q-dialog v-model="itemFlag">
        <q-card class="q-pa-md"
                style="width:100%">
          <q-card-section class="q-pa-xs"
                          caption>
            <span class="q-pa-sm text-weight-bold text-black">商品编码</span>
            <span class="q-pa-sm text-grey-8">{{DataInfo.ITEMID}}</span>
          </q-card-section>
          <q-card-section class="q-pa-xs"
                          caption>
            <span class="q-pa-sm text-weight-bold text-black">国际条码</span>
            <span class="q-pa-sm text-grey-8">{{DataInfo.BARCODE}}</span>
          </q-card-section>
          <q-card-section class="q-pa-xs"
                          caption>
            <span class="q-pa-sm text-weight-bold text-black">商品描述</span>
            <span class="q-pa-sm text-grey-8">{{DataInfo.DESCRIPTION}}</span>
          </q-card-section>
          <q-card-section class="q-pa-xs"
                          caption>
            <span class="q-pa-sm text-weight-bold text-black">原价</span>
            <span class="q-pa-sm text-grey-8">{{DataInfo.ORIGINALSELLINGPRICE}}</span>
          </q-card-section>
          <q-card-section class="q-pa-xs"
                          caption>
            <span class="q-pa-sm text-weight-bold text-black">当前售价</span>
            <span class="q-pa-sm text-grey-8">{{DataInfo.SELLINGPRICE}}</span>
          </q-card-section>
          <q-card-section class="q-pa-xs"
                          caption>
            <span class="q-pa-sm text-weight-bold text-black">是否会员商品</span>
            <span class="q-pa-sm text-grey-8">{{DataInfo.isCustomer}}</span>
          </q-card-section>
          <q-card-section class="q-pa-xs"
                          caption>
            <span class="q-pa-sm text-weight-bold text-black">是否促销</span>
            <span class="q-pa-sm text-grey-8">{{DataInfo.isPromotion}}</span>
          </q-card-section>
          <q-card-section class="q-pa-xs row items-center"
                          caption>
            <span class="q-pa-sm text-weight-bold text-black">紧急变价</span>
            <q-input id="adjQtyInput"
                     :input-style="{ 'text-align': 'center', 'width' : '120px' }"
                     color="black"
                     type="number"
                     autofocus
                     v-model.number="changePrice"
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

      <q-dialog v-model="submitFlag">
        <q-card style="width:200px">
          <q-card-section class="row items-center justify-center">
            <div class="text-h6">完成变价</div>
          </q-card-section>
          <div class="row justify-center">是否提交当前商品变价?</div>
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
      itemFlag: false,
      submitFlag: false,
      itemOrBarcode: null,
      changePrice: null,
      PriceChangeData: [],
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
      LocationId: null,
      DataInfo: {},
      posPriceChangeId: null
    }
  },
  watch: {
    itemFlag (val) {
      if (!val) {
        this.changePrice = null
      }
    }
  },
  created () {
    this.CHANGE_TITLE('新建紧急变价')
    this.datenow = date.formatDate(timeStamp, 'YYYY-MM-DD')
    this.LocationId = this.$store.state.location.id
    this.posPriceChangeId = this.$route.query.posPriceChangeId
    if (this.posPriceChangeId !== null) {
      this.datenow = this.$route.query.createdDate
      this.GetPosPriceChangeById(this.posPriceChangeId)
    } else {
      this.datenow = date.formatDate(timeStamp, 'YYYY-MM-DD')
    }
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_GO', 'BTN_PAGE', 'CHANGE_TITLE', 'RETURNFALSE']),
    getitem (itemOrBarcode) {
      if (itemOrBarcode === '') {
        this.POP_MSG('条码/货号不能为空')
      } else if (itemOrBarcode === null) {
        this.POP_MSG('条码/货号不能为空')
      } else {
        this.$api.Rcv.getitem(this.LocationId, itemOrBarcode).then(response => { // 获取商品信息
          if (Number(response.data.code) === 1) {
            this.itemOrBarcode = null
            let id = response.data.data.item.id
            this.$api.PriceChange.GetPosPriceByItemId(this.LocationId, id).then(res => {
              console.log(res)
              if (res.data.code > 0) {
                this.itemFlag = true
                var data = {}
                data.BARCODE = res.data.data.BARCODE
                data.ISCUSTOMER = res.data.data.ISCUSTOMER
                data.DESCRIPTION = response.data.data.item.description
                data.ISPROMOTION = res.data.data.ISPROMOTION
                data.ITEMID = res.data.data.ITEMID
                data.NEWPRICE = res.data.data.NEWPRICE
                data.ORIGINALSELLINGPRICE = res.data.data.ORIGINALSELLINGPRICE
                data.PROMOTIONSELLINGPRICE = res.data.data.PROMOTIONSELLINGPRICE
                data.SELLINGPRICE = res.data.data.SELLINGPRICE
                data.isCustomer = data.ISCUSTOMER === 0 ? '否' : '是'
                data.isPromotion = data.ISPROMOTION === 0 ? '否' : '是'
                this.DataInfo = data
              } else {
                this.POP_MSG(res.data.msg)
              }
            })
          } else {
            this.POP_MSG(response.data.msg)
            this.itemOrBarcode = null
          }
        })
      }
    },
    comfirmBtn () {
      if (this.posPriceChangeId === null) {
        if (this.changePrice <= 0) {
          this.POP_MSG('紧急变价商品售价不能小于等于0')
          this.changePrice = null
        } else {
          this.changePrice = this.Number2(this.changePrice)
          this.$api.PriceChange.CreatePosPriceChange(this.LocationId).then(res => { // 创建变价单头
            // console.log(res)
            if (res.data.code > 0) {
              this.posPriceChangeId = res.data.code
              this.CreateOrUpdatePosPriceChangeLine()
            }
          })
        }
      } else {
        if (this.changePrice <= 0) {
          this.POP_MSG('紧急变价商品售价不能小于等于0')
          this.changePrice = null
        } else {
          this.changePrice = this.Number2(this.changePrice)
          this.CreateOrUpdatePosPriceChangeLine()
        }
      }
    },
    CreateOrUpdatePosPriceChangeLine () { // 创建变价单行
      var data = {
        posPriceChangeId: this.posPriceChangeId,
        itemId: this.DataInfo.ITEMID,
        barcode: this.DataInfo.BARCODE,
        newPrice: this.DataInfo.NEWPRICE,
        originalSellingPrice: this.DataInfo.ORIGINALSELLINGPRICE,
        sellingPrice: this.DataInfo.SELLINGPRICE,
        promotionSellingPrice: this.DataInfo.PROMOTIONSELLINGPRICE,
        isCustomerItem: this.DataInfo.ISCUSTOMER === 0 ? 'false' : 'true',
        isPromotion: this.DataInfo.ISPROMOTION === 0 ? 'false' : 'true',
        changePrice: this.changePrice
      }
      this.$api.PriceChange.CreateOrUpdatePosPriceChangeLine(data).then(res => {
        // console.log(res)
        if (res.data.code > 0) {
          this.itemFlag = false
          this.changePrice = null
          this.GetPosPriceChangeById(this.posPriceChangeId)
        }
      })
    },
    edit (row) { // 编辑
      this.getitem(row.itemId)
      this.changePrice = row.posChangePrice
    },
    DeleteLineBtn (row) {
      this.$api.PriceChange.RemovePosPriceChangeLineById(row.id).then(res => { // 移除变价单行
        // console.log(res)
        if (res.data.code > 0) {
          this.GetPosPriceChangeById(this.posPriceChangeId)
        }
      })
    },
    GetPosPriceChangeById (id) {
      this.$api.PriceChange.GetPosPriceChangeById(id).then(res => { // 根据id获取变价单信息
        // console.log(res)
        if (res.data.code > 0) {
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
    priceChangeSubmit () {
      this.submitFlag = true
    },
    confirmSubmit () { // 变价单提交
      this.submitFlag = false
      this.$api.PriceChange.PosPriceChangeSubmit(this.posPriceChangeId).then(res => {
        console.log(res)
        if (res.data.code > 0) {
          this.$router.go(-1)
        } else {
          this.POP_MSG(res.data.msg)
        }
      })
    },
    closeSubmit () {
      this.submitFlag = false
    }
  }
}
</script>
