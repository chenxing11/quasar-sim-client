<template>
  <q-page class="orderlist">
    <q-list class="q-pa-xs">
      <q-card-section class="row q-pa-xs"
                      caption>
        <span class="q-pa-sm text-weight-bold text-black">价签类型</span>
        <!-- <span class="q-pa-sm text-grey-8">{{ 1111 }}</span> -->
        <q-option-group v-model="TagType"
                        :options="TagTypeList"
                        :disable="disabled"
                        color="primary"
                        inline />
      </q-card-section>

      <q-card-section class="q-pa-xs row items-center">
        <span class="q-pa-sm text-weight-bold text-black">货架编号</span>
        <q-input outlined
                 autofocus
                 :disable="disabled"
                 dense
                 style="width:200px"
                 v-model="Bay"
                 class="q-pa-sm text-grey-8"></q-input>
      </q-card-section>

      <q-card-section class="q-pa-xs row items-center">
        <span class="q-pa-sm text-weight-bold text-black">打印份数</span>
        <q-input id="adjQtyInput"
                 :input-style="{ 'text-align': 'center', 'width' : '120px' }"
                 color="black"
                 style="width:120px"
                 :suffix="item.uom"
                 :disable="disabled"
                 v-model.number="printQty"
                 :dense="true" />
      </q-card-section>

      <div class="q-pt-md q-pa-sm items-center">
        <q-form @keydown.enter="getitem(itemOrBarcode)"
                @submit="RETURNFALSE()"
                class="orderinput">
          <q-input ref="scan"
                   dense
                   outlined
                   v-model.number="itemOrBarcode"
                   label="商品编号">
            <template v-slot:append>
              <q-icon name="close"
                      @click="itemOrBarcode = null"
                      class="cursor-pointer" />
            </template>
          </q-input>
        </q-form>
      </div>

      <q-card-section v-show="flag"
                      class="q-pa-xs row items-center jsutify-center">
        <span class="q-pa-sm  text-grey-8">当前商品信息</span>
        <span class="q-pa-sm text-grey-8">{{ description }}</span>
      </q-card-section>

      <div class="q-pt-md q-pa-sm">
        <q-table table-style="max-height: 300px"
                 virtual-scroll
                 flat
                 :data="priceTagPrintData"
                 :pagination.sync="rcvedpagination"
                 :rows-per-page-options=[0]
                 :columns="columns">
          <template v-slot:body="props">
            <q-tr class="allRcv">
              <q-td class="rcvtd"
                    key="id"
                    :props="props">{{ props.row.id }}</q-td>
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
                    key="printQty"
                    :props="props">{{ props.row.printQty }}</q-td>
              <q-td class="rcvtd"
                    @click.native="deleteTagPrintLine(props.row.lineId)">
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
                 class="btn-primary"
                 @click="barcodePrint()"
                 label="打印" />
        </div> -->
        <div class="text-grey-8 q-gutter-xs q-pa-md">
          <q-btn dense
          @click="barcodePrint()"
                 class="btn-primary"
                 label="打印" />
        </div>
      </div>
    </q-list>
  </q-page>
