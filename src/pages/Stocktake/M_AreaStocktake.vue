<template>
<q-page class="orderlist">
  <q-list>
    <!-- <q-item-section clickable> -->
      <q-list class="q-px-md q-pt-md row">
        <q-item-section class="col-6">
          <div>
            <span class="text-weight-bold text-black">录入员</span>
            <span class="q-pa-md text-grey-8">{{realName}}</span>
          </div>
        </q-item-section>
        <div class="col-6 items-center row q-px-xs">
          <span class="text-weight-bold text-black col-4">品类组</span>
          <q-btn-dropdown :label="label" style="flex:1;" class="q-ml-sm  col-8">
            <q-list >
              <q-item v-for="(item,index) in Purchase" :key="index"
              v-model="label" @click="label = item.name, changeloc(item)" clickable v-close-popup>
                <q-item-section>
                  <q-item-label>{{item.name}}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-list>
    <!-- </q-item-section> -->

    <q-list class="q-pa-md row">
        <q-input outlined dense autofocus ref="Zone" v-model="Zone" :disable="BayStatus" @keydown.enter="Channel()" class="col-6 items-center">
          <template v-slot:before>
            <div class="justify-center column">
              <span class="text-bold text-black" style="font-size:.9rem;color:#black;">通道号</span>
            </div>
          </template>
        </q-input>
        <q-input outlined dense v-model="Bay" ref="shelves" :disable="BayStatus" @keydown.enter="shelves()" class="col-6 q-px-xs items-center">
          <template v-slot:before>
            <div class="justify-center column">
              <span class="text-bold text-black" style="font-size:.9rem;color:#black;">货架号</span>
            </div>
          </template>
        </q-input>
    </q-list>

    <q-list class="q-px-md row">
      <q-input outlined dense  v-model="countedByRealName" ref="countedByRealName" @keydown.enter="StocktakeName()" :disable="CountedByStatus" class="col-6 items-center">
          <template v-slot:before>
            <div class="justify-center column">
              <span class="text-bold text-black" style="font-size:.9rem;color:#black;">盘点员</span>
            </div>
          </template>
        </q-input>
    </q-list>
    <q-item>
      <q-item-section class="text-weight-bold">已盘点{{cargo.length}}个商品</q-item-section>
    </q-item>
    <q-item v-if="icon">
      <q-item-section>
          <q-item-label class="text-weight-bold">上一个盘点商品为</q-item-label>
          <q-item class="items-center text-weight-bold">
            <q-item-label class="col-8">{{cargo[cargo.length-1].stocktakeSku.itemDescription}}</q-item-label>
            <q-item-label class="col-4">{{'数量 :' + cargo[cargo.length-1].qty}}</q-item-label>
          </q-item>
      </q-item-section>
    </q-item>
    <q-separator inset />
    <q-list class="q-pa-md">
      <q-form @keydown.enter="getitem(itemOrBarcode)" @submit="RETURNFALSE()"
              class="orderinput">
        <q-input outlined dense :disable="inputStatus" ref="dom" label="扫描商品" v-model="itemOrBarcode"/>
      </q-form>
    </q-list>

    <!-- <q-separator inset /> -->

      <div class="q-pa-md" v-if="checkList">
        <q-table
          table-style="max-height: 300px"
          virtual-scroll
          flat
          :data="data"
          :pagination.sync="rcvedpagination"
          :rows-per-page-options=[0]
          :columns="columns">
          <template v-slot:body="props">
            <q-tr  class="allRcv" @click.native="details(props.row)">
              <q-td class="rcvtd" key="zone"  :props="props">{{ props.row.zone }}</q-td>
              <q-td class="rcvtd" key="bay" :props="props">{{ props.row.bay }}</q-td>
              <q-td class="rcvtd" key="status" :props="props">{{ props.row.status }}</q-td>
              <q-td class="rcvtd" key="recordedByRealName" :props="props" >{{ props.row.recordedByRealName }}</q-td>
              <q-td class="rcvtd" key="countedByRealName" :props="props" >{{ props.row.countedByRealName }}</q-td>
            </q-tr>
          </template>
        </q-table>
      </div>

      <q-list  class="q-pa-sm" v-if="checkItem">
          <q-card-section class="q-pa-xs"
              caption>
            <span class="q-pa-sm text-weight-bold text-black">商品货号</span>
            <span class="q-pa-sm text-black">{{ commodity.itemId }}</span>
          </q-card-section>
          <q-card-section class="q-pa-xs"
            caption>
            <span class="q-pa-sm text-weight-bold text-black">品名</span>
            <span class="q-pa-sm text-black">{{ commodity.itemDescription }}</span>
          </q-card-section>
        <q-form  @keydown.enter="qtyRule(adjQty)" @submit="RETURNFALSE()">
          <q-card-actions class="q-pa-xs"
          style="width:100%"
          caption
          line="1">
        <span class="InputLabel q-pa-sm text-weight-bold text-black">盘点数量</span>
          <q-input id="adjQtyInput"
            :input-style="{ 'text-align': 'center' }"
            color="black"
            class="q-pa-xs"
            autofocus
            :suffix=" item.uom"
            v-model.number="adjQty"
            :dense="true" />
            </q-card-actions>
        </q-form>
      </q-list>
      <div class="rcv-btn" v-if="checkItem">
        <div class="text-grey-8 q-gutter-xs q-pa-md">
          <q-btn class="btn-primary" label="确定" @click="qtyRule(adjQty)"/>
        </div>
      </div>
      <div class="rcv-btn row" v-if="checkItemflag">
        <div class="text-grey-8 q-gutter-xs q-pa-md">
          <q-btn dense class="btn-primary" @click="deleteBay()" label="删除本Bay"/>
        </div>
        <div class="text-grey-8 q-gutter-xs q-pa-md">
          <q-btn dense class="btn-primary" @click="EndBay()" label="结束本Bay"/>
        </div>
      </div>
  </q-list>

  <q-dialog v-model="deleteFlag">
    <q-card style="width:200px">
      <q-card-section class="row items-center">
        <div class="text-h6">是否删除本Bay</div>
        <q-space />
      </q-card-section>
      <div class="q-mb-md q-mt-md justify-around row">
        <q-btn class="btn-primary" @click="cancel()" label="否"/>
        <q-btn class="btn-primary" @click="confirm()" label="是"/>
      </div>
    </q-card>
  </q-dialog>

  <q-dialog v-model="endFlag">
    <q-card style="width:200px">
      <q-card-section class="row items-center">
        <div class="text-h6">是否结束本Bay</div>
        <q-space />
      </q-card-section>
      <div class="q-mb-md q-mt-md justify-around row">
        <q-btn class="btn-primary" @click="cancelEnd()" label="否"/>
        <q-btn class="btn-primary" @click="confirmEnd()" label="是"/>
      </div>
    </q-card>
  </q-dialog>

  <q-dialog v-model="QtyRuleFlag">
    <q-card style="width:200px">
      <q-card-section class="row items-center">
        <div>录入数量操过9999,请分批录入</div>
        <q-space />
      </q-card-section>
      <div class="q-mb-md q-mt-md justify-around row">
        <q-btn class="btn-primary" @click="cancelQtyRule()" label="否"/>
        <q-btn class="btn-primary" @click="confirmQtyRule()" label="是"/>
      </div>
    </q-card>
  </q-dialog>
