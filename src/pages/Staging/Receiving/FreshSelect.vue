
<template>
  <q-page>
    <div>
      <div class="flex flex-center q-pa-sm">
        <q-form
          @keydown.enter="get_order(orderNo)"
          @submit.prevent="RETURNFALSE()"
          class="orderinput"
        >
          <q-input
            autofocus
            outlined
            v-model.number="orderNo"
            label="发运单号"
          >
            <template v-slot:append>
              <q-icon
                name="close"
                @click="orderNo = null"
                class="cursor-pointer"
              />
            </template>
          </q-input>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<style lang="stylus" >
.order-pop {
  width: 100%;
}

.rcvInputLabel {
  vertical-align: bottom;
  line-height: 40px;
  text-align: center;
}

#orderCostInput, #orderQtyInput {
  max-width: 100px;
  text-align: center;
}
</style>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'PageStoreReceiving',
  data () {
    return {
      temp: true,
      orderNo: null, // 订单号输入
      orderId: null,
      dsdStatus: false,
      shipmentLinesTemp: [], // 暂存单
      tempSelected: [], // 暂存单选定行数据
      rcvedpagination: {
        page: 1,
        rowsPerPage: 0
      },
      columns: [
        {
          name: 'externalNo',
          required: true,
          label: '订单号',
          align: 'left',
          field: row => row.externalNo,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'supplierName', align: 'center', label: '供应商', field: 'supplierName', sortable: true }
        // { name: 'status', label: '状态', field: 'status', sortable: true }
      ] // 暂存表单
    }
  },
  created () {
    this.CHANGE_TITLE('订单收货')
    this.BTN_PAGE(true)
  },
  mounted () {
  },
  watch: {
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_GO', 'BTN_PAGE', 'CHANGE_TITLE', 'RETURNFALSE']),
    get_order (val) {
      if (val === null || val === '') {
        this.POP_MSG('订单号不能为空')
      } else {
        this.$api.Rcv.GetOrderByDocumentOrderId(val).then(res => { // 获取订单信息
          if (res.data.code === 0) {
            this.POP_MSG(res.data.msg)
          } else if (res.data.data.status === 'C') {
            this.POP_MSG('订单已关闭')
          } else {
            console.log('订单信息')
            console.log(res.data.data)
            if (res.data.data.orderLines[0].locationId !== this.$store.state.location.id) {
              this.POP_MSG('该订单不是 ' + this.$store.state.location.id + ' 门店订单')
            } else {
              this.orderId = res.data.data.id
              this.$router.push({ path: '/Rcv/FreshOrder', query: { orderNo: val, orderId: this.orderId, loc: this.$store.state.location.id } })
            }
          }
        })
      }
    }
  }
}
</script>
