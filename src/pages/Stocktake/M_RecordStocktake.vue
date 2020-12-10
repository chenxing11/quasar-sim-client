<template>
  <q-page class="orderlist">
    <q-list class="q-pa-xs row">
      <q-item>
        <div class="self-stretch column justify-center">
          <span class="text-bold text-black">打印单号:</span></div>
        <q-item-section class="text-bold text-black">{{ itemTagPrintId  }}</q-item-section>
      </q-item>
      <q-item>
        <q-input
          outlined
          dense
          v-model="Zone"
          class="col-6 q-px-xs items-center"
          :disable="inputStatus"
          ref="zone"
          @keydown.enter.stop="bayFocus()"
        >
          <template v-slot:before>
            <div class="self-stretch column justify-center">
              <span
                class="text-bold text-black "
                style="font-size:.9rem"
              >通道号</span>
            </div>
          </template>
        </q-input>

        <q-input
          outlined
          dense
          v-model="Bay"
          class="col-6 q-px-xs items-center"
          :disable="inputStatus"
          ref="bay"
          @keydown.enter.stop="inputbarFocus()"
        >
          <template v-slot:before>
            <div class="self-stretch column justify-center">
              <span
                class="text-bold text-black"
                style="font-size:.9rem"
              >货架号</span>
            </div>
          </template>
        </q-input>
      </q-item>
    </q-list>
    <q-separator inset />
    <q-list class="q-pa-md">
      <q-form
        @keydown.enter="getitem()"
        @submit="RETURNFALSE()"
      >
        <q-input
          outlined
          dense
          label="扫描商品"
          v-model="inputBar"
          ref="inputbar"
        />
      </q-form>
    </q-list>

    <div
      class="q-pa-xs tableBox"
      v-if="inputStatus"
    >
      <q-table
        flat
        dense
        :data="tagPrintlist"
        :columns="columns"
        row-key="index"
        table-style="max-height: 500px"
        virtual-scroll
        :pagination.sync="pagination"
        :rows-per-page-options="[0]"
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              class="text-black"
              style="font-size:0.8rem;font-weight:bold;"
            >
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td
              class=""
              key="id"
              :props="props"
            >{{ props.row.id }}</q-td>
            <q-td
              class=""
              key="barcode"
              :props="props"
            >{{ props.row.barcode }}</q-td>
            <q-td
              class=""
              key="description"
              :props="props"
            >{{ props.row.description }}</q-td>
            <q-td
              class=""
              key="delete"
              :props="props"
            >
              <q-btn
                flat
                @click="deleteItemTagPrintLine(props.row.lineId)"
                icon="remove_circle_outline"
              />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <div class="rcv-btn">
      <div class="text-grey-8 q-gutter-xs q-pa-md">
        <q-btn
          class="btn-primary"
          label="打印"
          @click="printStatus = true"
          :disable="!inputStatus"
        />
      </div>
    </div>
    <q-dialog
      v-model="printStatus"
      persistent
    >
      <q-card class="poptip col-5 q-px-lg">
        <q-card-section
          align="center"
          class="text-h6"
        >标签单打印</q-card-section>
        <q-card-section class="row justify-center">
          <span class="q-ml-sm">是否打印？</span>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn
            flat
            label="否"
            @click="inputbarFocus()"
            class="btn-negative"
            v-close-popup
          />
          <q-btn
            flat
            label="是"
            @click="barcodePrint()"
            class="btn-primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      inputStatus: false,
      itemTagPrintId: null,
      itemTagPrintLineId: null,
      printStatus: false,
      Bay: null,
      Zone: null,
      loc: localStorage.getItem('Location'),
      inputBar: null,
      itemId: null,
      barcode: null,
      LocationPrint: { print: {} },
      pagination: {
        rowsPerPage: 0
      },
      columns: [
        { name: 'id', align: 'left', label: '序号', field: 'id' },
        { name: 'barcode', align: 'left', label: '国际条码', field: 'barcode' },
        { name: 'description', align: 'left', label: '商品名称', field: 'description' },
        { name: 'delete', align: 'center', label: '删除', field: 'delete' }
      ],
      tagPrintlist: [],
      checkList: true
    }
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_GO', 'BTN_PAGE', 'CHANGE_TITLE', 'RETURNFALSE']),
    bayFocus () {
      this.$refs.bay.focus()
    },
    inputbarFocus () {
      this.$refs.inputbar.focus()
    },
    getitem () {
      if (this.inputBar === '') {
        this.POP_MSG('条码/货号不能为空')
      } else {
        this.$api.Rcv.getitem(this.loc, this.inputBar).then(res => {
          if (res.data.code === 1) {
            console.log(res.data.data)
            if (this.inputBar === res.data.data.item.id) {
              console.log('条码检索失败，货号检索成功')
              console.log(res.data.data)
              this.itemId = res.data.data.item.id
              this.barcode = res.data.data.primaryBarcode
              if (this.itemTagPrintId === null) {
                this.createHead()
              } else {
                this.createline(this.itemTagPrintId)
              }
            } else {
              console.log('条码检索成功')
              console.log(res.data.data)
              this.itemId = res.data.data.item.id
              this.barcode = this.inputBar
              if (this.itemTagPrintId === null) {
                this.createHead()
              } else {
                this.createline(this.itemTagPrintId)
              }
            }
          } else {
            this.POP_MSG(res.data.msg)
          }
        })
      }
    },
    createHead () {
      let headdata = {
        LocationId: this.loc,
        Type: 'ST',
        Format: 'IS',
        Qty: 1,
        Zone: this.Zone,
        Bay: this.Bay
      }
      console.log(headdata)
      this.$api.Stocktake.createItemTagPrint(headdata).then(res => {
        this.itemTagPrintId = res.data.data.itemTagPrintId
        console.log(res.data)
        this.createline(res.data.data.itemTagPrintId)
      })
    },
    barcodePrint () {
      var link = 'http://' + this.LocationPrint.printer.ip + ':8006/print'
      var json = {
        type: 8,
        barcodes: this.tagPrintlist.map(i => i.barcode)
      }
      this.$axios({
        method: 'post',
        url: link,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: json
      }).then(res => {
        if (res.data.code === 1) {
          this.NotiSuccess(res.data.msg)
        } else {
          this.POP_MSG(res.data.msg)
        }
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
        console.log(res.data.data.itemTagPrintLines)
        this.tagPrintlist = res.data.data.itemTagPrintLines.map((val, index) => {
          let json = {}
          json.id = index + 1
          json.itemId = val.itemId
          json.lineId = val.id
          json.description = val.item.description
          json.barcode = val.barcode
          return json
        })
        console.log(this.tagPrintlist)
      })
    },
    deleteItemTagPrintLine (id) {
      this.$api.Stocktake.deleteItemTagPrintLine(id).then(res => {
        console.log(res.data.data)
        this.getItemTagPrint(this.itemTagPrintId)
      })
    },
    sendPrintJobToPOS (id) {
      this.$api.Stocktake.sendPrintJobToPOS(id).then(res => {
        if (res.data.code === 1) {
          console.log(res)
        } else {
          this.POP_MSG(res.data.msg)
        }
      })
    },
    ListLocationPrinters (locationId, authName, jobName) {
      this.$api.LocationPrint.ListLocationPrinters(locationId, authName, jobName).then(res => {
        this.LocationPrint = res.data.data[0]
        console.log(this.LocationPrint)
      })
    }
  },
  created () {
    this.CHANGE_TITLE('库区商品标签打印录入')
    this.ListLocationPrinters(this.loc, 'StockItemTagPrint', 8)
  }
}
</script>