</q-page>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      CountedByStatus: true,
      inputStatus: true,
      checkItemflag: false,
      QtyRuleFlag: false,
      rcvedpagination: {
        page: 1,
        rowsPerPage: 0
      },
      endFlag: false,
      deleteFlag: false,
      recordedBy: null,
      itemOrBarcode: null,
      icon: false,
      Purchase: [],
      Bay: '',
      Zone: '',
      checkList: true,
      checkItem: false,
      columns: [
        { name: 'zone', align: 'left', label: '通道号', field: 'zone', sortable: true },
        { name: 'bay', align: 'left', label: '货架号', field: 'bay', sortable: true },
        { name: 'status', align: 'left', label: '状态', field: 'status' },
        { name: 'recordedByRealName', align: 'left', label: '录入员', field: 'recordedByRealName' },
        { name: 'countedByRealName', align: 'left', label: '盘点员', field: 'countedByRealName' }
      ],
      item: {
        uom: ''
      },
      adjQty: null,
      data: [],
      areaName: null,
      areaId: null,
      realName: null,
      StocktakeLocationId: null,
      label: null,
      groupId: null,
      groupListFlag: true,
      countedByRealName: '',
      countedByRealCount: null,
      BayStatus: false,
      stocktakeLayoutLineId: null,
      commodity: {},
      stocktakeSkuId: null,
      cargo: [],
      StocktakeId: null
    }
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_GO', 'BTN_PAGE', 'CHANGE_TITLE', 'RETURNFALSE']),
    getStocktakeLayoutLinesByRecordedByAndGroup () { // 获取录入人盘点布局明细
      this.$api.Stocktake.getStocktakeLayoutLinesByRecordedByAndGroup(
        this.StocktakeLocationId,
        this.recordedBy,
        this.areaId,
        this.groupId
      ).then(res => {
        console.log(res)
        if (Number(res.data.code) === 1) {
          this.data = res.data.data.map(val => {
            let json = {}
            json.zone = val.zone
            json.bay = val.bay
            json.status = this.formatType(val.status)
            json.recordedByRealName = val.recordedByRealName
            json.countedByRealName = val.countedByRealName
            return json
          })
        } else {
          this.data = []
        }
      })
    },
    getStocktakeGroupList () { // 获取品类组
      this.$api.Stocktake.getStocktakeGroupList(this.StocktakeLocationId, this.areaId).then(res => {
        console.log(res)
        if (Number(res.data.code) === 1) {
          let arr = [ { id: 0, name: '全部' } ]
          // this.groupListFlag = true
          this.Purchase = arr.concat(res.data.data)
          this.label = this.Purchase[0].name
          this.groupId = this.Purchase[0].id
          this.getStocktakeLayoutLinesByRecordedByAndGroup()
        } else {
          // this.groupListFlag = false
          let arr = [ { id: 0, name: '全部' } ]
          this.Purchase = arr
          this.label = this.Purchase[0].name
          this.groupId = this.Purchase[0].id
          this.getStocktakeLayoutLinesByRecordedByAndGroup()
        }
      })
    },
    changeloc (loc) {
      console.log(loc)
      this.groupId = loc.id
      this.getStocktakeLayoutLinesByRecordedByAndGroup()
    },
    shelves () { // 获取盘点布局
      this.$api.Stocktake.getStocktakeLayoutLine(this.StocktakeLocationId, this.areaId, this.Zone, this.Bay).then(res => {
        console.log(res)
        if (Number(res.data.code) === 1) {
          this.stocktakeLayoutLineId = res.data.data.id
          if (res.data.data.recordedBy == null) {
            this.CountedByStatus = false
            this.$nextTick(() => {
              this.$refs.countedByRealName.focus()
            })
            console.log(this.CountedByStatus)
          } else if (res.data.data.status === 'C') {
            this.Zone = ''
            this.Bay = ''
            this.$refs.Zone.focus()
            this.POP_MSG('该货架已被' + res.data.data.recordedByRealName + '结束本BAY录入')
          } else if (res.data.data.recordedBy !== this.recordedBy) {
            this.Zone = ''
            this.Bay = ''
            this.$refs.Zone.focus()
            this.POP_MSG('该货架已被' + res.data.data.recordedByRealName + '锁定')
          } else {
            this.countedBy = res.data.data.countedBy
            this.countedByRealName = res.data.data.countedByRealName
            this.BayStatus = true
            this.CountedByStatus = true
            this.checkItemflag = true
            this.checkList = false
            this.inputStatus = false
            this.$refs.dom.focus()
            this.getStocktakeCount(res.data.data.id)
          }
        } else {
          this.POP_MSG('通道号/货架号不存在，请检查')
        }
      })
    },
    StocktakeName () {
      let externalNo = localStorage.getItem('externalNo')
      let StoreId = localStorage.getItem('StoreId')
      let postData = this.$qs.stringify({
        username: 'S' + externalNo + 'L' + StoreId + 'U' + this.countedByRealName,
        password: 1,
        grant_type: 'password',
        client_id: 'client-sim',
        client_secret: '0E8816F4-07D6-43D7-8917-7D51019043B9'
      })
      this.$api.User.login(postData).then(res => {
        this.token = 'Bearer ' + res.data.access_token
        this.$api.Print.NoToken_info(this.token).then(res => {
          console.log(res)
          let roles = res.data.data.roles[0]
          if (roles === 'StocktakeCount') {
            this.inputStatus = false
            this.$nextTick(() => {
              this.$refs.dom.focus()
            })
            this.countedBy = res.data.data.username
            this.countedByRealCount = res.data.data.realname
            this.countedByRealName = res.data.data.realname
            this.openStocktakeLayoutLine()
          }
          if (roles === 'StocktakeInput') {
            this.POP_MSG('该用户不是盘点人')
          }
        })
      }).catch(err => {
        console.log(err)
        this.POP_MSG('盘点人不存在，请检查')
      })
    },
    openStocktakeLayoutLine () { // 锁定盘点布局
      console.log(this.countedByRealCount)
      this.$api.Stocktake.openStocktakeLayoutLine(
        this.StocktakeLocationId,
        this.areaId,
        this.Zone,
        this.Bay,
        this.countedBy,
        this.countedByRealCount,
        this.recordedBy,
        this.realName
      ).then(res => {
        console.log(res)
        if (Number(res.data.code) === 1) {
          this.BayStatus = true
          this.CountedByStatus = true
          this.checkList = false
          this.checkItemflag = true
          this.inputStatus = false
          this.$nextTick(() => {
            this.$refs.dom.focus()
          })
        } else if (Number(res.data.code) === -7) {
          this.$api.Stocktake.openStocktake(this.StocktakeId).then(res => { // 开启盘点
            console.log(res)
            if (res.data.code > 0) {
              this.openStocktakeLayoutLine()
            } else {
              this.POP_MSG(res.data.msg)
            }
          })
        } else {
          this.inputStatus = true
          this.POP_MSG(res.data.msg)
        }
      })
    },
    Account () {
      this.$refs.pwd.focus()
    },
    getitem (itemOrBarcode) { // 获取盘点商品信息
      if (itemOrBarcode === '') {
        this.POP_MSG('条码/货号不能为空')
      } else if (itemOrBarcode === null) {
        this.POP_MSG('条码/货号不能为空')
      } else {
        this.$api.Stocktake.getStocktakeSku(this.StocktakeLocationId, this.itemOrBarcode).then(res => {
          if (Number(res.data.code) === 1) {
            this.$refs.dom.focus()
            this.itemOrBarcode = null
            this.checkList = false
            this.checkItem = true
            this.checkItemflag = false
            // this.item.uom = res.data.data.uomId
            this.stocktakeSkuId = res.data.data.id
            this.commodity = res.data.data
            console.log(this.commodity)
          } else {
            this.POP_MSG(res.data.msg)
          }
        })
      }
    },
    cancelQtyRule () {
      this.QtyRuleFlag = false
      this.adjQty = null
    },
    confirmQtyRule () { // 确定盘点录入
      this.$api.Stocktake.createOrUpdateStocktakeCount(
        this.stocktakeSkuId,
        this.adjQty,
        this.recordedBy,
        this.stocktakeLayoutLineId
      ).then(res => {
        console.log(res)
        if (Number(res.data.code) > 0) {
          this.checkItemflag = true
          this.checkItem = false
          // this.QtyRuleFlag = false
          this.adjQty = null
          this.$refs.dom.focus()
          this.getStocktakeCount(this.stocktakeLayoutLineId)
        } else {
          this.POP_MSG(res.data.msg)
        }
      })
    },
    qtyRule () {
      console.log(this.commodity.uomId)
      if (this.commodity.uomId === 'KG') {
        if (this.adjQty > 9999) {
          // this.QtyRuleFlag = true
          this.POP_MSG('录入数量操过9999,请分批录入')
          this.adjQty = null
        } else if (this.adjQty < 0) {
          this.POP_MSG('盘点数量不可为负数')
        } else {
          this.adjQty = this.Number2(this.adjQty)
          this.confirmQtyRule()
        }
      } else {
        if (Number.isInteger(this.adjQty) === false) {
          this.POP_MSG('非称重商品，不能输入非整数')
        } else {
          if (this.adjQty > 9999) {
            // this.QtyRuleFlag = true
            this.POP_MSG('录入数量操过9999,请分批录入')
            this.adjQty = null
          } else if (this.adjQty < 0) {
            this.POP_MSG('盘点数量不可为负数')
          } else {
            this.adjQty = Number(this.adjQty)
            this.confirmQtyRule()
          }
        }
      }
    },
    getStocktakeCount (stocktakeLayoutLineId) { // 获取录入人盘点布局明细
      this.$api.Stocktake.getStocktakeCount(stocktakeLayoutLineId).then(res => {
        console.log(res)
        this.$refs.dom.focus()
        if (Number(res.data.code) === 1) {
          this.cargo = res.data.data
          console.log(this.cargo)
          this.icon = true
        } else {
          this.cargo = []
          this.icon = false
        }
      })
    },
    cancel () {
      this.deleteFlag = false
    },
    deleteBay () {
      this.deleteFlag = true
    },
    confirm () { // 清除bay
      this.$api.Stocktake.resetStocktakeLayoutLine(
        this.stocktakeLayoutLineId,
        this.areaId,
        this.Zone,
        this.Bay,
        this.countedBy,
        this.recordedBy
      ).then(res => {
        console.log(res)
        this.deleteFlag = false
        if (Number(res.data.code) === 1) {
          // this.$router.back(-1)
          this.BayStatus = false
          this.inputStatus = true
          this.CountedByStatus = true
          this.Zone = null
          this.Bay = null
          this.countedByRealName = null
          this.adjQty = null
          this.cargo = []
          this.icon = false
          this.getStocktakeLayoutLinesByRecordedByAndGroup()
          this.checkList = true
          this.checkItemflag = false
          this.$nextTick(() => {
            this.$refs.Zone.focus()
          })
        } else {
          this.POP_MSG(res.data.msg)
        }
      })
    },
    cancelEnd () {
      this.endFlag = false
    },
    EndBay () {
      this.endFlag = true
    },
    confirmEnd () { // 结束本Bay
      console.log(this.realName)
      this.$api.Stocktake.closeStocktakeLayoutLine(
        this.stocktakeLayoutLineId,
        this.countedBy,
        this.countedByRealName,
        this.recordedBy,
        this.realName
      ).then(res => {
        if (Number(res.data.code) === 1) {
          console.log(res)
          this.BayStatus = false
          this.inputStatus = true
          this.CountedByStatus = true
          this.Zone = null
          this.Bay = null
          this.countedByRealName = null
          this.adjQty = null
          this.cargo = []
          this.icon = false
          this.$nextTick(() => {
            this.$refs.Zone.focus()
          })
          this.getStocktakeLayoutLinesByRecordedByAndGroup()
          this.checkList = true
          this.endFlag = false
          this.checkItemflag = false
        } else {
          this.POP_MSG(res.data.msg)
        }
      })
    },
    details (row) {
      console.log(row)
      this.Zone = row.zone
      this.Bay = row.bay
      this.shelves()
    },
    Channel () {
      this.$refs.shelves.focus()
    },
    formatType (status) {
      var TypeText
      switch (status) {
        case 'I':
          TypeText = '未开始'
          break
        case 'P':
          TypeText = '进行中'
          break
        case 'C':
          TypeText = '已结束'
          break
      }
      return TypeText
    }
  },
  created () {
    this.CHANGE_TITLE(this.$route.query.areaName)
    // this.areaName = this.$route.query.areaName
    this.areaId = this.$route.query.areaId
    this.realName = localStorage.getItem('realName')
    this.recordedBy = localStorage.getItem('username')
    this.StocktakeLocationId = localStorage.getItem('StocktakeLocationId')
    this.StocktakeId = localStorage.getItem('StocktakeId')
    this.getStocktakeGroupList()
  }
}
</script>
