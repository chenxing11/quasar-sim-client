<template>
  <q-page class="orderlist">
    <q-list class="q-pa-xs row">
      <q-item>
        <q-input
          outlined
          dense
          v-model="Zone"
          class="col-6 q-px-xs items-center"
          ref="zone"
          @keydown.enter.stop="bayFocus()"
        >
          <template v-slot:before>
            <div class=" column justify-center">
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
          ref="bay"
          @keydown.enter.stop="inputbarFocus()"
        >
          <template v-slot:before>
            <div class=" column justify-center">
              <span
                class="text-bold text-black"
                style="font-size:.9rem"
              >货架号</span>
            </div>
          </template>
        </q-input>
      </q-item>
      <q-item>
        <q-input
          outlined
          dense
          v-model="ItemTagPrintId"
          class="col-8 q-px-xs items-center"
          ref="zone"
          @keydown.enter.stop="bayFocus()"
        >
          <template v-slot:before>
            <div class=" column justify-center">
              <span
                class="text-bold text-black "
                style="font-size:.9rem"
              >打印单号</span>
            </div>
          </template>
        </q-input>
        <q-item-section class="col-4  q-pa-xs text-right">
          <q-btn
            class=" btn-primary "
            label="查询"
            @click="getItemTagPrintLine()"
          />
        </q-item-section>
      </q-item>
    </q-list>

    <div
      class="q-pa-xs tableBox"
      v-if="!inputStatus"
    >
      <q-table
        flat
        dense
        :data="listtoday"
        :columns="todaycolumns"
        row-key="index"
        table-style="max-height: 300px"
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
          <q-tr
            :props="props"
            @click.native="getItemTagPrint(props.row.id)"
          >
            <q-td
              class=""
              key="id"
              :props="props"
            >{{ props.row.id }}</q-td>
            <q-td
              class=""
              key="zone"
              :props="props"
            >{{ props.row.zone }}</q-td>
            <q-td
              class=""
              key="bay"
              :props="props"
            >{{ props.row.bay }}</q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
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
      ItemTagPrintId: null,
      itemTagPrintLineId: null,
      printStatus: false,
      Bay: null,
      Zone: null,
      loc: Number(localStorage.getItem('Location')),
      inputBar: null,
      itemId: null,
      barcode: null,
      LocationPrint: { printer: {} },
      pagination: {
        rowsPerPage: 0
      },
      columns: [
        { name: 'id', align: 'left', label: '序号', field: 'id' },
        { name: 'barcode', align: 'left', label: '国际条码', field: 'barcode' },
        { name: 'description', align: 'left', label: '商品名称', field: 'description' },
        { name: 'delete', align: 'center', label: '删除', field: 'delete' }
      ],
      todaycolumns: [
        { name: 'id', align: 'left', label: '打印单号', field: 'id' },
        { name: 'zone', align: 'left', label: '通道号', field: 'zone' },
        { name: 'bay', align: 'left', label: '货架号', field: 'bay' }
      ],
      tagPrintlist: [],
      listtoday: []
    }
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_GO', 'BTN_PAGE', 'CHANGE_TITLE']),
    getlisttoday () {
      this.$api.Stocktake.listItemTagPrintToday().then(res => {
        console.log(res.data.data)
        this.listtoday = res.data.data.map((val, index) => {
          let json = {}
          json.id = val.id
          json.bay = val.bay
          json.zone = val.zone
          return json
        })
        console.log(this.listtoday)
      })
    },
    getItemTagPrint (id) {
      this.$api.Stocktake.getItemTagPrintById(id).then(res => {
        this.tagPrintlist = res.data.data.itemTagPrintLines.map((val, index) => {
          let json = {}
          json.id = index + 1
          json.itemId = val.itemId
          json.lineId = val.id
          json.description = val.item.description
          json.barcode = val.barcode
          return json
        })
        this.inputStatus = true
      })
    },
    ListLocationPrinters (locationId, authName, jobName) {
      this.$api.LocationPrint.ListLocationPrinters(locationId, authName, jobName).then(res => {
        this.LocationPrint = res.data.data[0]
        console.log(this.LocationPrint)
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
    getItemTagPrintLine () {
      var TagPrintId
      if (this.ItemTagPrintId === null) {
        TagPrintId = 0
      } else {
        TagPrintId = this.ItemTagPrintId
      }
      let selectdata = {
        ItemTagPrintId: TagPrintId,
        Zone: this.Zone,
        Bay: this.Bay
      }
      console.log(selectdata)
      this.$api.Stocktake.getItemTagPrintLine(selectdata).then(res => {
        console.log(res.data)
        this.listtoday = res.data.data.map((val, index) => {
          let json = {}
          json.id = val.itemTagPrintId
          json.bay = val.bay
          json.zone = val.zone
          return json
        })
      })
    }
  },
  created () {
    this.CHANGE_TITLE('库区商品标签打印查询')
    this.getlisttoday()
    this.ListLocationPrinters(this.loc, 'StockItemTagPrint', 8)
  }
}
</script>
