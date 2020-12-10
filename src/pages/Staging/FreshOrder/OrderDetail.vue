<template>
  <q-page class="">
    <div class="bg-grey-3 row">
      <q-list
        dense
        class="row col-9"
      >
        <q-item class="col-4">

          <q-item-section>
            <q-item-label overline><span>单据编号:</span><span class="q-px-xs text-black text-weight-bolder">
                {{purchaseIntentionId}}
              </span>
            </q-item-label>

          </q-item-section>
        </q-item>
        <q-item class="col-8">

          <q-item-section>
            <q-item-label overline><span>供应商信息:</span><span class="q-px-xs text-black text-weight-bolder">
                {{purchaseList.supplier.id + ' ' + purchaseList.supplier.name}}
              </span>
            </q-item-label>

          </q-item-section>
        </q-item>
        <q-item class="col-6">

          <q-item-section>
            <q-item-label overline>
              <span>单据状态:</span><span class="q-px-xs text-black text-weight-bolder">{{formatStatus(purchaseList.status)}}
              </span>
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item class="col-6">

          <q-item-section>
            <q-item-label overline>已订<span class="text-red">{{itemsQty}}</span>项商品</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <q-list class="col row">
        <q-item class="">
          <q-item-section
            v-if="purchaseList.status==='I'"
            class="text-center"
          >
            <q-btn
              label='作废'
              class="bg-primary text-white"
              @click="goDiscard()"
              :disable="purchaseList.status !=='I'"
            />
          </q-item-section>
          <q-item-section class="text-center">
            <q-btn
              label='送审'
              class="bg-primary text-white"
              @click="goSubmit()"
              :disable="purchaseList.status !=='I'"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <div class="row justify-center">
      <div class="col-12">
        <div class="q-gutter-y-md">

          <q-table
            hide-bottom
            card-class="bg-primary text-white no-shadow"
            :data="List"
            square
            row-key="itemId"
            :columns="columnsList"
            no-data-label="未找到符合要求的单据"
            binary-state-sort
            :pagination.sync="itempagination"
            :rows-per-page-options=[0]
          > <template v-slot:header="props">
              <q-tr
                :props="props"
                class="text-center"
                v-if="purchaseList.status==='I' || purchaseList.status==='S' || purchaseList.status==='A'"
              >
                <q-th
                  v-for="col in props.cols"
                  :key="col.name"
                  :props="props"
                  class=" text-center text-white"
                >
                  {{ col.label }}
                </q-th>
              </q-tr>
              <q-tr
                :props="props"
                class="text-center"
                v-else
              >
                <q-th
                  v-for="col in props.cols.filter(i=> i.flag ===1)"
                  :key="col.name"
                  :props="props"
                  class=" text-center text-white"
                >
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>
            <template v-slot:body="props">
              <q-tr
                :props="props"
                class="bg-white text-black text-center"
                v-if="purchaseList.status==='I' || purchaseList.status==='S' || purchaseList.status==='A'"
              >
                <!--   <q-td>
                  {{props.row.index}}
                </q-td> -->
                <q-td>{{props.row.itemId}}</q-td>
                <q-td>{{props.row.itemdesc}}</q-td>
                <q-td>{{props.row.AuditingQty}}</q-td>
                <q-td>{{props.row.receiveQty}}</q-td>
                <q-td
                  key="qty"
                  :props="props"
                >
                  <div class="row justify-center">
                    <q-form @submit.prevent="changeQty(purchaseIntentionId,props.row.itemId,props.row.qty,props,props.row.index)">
                      <q-input
                        color="grey"
                        v-model.number="props.row.qty"
                        class="input1"
                        :ref="'inputQty' + props.row.index"
                        @blur="blurQty(purchaseIntentionId,props.row.itemId,props.row.qty,props,props.row.inputStatus)"
                        @focus="props.row.inputStatus = true"
                        outlined
                        square
                        dense
                        :disable="props.row.ordInd === 0 || purchaseList.status !=='I'"
                      />
                    </q-form>
                  </div>
                </q-td>
                <q-td>{{props.row.uomname}}</q-td>
                <q-td>{{props.row.stockOnHand}}</q-td>
                <q-td>{{props.row.cost}}</q-td>

                <q-td>{{props.row.saleQty}}</q-td>
              </q-tr>
              <q-tr
                :props="props"
                class="bg-white text-black text-center"
                v-else
              >
                <q-td>{{props.row.itemId}}</q-td>
                <q-td>{{props.row.itemdesc}}</q-td>

                <q-td>{{props.row.qty}}</q-td>
                <q-td>{{props.row.uomname}}</q-td>
              </q-tr>
            </template>

          </q-table>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script>
