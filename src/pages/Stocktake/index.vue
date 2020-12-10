<template>
  <div class="q-pa-xs">
   <q-bar class="row" style="background:#1f533c;color:#fff;">
      <q-item-label class="col-4 text-center"  style="font-size:.9rem;">{{externalNo}}</q-item-label>
      <q-item-label class="col-4 text-center"  style="font-size:.9rem;">{{stocktakeDate}}</q-item-label>
      <q-item-label class="col-4 text-center"  style="font-size:.9rem;">{{stocktakeType}}</q-item-label>
    </q-bar>
  <q-list>
     <div v-for="(item,index) in links" :key="index">
      <q-item  clickable v-ripple :to="item.Subrouter">
        <q-item-section>{{item.label}}</q-item-section>
        <q-item-section avatar>
          <div class="arrow"></div>
        </q-item-section>
      </q-item>
      <q-separator inset />
    </div>
    </q-list>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      links: [
        {
          label: '库区商品标签查询及打印',
          Subrouter: '/Stocktake/ReadyStocktake',
          AuthName: 'StockItemTagPrint'
        },
        {
          label: '盘点录入',
          Subrouter: '/Stocktake/MenuStocktake',
          AuthName: 'StocktakeCount'
        },
        {
          label: '盘点进度查询(店长)',
          Subrouter: '/Stocktake/SpeedStocktake',
          AuthName: 'StocktakeComplete'
        },
        {
          label: '盘点进度查询',
          Subrouter: '/Stocktake/DirSpeedStocktake',
          AuthName: 'StocktakeProcess'
        },
        {
          label: '盘点设置',
          Subrouter: '/Stocktake/SetStocktake',
          AuthName: 'StocktakeTerminalLock'
        }
      ],
      externalNo: null,
      stocktakeDate: null,
      stocktakeType: null
    }
  },
  created () {
    this.CHANGE_TITLE('盘点')
    this.externalNo = localStorage.getItem('externalNo')
    this.stocktakeDate = localStorage.getItem('stocktakeDate')
    this.stocktakeType = this.formatType(localStorage.getItem('stocktakeType'))
    let power = this.$store.state.auths
    let arr = []
    this.links.forEach((v, i) => {
      power.forEach((val, index) => {
        if (v.AuthName === val) {
          arr.push(v)
        }
      })
    })
    this.links = arr
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_GO', 'BTN_PAGE', 'CHANGE_TITLE']),
    formatType (status) {
      var TypeText
      switch (status) {
        case 'FW':
          TypeText = '生鲜周盘'
          break
        case 'FA':
          TypeText = '生鲜月盘'
          break
        case 'M':
          TypeText = '食百大盘'
          break
      }
      return TypeText
    }
  }
}
</script>
<style scoped>
.arrow{
  width: 7px;
  height: 7px;
  border-top: 2px solid #666;
  border-right: 2px solid #666;
  transform: rotate(45deg);
}
</style>
