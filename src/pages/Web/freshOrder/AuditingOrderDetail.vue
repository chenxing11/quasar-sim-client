<template>
  <q-page class="">
    <div class="bg-grey-3 row">

      <q-btn
        class="col-1"
        icon="las la-angle-left"
        color="primary"
        @click="$router.go(-1)"
        flat
      ></q-btn>
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
        <q-item class="col-4">

          <q-item-section>
            <q-item-label overline>
              <span>单据状态:</span><span class="q-px-xs text-black text-weight-bolder">{{formatStatus(purchaseList.status)}}
              </span>
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item class="col-4">

          <q-item-section>
            <q-item-label overline>已订<span class="text-red">{{itemsQty}}</span>项商品</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <q-list class="col-2 row">
        <q-item class="">
          <q-item-section class="text-center">
            <q-btn
              label='审批'
              class="bg-primary text-white"
              @click="goApprove()"
            />
          </q-item-section>
          <q-item-section class="text-center">
            <q-btn
              label='驳回'
              class="bg-primary text-white"
              @click="goReject()"
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
                <q-td e>{{props.row.qty}}</q-td>
                <q-td>{{props.row.uomname}}</q-td>
                <q-td>{{props.row.stockOnHand}}</q-td>
                <q-td>{{props.row.saleQty}}</q-td>
                <q-td>{{props.row.cost}}</q-td>

              </q-tr>
              <q-tr
                :props="props"
                class="bg-white text-black text-center"
                v-else
              >
                <!--   <q-td>
                  {{props.row.index}}
                </q-td> -->
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
        sortBy: 'itemId',
        rowsPerPage: 0
      },
      columnsList: [
        { name: 'itemId', sortable: true, label: '商品编码', field: 'itemId', align: 'center', flag: 1 },
        { name: 'itemdesc', label: '商品名称', field: 'itemdesc', align: 'center', flag: 1 },
        { name: 'AuditingQty', label: '已审订量', field: 'AuditingQty', align: 'center', flag: 2 },
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
            this.List = this.purchaseList.purchaseIntentionLines.map((val, index) => {
              let json = {}
              for (var key in val) {
                json[key] = val[key]
              }
              //  json.index = index + 1
              json.itemdesc = json.item.description
              json.uomname = json.item.uom.description
              json.qty = json.qtyOrdered
              json.cost = 0
              json.nextDaySaleQty = 0
              json.AuditingQty = 0
              json.receiveQty = 0
              json.saleQty = 0
              json.stockOnHand = 0

              return json
            })
            this.GetPurchaseIntentionSummary(this.locationId, this.purchaseList.supplierId)
            this.List.forEach(
              i => {
                this.GetSupplierLocationItems(this.purchaseList.supplierId, this.locationId, i.itemId)
              }
            )
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
    CreateOrUpdatePurchaseIntentionLine (purchaseIntentionId, itemId, qtyOrdered, props) {
      this.$api.Purchase.CreateOrUpdatePurchaseIntentionLine(purchaseIntentionId, itemId, qtyOrdered).then(res => {
        console.log(res.data)
        if (res.data.code > 0) {
          this.GetPurchaseIntentionById(purchaseIntentionId)
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
      await this.$api.Erp.GetSupplierLocationItems(supplierId, locationId).then(res => {
        console.log(res.data)
        if (res.data.code > 0) {
          this.List = res.data.data.filter(i => i.status !== 'C').map((val, index) => {
            let json = {}
            for (var key in val) {
              json[key] = val[key]
            }
            //  json.index = index + 1
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
    QtyRule (q1, q2, list) {
      var q = 0
      q = Number(q1)
      if (q < 0) {
        console.log('不能小于0')
        list.row.qty = 0
      } else if (q > q2) {
        list.row.qty = q2
      } else if (q >= 0 && q <= q2) {
        list.row.qty = q
      } else {
        list.row.qty = q2
      }
    },
    goApprove () {
      this.$q.dialog({
        title: '通知',
        message: '确认审批?',
        cancel: true,
        persistent: true
      }).onOk(data => {
        this.PurchaseIntentionApprove(this.locationId, this.purchaseIntentionId)
      })
    },
    PurchaseIntentionApprove (locationId, id) {
      this.$api.Purchase.PurchaseIntentionApprove(locationId, id).then(res => {
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
    goReject () {
      this.$q.dialog({
        title: '通知',
        message: '确认驳回?',
        cancel: true,
        persistent: true
      }).onOk(data => {
        this.PurchaseIntentionReject(this.locationId, this.purchaseIntentionId)
      })
    },
    PurchaseIntentionReject (locationId, id) {
      this.$api.Purchase.PurchaseIntentionReject(locationId, id).then(res => {
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
    }
  }
}
</script>
<style lang='scss'>
.input1 {
  input {
    width: 120px;
    text-align: center !important;
  }
}
</style>
