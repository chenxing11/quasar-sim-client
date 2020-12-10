<template>
  <q-page class="q-pa-md">
    <div class="">
      <q-btn class="btn-back col-2 text-primary"
             flat
             icon="arrow_back_ios"
             style="font-size:1rem;"
             @click="$router.go(-1)" />
    </div>
    <div class="q-pa-md">
      <q-table flat
               :data="orderList"
               :columns="columns">

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td class=""
                  key="id"
                  :props="props">{{ props.row.id }}</q-td>
            <q-td class=""
                  key="itemId"
                  :props="props">{{ props.row.itemId }}</q-td>
            <q-td class=""
                  key="description"
                  :props="props">{{ props.row.description }}</q-td>
            <q-td class=""
                  key="barcode"
                  :props="props">{{ props.row.barcode }}</q-td>
            <q-td class=""
                  key="uom"
                  :props="props">{{ props.row.uom }}</q-td>
            <q-td class=""
                  key="qtyExpected"
                  :props="props">{{ props.row.qtyExpected }}</q-td>
            <q-td class=""
                  key="qtyReceived"
                  :props="props">{{ props.row.qtyReceived }}</q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-page>
</template>
<script>
export default {
  data () {
    return {
      columns: [
        {
          name: 'id',
          required: true,
          label: '序号',
          field: row => row.index,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'itemId', label: '商品编号', field: 'itemId' },
        { name: 'description', label: '商品描述', field: 'description' },
        { name: 'barcode', label: '国际条码', field: 'barcode' },
        { name: 'uom', label: '单位', field: 'uom' },
        { name: 'qtyExpected', label: '订购数量', field: 'qtyExpected' },
        { name: 'qtyReceived', label: '接收数量', field: 'qtyReceived' }
      ],
      orderList: [],
      orderSelectData: null
    }
  },
  created () {
    var data = this.$route.query.data
    this.orderSelectData = this.$route.query.obj
    this.getShipmentById(data.shipmentId)
  },
  beforeRouteLeave (to, from, next) {
    if (to.path === '/WebOrderSelect/Select') {
      to.query.data = this.orderSelectData
    }
    next()
  },
  methods: {
    getShipmentById (val) {
      this.$api.Rcv.getShipmentById(val).then(res => {
        console.log(res)
        if (res.data.code > 0) {
          this.orderList = res.data.data.shipmentLines.map((val, index) => {
            let json = {}
            json.id = index + 1
            json.itemId = val.itemId
            json.description = val.item.description
            json.barcode = val.barcode
            json.uom = val.item.uom.description
            json.qtyExpected = val.qtyExpected
            json.qtyReceived = val.qtyReceived
            return json
          })
          console.log(this.orderList)
        } else {
          this.POP_MSG(res.data.msg)
        }
      })
    }
  }
}
</script>