import { mapMutations } from 'vuex'
import { date } from 'quasar'
const newDate = date.formatDate(new Date(), 'YYYY/MM/DD')

export default {
  name: 'PageIndex',
  data () {
    return {
      pagelabel: '新建自采',
      layoutoffset: 88,
      purchaseList: { supplier: {} },
      List: [],
      purchaseIntentionId: null,
      locationId: null,
      display: false,
      ListStatus: 1,
      supplier: null,
      itempagination: {
        page: 1,
        rowsPerPage: 0
      },
      columnsList: [
        { name: 'itemId', sortable: true, label: '商品编码', field: 'itemId', align: 'center', flag: 1 },
        { name: 'itemdesc', label: '商品名称', field: 'itemdesc', align: 'center', flag: 1 },
        { name: 'AuditingQty', label: '已审订量', field: 'onLineQty', align: 'center', flag: 2 },
        { name: 'receiveQty', label: '收货数量', field: 'receiveQty', align: 'center', flag: 2 },
        { name: 'qty', label: '预订量', field: 'qty', align: 'center', flag: 1 },
        { name: 'uomname', label: '单位', field: 'uomname', align: 'center', flag: 1 },
        { name: 'stockOnHand', label: '库存', field: 'stockOnHand', align: 'center', flag: 2 },
        { name: 'saleQty', label: '销量', field: 'saleQty', align: 'center', flag: 2 },
        { name: 'cost', label: '移动平均成本', field: 'cost', align: 'center', flag: 2 }
      ]
    }
  },
  computed: {
    itemsQty: function () {
      return this.List.filter(item => item.qty > 0).length
    },
    orderList: function () {
      return this.List
    }

  },
  created () {
    // this.authCheck('CustomerCenter', 'Order', '/Home/Home') // 权限分类, 权限名称, 跳转链接<空则跳转/>
    this.locationId = localStorage.getItem('Location')
    this.purchaseIntentionId = this.$route.query.purchaseIntentionId

    this.layoutoffset = this.$store.state.layoutoffset
  },
  mounted () {
    this.GetPurchaseIntentionById(this.purchaseIntentionId)
  },
  watch: {
  },
  methods: {
    ...mapMutations([]),
    GetPurchaseIntentionById (purchaseIntentionId) {
      this.$api.Purchase.GetPurchaseIntentionById(purchaseIntentionId).then(res => {
        console.log(res.data)
        if (res.data.code > 0) {
          this.purchaseList = res.data.data
          if (this.purchaseList.status === 'I') {
            this.GetListForSupplier(res.data.data.supplierId, this.locationId)
          } else {
            this.GetPurchaseIntentionSummary(this.locationId, this.purchaseList.supplierId)
            this.List = this._.sortBy(this.purchaseList.purchaseIntentionLines, k => k.itemId).map((val, index) => {
              let json = {}
              for (var key in val) {
                json[key] = val[key]
              }
              json.index = index
              json.purchaseIntentionLineId = val.id
              json.itemdesc = json.item.description
              json.uomname = json.item.uom.description
              json.status = json.item.status
              json.qty = json.qtyOrdered
              json.inputStatus = false
              json.cost = 0
              json.nextDaySaleQty = 0
              json.AuditingQty = 0
              json.receiveQty = 0
              json.saleQty = 0
              json.stockOnHand = 0

              return json
            })
            this.List.forEach(
              i => {
                this.GetSupplierLocationItems(this.purchaseList.supplierId, this.locationId, i.itemId)
              }
            )
            console.log(this.List)
          }
        } else {
          this.$q.dialog({
            title: '通知',
            message: res.data.msg,
            persistent: true
          })
        }
      })
    },
    GetSupplierLocationItems (supplierId, locationId, itemId) {
      this.$api.Erp.GetSupplierLocationItems(supplierId, locationId, itemId).then(res => {
        if (res.data.code > 0) {
          this._.assign(this.List.find(i => i.itemId === itemId), res.data.data)
        } else {
          console.log(res.data.msg)
        }
      })
    },
    GetPurchaseIntentionSummary (locationId, supplierId) {
      this.$api.Purchase.GetPurchaseIntentionSummary(locationId, supplierId, newDate).then(res => {
        var arr = res.data.data
        this.List.forEach(
          i => {
            arr.forEach(
              k => {
                if (k.itemId === i.itemId) {
                  i.AuditingQty = k.qtyOrdered
                }
              }
            )
          }
        )
        if (res.data.code > 0) {
          console.log(res.data)
        } else {
          console.log(res.data.msg)
        }
      })
    },
    changeQty (purchaseIntentionId, itemId, qtyOrdered, props, index) {
      var q = 0
      q = Number(qtyOrdered)
      if (this._.isNaN(q)) {
        props.row.qty = 0
        this.RemovePurchaseIntentionLine(props)
      } else if (q === 0) {
        let num = index + 1
        if (props.row.purchaseIntentionLineId !== null) {
          this.RemovePurchaseIntentionLine(props)
        } else {
        }
        if (num === this.List.length) {
          this.$refs['inputQty' + index].blur()
        } else {
          this.$refs['inputQty' + num].focus()
        }
      } else if (q < 0) {
        props.row.qty = 0
        this.RemovePurchaseIntentionLine(props)
      } else {
        props.row.qty = this.fixNum2(q)
        this.CreateOrUpdatePurchaseIntentionLine(purchaseIntentionId, itemId, this.fixNum2(q), props, index)
      }
    },
    blurQty (purchaseIntentionId, itemId, qtyOrdered, props, status) {
      if (status === true) {
        var q = 0
        q = Number(qtyOrdered)
        if (this._.isNaN(q)) {
          props.row.qty = 0
          this.RemovePurchaseIntentionLine(props)
        } else if (q === 0 && props.row.purchaseIntentionLineId !== 0) {
          this.RemovePurchaseIntentionLine(props)
        } else if (q <= 0) {
          props.row.qty = 0
          this.RemovePurchaseIntentionLine(props)
        } else {
          props.row.qty = this.fixNum2(q)
          this.CreateOrUpdatePurchaseIntentionLine(purchaseIntentionId, itemId, this.fixNum2(q), props)
        }
      } else {
      }
    },
    RemovePurchaseIntentionLine (props) {
      this.$api.Purchase.RemovePurchaseIntentionLine(props.row.purchaseIntentionLineId).then(res => {
        if (res.data.code > 0) {
          console.log('已删除' + props.row.purchaseIntentionLineId)
          props.row.purchaseIntentionLineId = 0
        } else {
        }
      })
    },
    CreateOrUpdatePurchaseIntentionLine (purchaseIntentionId, itemId, qtyOrdered, props, index) {
      this.$api.Purchase.CreateOrUpdatePurchaseIntentionLine(purchaseIntentionId, itemId, qtyOrdered).then(res => {
        if (res.data.code > 0) {
          console.log(res.data)
          props.row.purchaseIntentionLineId = res.data.code
          if (this._.isUndefined(index)) {
            console.log('blur')
          } else {
            props.row.inputStatus = false
            let num = index + 1
            if (num === this.List.length) {
              this.$refs['inputQty' + index].blur()
            } else {
              this.$refs['inputQty' + num].focus()
            }
          }
        } else {
          console.log(props)
          props.row.qty = 0
          this.$q.dialog({
            title: '通知',
            message: res.data.msg,
            persistent: true
          })
        }
      })
    },
    async GetListForSupplier (supplierId, locationId) {
      await this.$api.Erp.GetSupplierLocationItemList(supplierId, locationId).then(res => {
        if (res.data.code > 0) {
          console.log(res.data)
          this.List = this._.sortBy(res.data.data, k => k.item).map((val, index) => {
            let json = {}
            for (var key in val) {
              json[key] = val[key]
            }
            json.itemId = val.item
            json.inputStatus = false
            json.index = index
            json.purchaseIntentionLineId = 0
            json.qty = 0
            json.cost = 0
            json.nextDaySaleQty = 0
            json.AuditingQty = 0
            json.receiveQty = 0
            json.saleQty = 0
            json.stockOnHand = 0

            return json
          })
          console.log(this.List)
        } else {
          this.$q.dialog({
            title: '通知',
            message: res.data.msg,
            persistent: true
          })
        }
      })
      this.GetPurchaseIntentionSummary(locationId, supplierId)
      this.List.forEach(
        i => {
          this.purchaseList.purchaseIntentionLines.forEach(
            k => {
              if (k.itemId === i.itemId) {
                i.qty = k.qtyOrdered
                i.purchaseIntentionLineId = k.id
              }
            }
          )
          this.GetSupplierLocationItems(this.purchaseList.supplierId, this.locationId, i.itemId)
        }
      )
    },
    changeSupplier (supplierId, locationId, supplier) {
      if (this.purchaseIntentionId === null) {
        this.CreatePurchaseIntention(supplierId, locationId, supplier)
      } else {
        console.log('已创建')
        this.Supplier = supplier.supplierId + supplier.supplierName
        this.GetListForSupplier(supplierId, locationId)
      }
    },
    formatStatus (val) {
      var test
      switch (val) {
        case 'I':
          test = '录入'
          break
        case 'S':
          test = '已提交'
          break
        case 'A':
          test = '已审批'
          break
        case 'P':
          test = '集单中'
          break
        case 'C':
          test = '集单完成'
          break
      }
      return test
    },
    goSubmit () {
      this.$q.dialog({
        title: '通知',
        message: '确认送审?',
        cancel: true,
        persistent: true
      }).onOk(data => {
        this.PurchaseIntentionSubmit(this.locationId, this.purchaseIntentionId)
      })
    },
    PurchaseIntentionSubmit (locationId, id) {
      this.$api.Purchase.PurchaseIntentionSubmit(locationId, id).then(res => {
        console.log(res.data)
        if (res.data.code === 1) {
          const _this = this
          this.$q.dialog({
            title: '通知',
            message: res.data.msg,
            persistent: true
          })
          setTimeout(function () {
            console.log('2s')
            _this.$router.go(-1)
          }, 2000)
          this.GetPurchaseIntentionById(this.purchaseIntentionId)
        } else {
          this.$q.dialog({
            title: '通知',
            message: res.data.msg,
            persistent: true
          })
        }
      })
    },
    goDiscard () {
      this.$q.dialog({
        title: '通知',
        message: '确认作废?',
        cancel: true,
        persistent: true
      }).onOk(data => {
        this.PurchaseIntentionDiscard(this.purchaseIntentionId)
      })
    },
    PurchaseIntentionDiscard (id) {
      this.$api.Purchase.PurchaseIntentionDiscard(id).then(res => {
        console.log(res.data)
        if (res.data.code > 0) {
          const _this = this
          this.$q.dialog({
            title: '通知',
            message: '单据已作废',
            persistent: true
          })
          setTimeout(function () {
            console.log('2s')
            _this.$router.go(-1)
          }, 2000)
        } else {
          this.$q.dialog({
            title: '通知',
            message: res.data.msg,
            persistent: true
          })
        }
      })
    }
  }
}
</script>
<style lang='scss'>
.input1 {
  input {
    width: 100px;
    text-align: center !important;
  }
}
</style>
