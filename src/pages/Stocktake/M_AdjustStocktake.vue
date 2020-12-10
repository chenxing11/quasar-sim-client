<template>
<q-page class="orderlist">
    <div class="q-pa-md">
      <q-table
        flat
        title="是否结束本Bay?"
        :data="data"
        :columns="columns"
        row-key="index"
        hide-bottom/>
    </div>
    <div class="return-btn" >
      <div class="text-grey-8 q-gutter-xs q-pa-md">
        <q-btn class="btn-primary" @click="$router.back(-1)" label="返回"/>
      </div>
    </div>
    <div class="rcv-btn" >
      <div class="text-grey-8 q-gutter-xs q-pa-md">
        <q-btn class="btn-primary" @click="EndBay()" label="结束"/>
      </div>
    </div>
</q-page>
</template>

<script>
export default {
  data () {
    return {
      columns: [
        { name: 'itemId', align: 'left', label: '序号', field: 'itemId', sortable: true },
        { name: 'description', align: 'left', label: '品名', field: 'description', sortable: true },
        { name: 'uom', align: 'left', label: '数量', field: 'uom' }
      ],
      data: [
        {
          itemId: 159,
          description: 6.0,
          uom: 24,
          qtyExpected: 4.0
        },
        {
          itemId: 159,
          description: 6.0,
          uom: 24,
          qtyExpected: 4.0
        }
      ]
    }
  },
  methods: {

  }
}
</script>
<style >
.return-btn{
  position: fixed;
  bottom: 0;
  left: 0;
}
</style>
