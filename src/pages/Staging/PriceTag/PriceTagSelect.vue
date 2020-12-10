<template>
  <q-page class="orderlist">
    <q-list class="q-pa-xs">
      <q-card-section class="q-pa-xs row items-center">
        <span class="q-pa-sm text-weight-bold text-black">货架编号</span>
        <q-input outlined
                 autofocus
                 dense
                 style="width:220px"
                 v-model="bay"
                 class="q-pa-sm text-grey-8"></q-input>
      </q-card-section>

      <div class="rcv-btn row">
        <div class="text-grey-8 q-gutter-xs q-pa-md">
          <q-btn dense
                @click="barcodePrint()"
                 class="btn-primary"
                 label="打印" />
        </div>
        <div class="text-grey-8 q-gutter-xs q-pa-md">
          <q-btn dense
                  @click="findBtn()"
                 class="btn-primary"
                 label="查询" />
        </div>
      </div>

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
              <!-- <q-td class="rcvtd"
                    @click.native="deleteTagPrintLine(props.row.lineId)">
                <q-icon style="fong-size:20px;"
                        name="close"
                        class="cursor-pointer" />
              </q-td> -->
            </q-tr>
          </template>
        </q-table>
      </div>

      <!-- <div class="q-pt-md q-pa-sm items-center">
        <q-form @keydown.enter="getitem(shelfNum)"
                @submit="RETURNFALSE()"
                class="orderinput">
          <q-input ref="scan"
                   dense
                   outlined
                   v-model.number="shelfNum"
                   label="货架编号">
            <template v-slot:append>
              <q-icon name="close"
                      @click="shelfNum = null"
                      class="cursor-pointer" />
            </template>
          </q-input>
        </q-form>
      </div> -->
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
      priceTagPrintData: [],
      bay: null,
      printQty: null,
      locationId: null,
      jobName: null,
      LocationPrint: {}
    }
  },
  created () {
    this.CHANGE_TITLE('价签打印查询')
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_GO', 'BTN_PAGE', 'CHANGE_TITLE']),
    findBtn () {
      this.$api.LocationPrint.GetItemTagPrintTodayByBay(this.bay).then(res => {
        console.log(res)
        if (res.data.code === 1) {
          this.locationId = res.data.data.locationId
          this.jobName = res.data.data.format
          this.printQty = res.data.data.qty
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
          this.ListLocationPrinters()
        } else {
          this.POP_MSG(res.data.msg)
        }
      })
    },
    ListLocationPrinters () {
      this.$api.LocationPrint.ListLocationPrinters(this.locationId, 'ItemTagPrint', this.jobName).then(res => {
        console.log(res)
        if (res.data.code === 1) {
          this.LocationPrint.printer = res.data.data[0].printer
        } else {
          this.POP_MSG(res.data.msg)
        }
      })
    },
    barcodePrint () {
      let arr = []
      for (var i = 0; i < this.printQty; i++) {
        this.priceTagPrintData.map(val => {
          arr.push(val.barcode)
        })
      }
      var link = 'http://' + this.LocationPrint.printer.ip + ':8006/print'
      var json = {
        type: this.jobName,
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
