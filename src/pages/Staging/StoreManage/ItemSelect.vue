
<template>
  <q-page>
    <div class="flex flex-center q-px-md">
      <q-form
        @submit="RETURNFALSE()"
        @keydown.enter="getitem($store.state.location.id,itemidOrBarcode)"
        class="orderinput"
      >
        <q-input
          autofocus
          ref='dom'
          outlined
          autocorrect="off"
          autocapitalize="off"
          autocomplete="off"
          spellcheck="false"
          v-model="itemidOrBarcode"
          label="扫描商品"
        >
          <template v-slot:append>
            <q-icon
              name="close"
              @click="itemidOrBarcode = null"
              class="cursor-pointer"
            />
          </template>
        </q-input>
      </q-form>
    </div>
    <q-list
      padding
      dense
      v-if="flag"
      class="orderlist"
    >
      <q-item>
        <q-item-section>
          <q-item-label
            class="text-weight-bold text-black"
            caption
          >品类组</q-item-label>
          <q-item-label class="text-grey-8">{{ basic.groupNo +' ' + basic.groupName }}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label
            class="text-weight-bold text-black"
            caption
          >品类</q-item-label>
          <q-item-label class="text-grey-8">{{ basic.deparmentNo +' ' + basic.departmentName }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label
            class="text-weight-bold text-black"
            caption
          >子品类</q-item-label>
          <q-item-label class="text-grey-8">{{ basic.classNo +' ' + basic.className }}</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label
            class="text-weight-bold text-black"
            caption
          >商品群</q-item-label>
          <q-item-label class="text-grey-8">{{ basic.subClassNo +' ' + basic.subClassName }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item
        class="row"
        caption
      >
        <q-item-section class="text-weight-bold text-black col-3">商品编号</q-item-section>
        <q-item-section class="text-grey-8 col-9">{{ basic.itemId }}</q-item-section>
      </q-item>
      <q-item
        class="row"
        caption
      >
        <q-item-section class="text-weight-bold text-black col-3">国际条码</q-item-section>
        <q-item-section class="text-grey-8 col-9">{{ primaryBarcode }}</q-item-section>
      </q-item>
      <q-item
        class="row"
        caption
      >
        <q-item-section class="text-weight-bold text-black col-3">商品描述</q-item-section>
        <q-item-section class="text-grey-8 col-9">{{ basic.description }}</q-item-section>
      </q-item>
      <q-item
        class="row"
        caption
      >
        <q-item-section class="text-weight-bold text-black col-3">供应商</q-item-section>
        <q-item-section class="text-grey-8 col-9">{{ basic.primarySupplierId + ' ' + basic.primarySupplierName }}</q-item-section>
      </q-item>
      <div class="">
        <q-card flat>
          <q-tabs
            no-shadow
            v-model="tab"
            class="text-black"
            active-color="white"
            active-bg-color="primary"
            indicator-color="primary"
            align="justify"
            dense
            no-caps
            inline-label
          >
            <q-tab
              name="basic"
              label="库存"
            />
            <q-tab
              name="price"
              label="价格"
            />
            <q-tab
              name="stock"
              label="基础"
            />
            <q-tab
              name="sale"
              label="销售"
            />
          </q-tabs>

          <q-separator />
          <q-tab-panels
            v-model="tab"
            animated
          >
            <q-tab-panel
              class="q-pa-xs"
              name="basic"
            >
              <q-list
                padding
                class="rounded-borders"
              >
                <q-item>
                  <q-item-section class="justify-between">
                    <q-item-label caption>库存</q-item-label>
                    <q-item-label>{{Basics.stockOnHand}}</q-item-label>
                  </q-item-section>
                  <q-item-section class="justify-between">
                    <q-item-label caption>可用库存</q-item-label>
                    <q-item-label>{{ Basics.availableQty }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator inset />
                <q-item>
                  <q-item-section class="justify-between">
                    <q-item-label caption>退货预留</q-item-label>
                    <q-item-label>{{Basics.rtvQty}}</q-item-label>
                  </q-item-section>
                  <q-item-section class="justify-between">
                    <q-item-label caption>转移预留</q-item-label>
                    <q-item-label>{{ Basics.tsfReservedQty }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator inset />
                <q-item>
                  <q-item-section class="justify-between">
                    <q-item-label caption>在线订量</q-item-label>
                    <q-item-label>{{Basics.onLineOrderQty}}</q-item-label>
                  </q-item-section>
                  <q-item-section class="justify-between">
                    <q-item-label caption>在途数量</q-item-label>
                    <q-item-label>{{ Basics.inTransitQty }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator inset />
                <q-item v-if="basic.logisticsMode != '直送'">
                  <q-item-section class="justify-between">
                    <q-item-label caption>仓库可用库存</q-item-label>
                    <q-item-label>{{Basics.whAvailableQty}}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-tab-panel>

            <q-tab-panel
              class="q-pa-xs"
              name="price"
            >
              <q-list
                padding
                class="rounded-borders"
              >

                <q-item>
                  <q-item-section class="justify-between">
                    <q-item-label caption>门店WAC</q-item-label>
                    <q-item-label>{{Basics.avCost}}</q-item-label>
                  </q-item-section>
                  <q-item-section class="justify-between">
                    <q-item-label caption>正常进价</q-item-label>
                    <q-item-label>{{ basic.commonUnitCost }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator inset />
                <q-item>
                  <q-item-section class="justify-between">
                    <q-item-label caption>会员售价</q-item-label>
                    <q-item-label> 无</q-item-label>
                  </q-item-section>
                  <q-item-section class="justify-between">
                    <q-item-label caption>正常售价</q-item-label>
                    <q-item-label>{{basic.sellingUnitRetail}}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator inset />

                <q-item v-if="!promotion.SellingPrice">
                  <template>
                    <q-item-section avatar>
                      <q-icon
                        name="local_offer"
                        color="primary"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>促销</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label>无促销</q-item-label>
                    </q-item-section>
                    <div style="width:40px;"></div>
                  </template>
                </q-item>
                <q-expansion-item
                  v-if="promotion.SellingPrice"
                  icon="local_offer"
                  :default-opened="promotion.SellingPrice ? true:false"
                >
                  <template v-slot:header>
                    <q-item-section avatar>
                      <q-icon
                        name="local_offer"
                        color="primary"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>促销</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label>{{ promotion.SellingPrice ? promotion.status:'无促销' }}</q-item-label>
                    </q-item-section>
                  </template>
                  <q-item>
                    <q-item-section class="justify-between">
                      <q-item-label caption>特进价</q-item-label>
                      <q-item-label>{{basic.promoUnitCost}}</q-item-label>
                    </q-item-section>
                    <q-item-section class="justify-between">
                      <q-item-label caption>促销售价</q-item-label>
                      <q-item-label>{{ promotion.SellingPrice }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section class="justify-between">
                      <q-item-label caption>开始时间</q-item-label>
                      <q-item-label>{{promotion.StartDate}}</q-item-label>
                    </q-item-section>
                    <q-item-section class="justify-between">
                      <q-item-label caption>结束时间</q-item-label>
                      <q-item-label>{{ promotion.EndDate}}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-expansion-item>
                <q-separator inset />

                <q-item v-if="priceInfo.isCM === 'N'">
                  <template>
                    <q-item-section avatar>
                      <q-icon
                        name="loyalty"
                        color="primary"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>复杂促销</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label>无促销</q-item-label>
                    </q-item-section>
                    <div style="width:40px;"></div>
                  </template>
                </q-item>
                <q-expansion-item
                  v-if="priceInfo.isCM === 'Y'"
                  :default-opened="priceInfo.isCM === 'Y' ? true:false"
                >
                  <template v-slot:header>
                    <q-item-section avatar>
                      <q-icon
                        name="loyalty"
                        color="primary"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>复杂促销</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label>{{ priceInfo.isCM === 'Y' ? '有促销':'无促销' }}</q-item-label>
                    </q-item-section>
                  </template>
                  <q-item>
                    <q-item-section class="justify-between">
                      <q-item-label caption>促销名称</q-item-label>
                      <q-item-label>{{priceInfo.cmInfo.cmDesc}}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-expansion-item>
                <q-separator inset />

                <q-expansion-item
                  v-if="basic.logisticsMode != '直送'"
                  icon="local_offer"
                  :default-opened="basic.whAvCost ? true:false"
                >
                  <template v-slot:header>
                    <q-item-section avatar>
                      <q-icon
                        name="local_shipping"
                        color="primary"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>仓库信息</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label>{{ basic.logisticsMode }}</q-item-label>
                    </q-item-section>
                  </template>
                  <q-item>
                    <q-item-section class="justify-between">
                      <q-item-label caption>仓库WAC</q-item-label>
                      <q-item-label>{{Basics.whAvCost}}</q-item-label>
                    </q-item-section>
                    <q-item-section class="justify-between">
                      <q-item-label caption>仓库进价</q-item-label>
                      <q-item-label>{{ basic.whUnitCost }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-expansion-item>
              </q-list>
            </q-tab-panel>

            <q-tab-panel
              class="q-pa-xs"
              name="stock"
            >
              <q-list
                padding
                class="rounded-borders"
              >

                <q-item>
                  <q-item-section>
                    <q-item-label caption>经营方式</q-item-label>
                    <q-item-label>{{basic.businessType}}</q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption>二级商品类型</q-item-label>
                    <q-item-label>{{ basic.itemType }}</q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption>状态</q-item-label>
                    <q-item-label>{{ basic.status }}</q-item-label>
                  </q-item-section>
                  <!-- <q-item-section>
                    <q-item-label caption>物流模式</q-item-label>
                    <q-item-label>{{ basic.logisticsMode }}</q-item-label>
                  </q-item-section> -->
                </q-item>
                <q-separator inset />
                <q-item>
                  <q-item-section>
                    <q-item-label caption>物流模式</q-item-label>
                    <q-item-label>{{ basic.logisticsMode }}</q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption>产地</q-item-label>
                    <q-item-label>{{ basic.originProducted }}</q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption>退货/返仓属性</q-item-label>
                    <q-item-label>{{ basic.returnInd ? "是" : "否" }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator inset />

                <q-item>
                  <q-item-section>
                    <q-item-label caption>未销天数</q-item-label>
                    <q-item-label>{{ Basics.lastSold }}</q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption>建档日期</q-item-label>
                    <q-item-label>{{ basic.createdDate }}</q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption>最后收货日期</q-item-label>
                    <q-item-label>{{ Basics.lastReceived }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator inset />

                <q-item>
                  <q-item-section>
                    <q-item-label caption>菜篮子</q-item-label>
                    <q-item-label>{{ basic.basketInd ? '是':'否'}}</q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption>KVI</q-item-label>
                    <q-item-label>{{ basic.kviInd ? '是':'否'}}</q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption>畅销品</q-item-label>
                    <q-item-label>{{ basic.quickSellerInd ? '是':'否'}}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator inset />
                <q-item>
                  <q-item-section>
                    <q-item-label caption>季节商品</q-item-label>
                    <q-item-label>{{ basic.seasonInd ? '是':'否'}}</q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption>DMS</q-item-label>
                    <q-item-label>{{ Basics.dms }}</q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption>箱规</q-item-label>
                    <q-item-label>{{ basic.suppPackSize }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator inset />

                <q-item>
                  <q-item-section>
                    <q-item-label caption>售价单位</q-item-label>
                    <q-item-label>{{ basic.sellingUom }}</q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption>订货单位</q-item-label>
                    <q-item-label>{{ basic.storeOrderMulti }}</q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption>临时品</q-item-label>
                    <q-item-label style="opacity:0;">{{ basic.storeOrderMulti }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator inset />
                <q-expansion-item icon="local_offer">
                  <template v-slot:header>
                    <q-item-section avatar>
                      <q-icon
                        name="shopping_basket"
                        color="primary"
                      />
                    </q-item-section>

                    <q-item-section>
                      <q-item-label>销售属性</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label>{{basic.sellableInd === 1 ? '可销售' : '不可销售' }}</q-item-label>
                    </q-item-section>
                  </template>
                  <q-item>
                    <q-item-section class="justify-between">
                      <q-item-label caption>商品主档</q-item-label>
                      <q-item-label>{{basic.itemSellableInd ? "可销售" : "不可销售"}}</q-item-label>
                    </q-item-section>
                    <q-item-section class="justify-between">
                      <q-item-label caption>商品状态</q-item-label>
                      <q-item-label>{{basic.status}}</q-item-label>
                    </q-item-section>
                    <q-item-section class="justify-between">
                      <q-item-label caption>门店是否可销售</q-item-label>
                      <q-item-label>{{ basic.itemLocationSaleInd ? "可销售" : "不可销售" }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-expansion-item>
                <q-separator inset />
                <q-expansion-item icon="local_offer">
                  <template v-slot:header>
                    <q-item-section avatar>
                      <q-icon
                        name="assignment"
                        color="primary"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>订货属性</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label>{{basic.orderableInd === 1 ? '可订货' : '不可订货' }}</q-item-label>
                    </q-item-section>
                  </template>
                  <q-item>
                    <q-item-section class="justify-between">
                      <q-item-label caption>供应商</q-item-label>
                      <q-item-label>{{ basic.primarySupplierStatus == 'A' ? '生效' : "不生效"}}</q-item-label>
                    </q-item-section>
                    <q-item-section class="justify-between">
                      <q-item-label caption>商品主档</q-item-label>
                      <q-item-label>{{ basic.itemOrderableInd ? "可订货" : "不可订货" }}</q-item-label>
                    </q-item-section>
                    <q-item-section class="justify-between">
                      <q-item-label caption>商品门店</q-item-label>
                      <q-item-label>{{ basic.itemLocationOrdInd ? "可订货" : "不可订货" }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-separator inset />
                  <q-item>
                    <q-item-section
                      v-if="basic.logisticsMode != '直送'"
                      class="justify-between"
                    >
                      <q-item-label caption>商品供应商仓库</q-item-label>
                      <q-item-label>{{ Basics.oplInfo.itemLocInfoOrderInd == "Y" ? "可订货" : "不可订货" }}</q-item-label>
                    </q-item-section>
                    <q-item-section class="justify-between">
                      <q-item-label caption>商品供应商门店</q-item-label>
                      <q-item-label>{{ basic.itemSupplierLocationOrdInd ? "可订货" : "不可订货" }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <!-- <q-separator inset /> -->
                </q-expansion-item>
                <q-separator inset />
                <q-expansion-item icon="local_offer">
                  <template v-slot:header>
                    <q-item-section avatar>
                      <q-icon
                        name="access_time"
                        color="primary"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>OPL属性</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label>{{Basics.opl === 'Y' ? '是' : '否' }}</q-item-label>
                    </q-item-section>
                  </template>
                  <q-item>
                    <q-item-section class="justify-between">
                      <q-item-label caption>供应商OPL</q-item-label>
                      <q-item-label>{{ basic.primarySupplierLocationOplInd ? "是" : "否"}}</q-item-label>
                    </q-item-section>
                    <q-item-section class="justify-between">
                      <q-item-label caption>是否维护OPL行程</q-item-label>
                      <q-item-label>{{ Basics.oplInfo.supplierLocSched == "Y" ? "已维护" : "不可维护"}}</q-item-label>
                    </q-item-section>
                    <q-item-section class="justify-between">
                      <q-item-label caption>商品OPL</q-item-label>
                      <q-item-label>{{ Basics.oplInfo.itemLocInfoOplInd == "Y" ? "是" : "否" }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-expansion-item>
                <q-separator inset />
              </q-list>
            </q-tab-panel>

            <q-tab-panel
              class="q-pa-xs"
              name="sale"
            >
              <q-list
                padding
                class="rounded-borders"
              >
                <q-item>
                  <q-item-section>
                    <q-item-label caption>当日销售</q-item-label>
                    <q-item-label>{{ Basics.saleQty }}</q-item-label>
                  </q-item-section>
                  <!-- <q-item-section>
                    <q-item-label caption>最后销售日期</q-item-label>
                    <q-item-label>{{ Basics.saleQty }}</q-item-label>
                  </q-item-section> -->
                </q-item>
              </q-list>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </q-list>
  </q-page>
</template>

<style lang="stylus" >
.order-pop {
  width: 100%;
}

.rcvInputLabel {
  vertical-align: bottom;
  line-height: 40px;
  text-align: center;
}

#adjQtyInput {
  max-width: 100px;
  text-align: center;
}
</style>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'PageStoreReceiving',
  data () {
    return {
      tab: 'basic',
      timer: null,
      itemidOrBarcode: null, // 货号/条码输入
      basic: {}, // 基本信息
      primaryBarcode: null, // 国际条码
      Basics: {
        oplInfo: {}
      }, // 库存信息
      // item: {},
      priceInfo: { // 复杂促销
        cmInfo: {
          cmDesc: null
        }
      },
      flag: false,
      promotion: { // 基本促销开始、结束时间
        StartDate: '2016-11-19T09:59:42',
        EndDate: '2016-11-19T09:59:42'
      }
    }
  },
  created () {
    this.CHANGE_TITLE('商品信息')
    this.BTN_PAGE(true)
  },
  mounted () {
    this.timer = setInterval(this.reflashStock, 30000)
  },
  watch: {},
  beforeDestroy () { // 页面关闭时清除定时器
    clearInterval(this.timer)
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_GO', 'BTN_PAGE', 'CHANGE_TITLE', 'RETURNFALSE']),
    reflashStock () {
      console.log('reflashStock')
      console.log(this.basic.itemId)
      if (this.basic.itemId) {
        this.getItem(this.$store.state.location.id, this.basic.itemId)
        console.log(this.Basics.stockOnHand)
      }
    },
    // 获取商品基础信息
    getitem (loc, item) {
      this.itemidOrBarcode = null
      this.$api.Item.getShop(loc, item).then(res => {
        if (res.data.code === 0) {
          this.POP_MSG(res.data.msg)
          this.flag = false
        } else {
          this.basic = res.data.data
          this.basic.createdDate = this.basic.createdDate.substr(0, 10)
          if (Math.floor(this.basic.commonUnitCost) === this.basic.commonUnitCost) {
            this.basic.commonUnitCost = this.basic.commonUnitCost + '.000'
          }
          if (Math.floor(this.basic.sellingUnitRetail) === this.basic.sellingUnitRetail) {
            this.basic.sellingUnitRetail = this.basic.sellingUnitRetail + '.00'
          }
          this.primaryBarcode = res.data.data.primaryBarcode
          this.getItem(loc, this.basic.itemId)
          this.flag = true
        }
      })
    },
    getItem (loc, item) {
      // 获取库存信息
      this.$api.Erp.getItemInfo(loc, item).then(res => {
        this.Basics = res.data.data
        this.Basics.lastReceived = this.Basics.lastReceived.substr(0, 10)
        console.log('加载库存信息')
      })
      // 是否有促销
      this.$api.Erp.getItemDC(loc, item).then(res => {
        this.priceInfo = res.data.data
        if (this.priceInfo.dmInfo.dmType === '') {
          let obj = {}
          obj.Cost = this.priceInfo.pmInfo.pmCost
          obj.EndDate = this.priceInfo.pmInfo.pmEndDate.substring(0, 10)
          obj.Price = this.priceInfo.pmInfo.pmPrice
          obj.SellingPrice = this.priceInfo.pmInfo.pmSellingPrice
          obj.StartDate = this.priceInfo.pmInfo.pmStartDate.substring(0, 10)
          obj.Type = this.priceInfo.pmInfo.pmType
          obj.status = '一般促销'
          this.promotion = obj
        } else {
          let obj = {}
          obj.Cost = this.priceInfo.dmInfo.dmCost
          obj.EndDate = this.priceInfo.dmInfo.dmEndDate.substring(0, 10)
          obj.Price = this.priceInfo.dmInfo.dmPrice
          obj.SellingPrice = this.priceInfo.dmInfo.dmSellingPrice
          obj.StartDate = this.priceInfo.dmInfo.dmStartDate.substring(0, 10)
          obj.Type = this.priceInfo.dmInfo.dmType
          obj.status = 'DM促销'
          this.promotion = obj
        }
      })
    }
  }
}
</script>
