<template>
  <q-page  class="">
  无
  </q-page>
</template>

<style lang="stylus" >
</style>

<script>
import { mapMutations } from 'vuex'
import { date } from 'quasar'
let timeStamp = Date.now()
// let printtime = date.formatDate(timeStamp, 'YYYY-MM-DDTHH:mm:ss.SSSZ')

export default {
  name: 'PageStoreRcvOrder',
  data () {
    return {
      AreaList: [],
      Area: null,
      GroupList: [],
      Group: null,
      stocktakeId: null
    }
  },
  watch: {
    Area (val) {
      if (val !== null) {
        this.getStocktakeGroupList(5, val.value)
      }
    },
    stocktakeId (val) {
      if (val !== null) {
        this.getStocktakeAreaList(val)
      }
    }
  },
  created () {
    this.getStocktakeAreaList()
  },
  mounted () {
    this.printtime = date.formatDate(timeStamp, 'YYYY-MM-DDTHH:mm:ss.SSSZ')
    this.printstatus = true
  },
  computed: {
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_PAGE']),
    getStocktakeAreaList () {
      this.$api.Stocktake.getStocktakeAreaList(5).then(res => {
        // 获取订单信息
        console.log(res)
        this.AreaList = res.data.data.map(val => {
          let json = {}
          json.value = val.id
          json.label = val.description
          return json
        })
        console.log(this.AreaList)
      })
    },
    getStocktakeGroupList (stocktakeLocationId, areaid) {
      this.$api.Stocktake.getStocktakeGroupList(stocktakeLocationId, areaid).then(res => {
        // 获取订单信息
        console.log(res)
        this.GroupList = res.data.data.map(val => {
          let json = {}
          json.value = val.id
          json.label = val.name
          return json
        })
        console.log(this.GroupList)
      })
    }
  }
}
</script>
