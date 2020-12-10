<template>
  <q-page class="column">
    <div class="row">
      <div class="col-12">
        <div class="q-gutter-y-md">
          <q-card flat>
            <!--   <q-tabs
              v-model="tab"
              dense
              flat
              class="text-black"
              active-color="primary"
              indicator-color="primary"
              align="justify"
              narrow-indicator
            >
              <q-route-tab
                v-for="i in homeTabs"
                :key="i.name"
                :name="i.name"
                :label="i.label"
                :to="i.to"
              />
            </q-tabs>

            <q-separator /> -->
            <!--
            <div class="q-py-md">
              <q-form class="row">
                <q-input
                  class="col-3 q-pa-xs"
                  filled
                  dense
                  v-model="tabPanel.inputIdValue"
                  :label="tabPanel.inputIdLabel"
                />
                <q-input
                  class="col-3 q-pa-xs"
                  filled
                  dense
                  v-model="tabPanel.inputProductValue"
                  :label="tabPanel.inputProductLabel"
                />
                <q-input
                  class="col-3 q-pa-xs"
                  filled
                  dense
                  mask="date"
                  v-model="tabPanel.inputStartDateValue"
                  :label="tabPanel.inputStartDateLabel"
                >
                  <template v-slot:append>
                    <q-icon
                      name="event"
                      class="cursor-pointer"
                    >
                      <q-popup-proxy
                        ref="StartDate"
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="tabPanel.inputStartDateValue"
                          @input="() => $refs.StartDate.hide()"
                        />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <q-input
                  class="col-3 q-pa-xs"
                  filled
                  dense
                  mask="date"
                  v-model="tabPanel.inputEndDateValue"
                  :label="tabPanel.inputEndDateLabel"
                >
                  <template v-slot:append>
                    <q-icon
                      name="event"
                      class="cursor-pointer"
                    >
                      <q-popup-proxy
                        ref="EndDate"
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="tabPanel.inputEndDateValue"
                          @input="() => $refs.EndDate.hide()"
                        />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <div class="col-6">
                  <q-option-group
                    inline
                    v-model="check"
                    :options="checkList"
                    color="primary"
                  />
                </div>
                <div class="col-6 q-py-xs q-px-md q-gutter-sm text-right">
                  <q-btn
                    class="bg-primary text-white"
                    label="新建"
                    to="/FreshOrder/NewOrder"
                  />
                  <q-btn
                    class="bg-primary text-white"
                    label="查询"
                    @click="getCodeList()"
                  />
                </div>
              </q-form>
            </div> -->
            <q-table
              v-if="ListSelect === true"
              grid
              grid-header
              card-class="bg-primary text-white"
              :data="List"
              :columns="columns"
              row-key="productId"
              binary-state-sort
              no-data-label="无待审批订单"
              :pagination.sync="itempagination"
              :rows-per-page-options=[20,40]
            >
              <template v-slot:no-data>
                <div class="full-width flex-center row q-pa-xl">
                  <q-img
                    src="image/none.png"
                    style=" max-width: 120px"
                  />
                </div>
              </template>
              <template v-slot:header>

                <div class="bg-primary  q-ma-xs">
                  <q-list class="row">
                    <q-item class="col-1">
                      <q-item-section>
                        <q-item-label
                          class=" text-white"
                          overline
                        >单据编号</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item class="col-2">
                      <q-item-section>
                        <q-item-label
                          overline
                          class="text-right text-white"
                        >创建日期</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item class="col-2">
                      <q-item-section>
                        <q-item-label
                          overline
                          class="text-right text-white"
                        >门店编号</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item class="col-2">
                      <q-item-section>
                        <q-item-label
                          overline
                          class="text-right text-white"
                        >供应商编号</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item class="col-2">
                      <q-item-section>
                        <q-item-label
                          overline
                          class="text-right text-white"
                        >状态</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item class="col-2">
                      <q-item-section>
                        <q-item-label
                          overline
                          class="text-center text-white"
                        >操作</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </template>
              <template v-slot:item="props">
                <div class="q-pa-xs col-12 grid-style-transition">
                  <q-list class="bg-grey-2 row">
                    <q-item class="cursor-pointer  col-1">
                      <q-item-section class="q-pa-xs">
                        {{props.row.PurchaseIntentionId}}
                      </q-item-section>
                    </q-item>
                    <q-item class="col-2">
                      <q-item-section class=" text-right">{{props.row.createdDate}}</q-item-section>
                    </q-item>
                    <q-item class="col-2">
                      <q-item-section class=" text-right">{{props.row.locationId}}</q-item-section>
                    </q-item>
                    <q-item class="col-2">
                      <q-item-section class=" text-right">{{props.row.supplierId}}</q-item-section>
                    </q-item>
                    <q-item class="col-2">
                      <q-item-section class=" text-right">{{props.row.status}}</q-item-section>
                    </q-item>
                    <q-item class="col-2">
                      <q-item-section class=" text-center">
                        <q-btn
                          flat
                          label="详情"
                          class="text-primary"
                          @click="getDetail(props.row.PurchaseIntentionId)"
                        ></q-btn>

                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </template>
            </q-table>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script>