</template>
<script>
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      columns: [
        { name: 'id', align: 'left', label: '序号', field: 'id' },
        { name: 'itemId', align: 'left', label: '商品编码', field: 'itemId' },
        { name: 'description', align: 'left', label: '商品描述', field: 'description' },
        { name: 'barcode', align: 'left', label: '商品条码', field: 'barcode' },
        { name: 'printQty', align: 'left', label: '打印份数', field: 'printQty' }
      ],
      rcvedpagination: {
        page: 1,
        rowsPerPage: 0
      },
      TagTypeList: [],
      item: {
        uom: ''
      },
      loc: localStorage.getItem('Location'),
      LocationPrint: { printer: {} },
      TagType: null,
      Bay: null,
      itemOrBarcode: null,
      printQty: 1,
      flag: false,
      disabled: false,
      description: null,
      priceTagPrintData: [],
      itemId: null,
      barcode: null,
      itemTagPrintId: null
    }
  },
  watch: {
    TagType (val) {
      var LocationPrint = {}
      this.TagTypeList.map(res => {
        if (res.value === val) {
          LocationPrint.printer = res.printer
        }
      })
      this.LocationPrint = LocationPrint
    }
  },
  created () {
    this.CHANGE_TITLE('新建价签')
    this.ListAllLocationPrinters(this.loc, 'ItemTagPrint')
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_GO', 'BTN_PAGE', 'CHANGE_TITLE', 'RETURNFALSE']),
    ListAllLocationPrinters (locationId, authName) {
      var _this = this
      this.$api.LocationPrint.ListAllLocationPrinters(locationId, authName).then(res => {
        console.log(res)
        if (res.data.code === 1) {
          this.LocationPrint.printer = res.data.data[0].printer
          this.TagTypeList = res.data.data.map(val => {
            let json = {}
            json.label = val.jobDescription
            json.value = val.jobName
            json.printer = val.printer
            return json
          })
          this.TagType = this.TagTypeList[0].value
        } else {
          // this.POP_MSG(res.data.msg)
          this.$q.notify({
            position: 'top',
            timeout: 1500,
            message: res.data.msg
          })
          setTimeout(() => {
            _this.$router.go(-1)
          }, 2000)
        }
      })
    },
    getitem () {
      if (this.itemOrBarcode === '' || this.itemOrBarcode === null) {
        this.POP_MSG('条码/货号不能为空')
      } else {
        this.$api.Rcv.getitem(this.loc, this.itemOrBarcode).then(res => {
          console.log(res)
          if (res.data.code === 1) {
            this.flag = true
            this.disabled = true
            this.description = res.data.data.item.description
            if (this.itemOrBarcode === Number(res.data.data.item.id)) {
              console.log(111)
              this.itemId = res.data.data.item.id
              this.barcode = res.data.data.primaryBarcode
              if (this.itemTagPrintId === null) {
                this.createHead()
              } else {
                this.createline(this.itemTagPrintId)
              }
            } else {
              console.log(222)
              this.itemId = res.data.data.item.id
              this.barcode = this.itemOrBarcode
              if (this.itemTagPrintId === null) {
                this.createHead()
              } else {
                this.createline(this.itemTagPrintId)
              }
            }
            this.itemOrBarcode = null
          } else {
            this.flag = false
            this.POP_MSG(res.data.msg)
          }
        })
      }
    },
    createHead () {
      let headdata = {
        LocationId: this.loc,
        Type: 'IT',
        Format: this.TagType,
        Qty: this.printQty,
        Zone: null,
        Bay: this.Bay
      }
      console.log(headdata)
      this.$api.Stocktake.createItemTagPrint(headdata).then(res => {
        console.log(res)
        this.itemTagPrintId = res.data.data.itemTagPrintId
        this.createline(res.data.data.itemTagPrintId)
      })
    },
    createline (id) {
      let linedata = {
        ItemTagPrintId: id,
        ItemId: this.itemId,
        Barcode: this.barcode
      }
      console.log(linedata)
      this.$api.Stocktake.createItemTagPrintLine(linedata).then(res => {
        console.log(res.data)
        this.getItemTagPrint(id)
        this.inputBar = null
        this.inputStatus = true
      })
    },
    getItemTagPrint (id) {
      this.$api.Stocktake.getItemTagPrintById(id).then(res => {
        console.log(res)
        this.priceTagPrintData = res.data.data.itemTagPrintLines.map((val, index) => {
          let json = {}
          json.id = index + 1
          json.itemId = val.itemId
          json.lineId = val.id
          json.description = val.item.description
          json.barcode = val.barcode
          json.printQty = res.data.data.qty
          return json
        })
        console.log(this.priceTagPrintData)
      })
    },
    deleteTagPrintLine (id) {
      this.$api.Stocktake.deleteItemTagPrintLine(id).then(res => {
        console.log(res.data.data)
        this.getItemTagPrint(this.itemTagPrintId)
      })
    },
    barcodePrint () {
      let arr = []
      for (var i = 0; i < this.printQty; i++) {
        this.priceTagPrintData.map(val => {
          arr.push(val.barcode)
        })
      }
      console.log(arr)
      var link = 'http://' + this.LocationPrint.printer.ip + ':8006/print'
      var json = {
        type: this.TagType,
        barcodes: arr
      }
      this.$axios({
        method: 'post',
        url: link,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: json
      }).then(res => {
        console.log(res)
        if (res.data.code === 1) {
          this.NotiSuccess(res.data.msg)
        } else {
          this.POP_MSG(res.data.msg)
        }
      })
    }
  }
}
</script>
