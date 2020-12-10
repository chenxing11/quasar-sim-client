<template>
  <q-page class="orderlist">
    <q-list class="q-pa-sm">
      <q-table virtual-scroll
               flat
               :data="rtvData"
               :rows-per-page-options=[0]
               :columns="columns">
        <template v-slot:body="props">
          <q-tr class="allRcv">
            <q-td class="rcvtd"
                  key="externalNo"
                  :props="props">{{ props.row.externalNo }}</q-td>
            <q-td class="rcvtd"
                  key="supplier"
                  :props="props">{{ props.row.supplier }}</q-td>
            <q-td class="rcvtd"
                  key="supplierName"
                  :props="props">{{ props.row.supplierName }}</q-td>
          </q-tr>
        </template>
      </q-table>
    </q-list>
  </q-page>
</template>
<script>
export default {
  data () {
    return {
      columns: [
        { name: 'externalNo', align: 'left', label: '单据号', field: 'externalNo', sortable: true },
        { name: 'supplier', align: 'left', label: '供应商ID', field: 'supplier' },
        { name: 'supplierName', align: 'left', label: '供应商名称', field: 'supplierName' }
      ],
      rtvData: []
    }
  },
  created () {
    this.rtvData = JSON.parse(this.$route.query.data).map(val => {
      let json = {}
      json.externalNo = val.externalNo
      json.supplier = val.supplier.id
      json.supplierName = val.supplier.name
      return json
    })
  }
}
</script>