import { mapMutations } from 'vuex'
import { date } from 'quasar'

export default {
  name: 'PageIndex',
  data () {
    return {
      pagelabel: '需求单检索',
      link: [],
      tab: 'purchase',
      statusId: null,
      ListSelect: false,
      List: [],
      check: 1,
      locationId: null,
      itempagination: {
        page: 1,
        rowsPerPage: 20,
        sortBy: 'id',
        descending: false
      },
      columns: [
        {
          name: 'id',
          required: true,
          label: '需求单编号',
          align: 'left',
          field: row => row.id,
          format: val => `${val}`
        }
      ],
      checkList: [
        { value: 1, label: '待审批', status: ['S'] }
      ],
      tabPanel:
      {
        name: 'order',
        list: [],
        inputIdLabel: '订货单编号',
        inputIdValue: null,
        inputProductLabel: '商品名称',
        inputProductValue: null,
        inputStartDateLabel: '创建时间(开始)',
        inputStartDateValue: null,
        inputEndDateLabel: '创建时间(结束)',
        inputEndDateValue: null
      }
    }
  },
  created () {
    // this.authCheck('CustomerCenter', 'Order', '/Home/Home') // 权限分类, 权限名称, 跳转链接<空则跳转/>
    this.locationId = Number(localStorage.getItem('Location'))
  },
  mounted () {
    /*  this.tabPanel.inputIdValue = this.$route.query.id
     this.tabPanel.inputProductValue = this.$route.query.product
     this.tabPanel.Status = this.$route.query.status
     this.tabPanel.inputStartDateValue = this.$route.query.startdate
     this.tabPanel.inputEndDateValue = this.$route.query.enddate
     this.check = Number(this.$route.query.check === undefined ? 2 : this.$route.query.check)
     if (this.$route.query.check !== undefined) { this.getCodeList() } */
    this.ListSelect = true
    this.QueryPurchaseIntentions(
      this.tabPanel.inputIdValue,
      this.tabPanel.inputProductValue,
      this.selectStatus.status,
      this.tabPanel.inputStartDateValue,
      this.tabPanel.inputEndDateValue)
  },
  computed: {
    selectStatus: function () { return this.checkList.find(i => i.value === this.check) }
  },
  watch: {
  },
  methods: {
    ...mapMutations(['SET_LINKLIST', 'SET_CARTLIST']),
    Select (id, product, status, startdate, enddate) {
      if (this.check === 1) {
        var day = date.getDateDiff(enddate, startdate, 'days')
        console.log(enddate)
        if ((isNaN(day) || startdate === null || enddate === null) &&
          (id === null || id === '' || id === undefined) && (product === null || product === '' || product === undefined)) {
          this.$q.dialog({
            title: '错误',
            message: '查看全部单据需输入时间段',
            persistent: true
          })
        } else if (day > 93) {
          this.$q.dialog({
            title: '错误',
            message: '查看全部单据时,时间区间不能超过3个月',
            persistent: true
          })
        } else {
          this.ListSelect = true
          this.$router.push({
            path: '/FreshOrder/OrderList',
            query: {
              id: id,
              product: product,
              status: status,
              startdate: startdate,
              enddate: enddate,
              check: this.check
            }
          })
          this.QueryPurchaseIntentions(id, product, status, startdate, enddate)
        }
      } else {
        this.ListSelect = true
        this.$router.push({
          path: '/FreshOrder/OrderList',
          query: {
            id: id,
            product: product,
            status: status,
            startdate: startdate,
            enddate: enddate,
            check: this.check
          }
        })
        this.QueryPurchaseIntentions(id, product, status, startdate, enddate)
      }
    },
    getDetail (id) {
      this.$router.push({
        path: '/FreshOrder/AuditingOrderDetail',
        query: {
          purchaseIntentionId: id
        }
      })
    },
    getCodeList () {
      console.log(this.selectStatus.status)
      this.Select(
        this.tabPanel.inputIdValue,
        this.tabPanel.inputProductValue,
        this.selectStatus.status,
        this.tabPanel.inputStartDateValue,
        this.tabPanel.inputEndDateValue)
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
        case 'D':
          test = '已作废'
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
    QueryPurchaseIntentions (id, item, status, FromDate, ToDate) {
      var list = {
        PurchaseIntentionId: id || null,
        ItemDescription: item || null,
        Status: status || [],
        FromDate: FromDate || null,
        ToDate: ToDate || null,
        PageSize: 1000,
        PageIndex: 1
      }
      console.log(list)
      this.$api.Purchase.QueryPurchaseIntentions(list).then(res => {
        if (res.data.code === 0) {
          console.log(res.data)
          this.List = []
        } else if (res.data.code === 1) {
          console.log(res.data)
          this.List = res.data.data.purchaseIntentions.map(val => {
            const json = {}
            json.PurchaseIntentionId = val.id
            json.createdDate = val.createdDate.substring(0, 10)
            json.locationId = val.locationId
            json.status = this.formatStatus(val.status)
            json.supplierId = val.supplierId
            return json
          }).filter(i => i.locationId === this.locationId)
          console.log(this.List
          )
        } else {
          console.log(res.data.code)
        }
      })
    }
  }
}
</script>
