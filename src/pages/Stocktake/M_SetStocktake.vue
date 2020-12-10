<template>
  <div class="q-pa-xs">
   <q-list>
     <div v-for="(item,index) in links" :key="index">
      <q-item  clickable v-ripple :to="item.Subrouter">
        <q-item-section>{{item.label}}</q-item-section>
        <q-item-section avatar>
          <div class="container"></div>
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
          label: '盘点门店锁定',
          Subrouter: '/Stocktake/ShopLocking'
        }
        // {
        //   label: '门店人员配置',
        //   Subrouter: '/Stocktake/Staffing'
        // },
        // {
        //   label: '应急商品录入',
        //   Subrouter: '/Stocktake/UrgentStocktake'
        // }
      ]
    }
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_GO', 'BTN_PAGE', 'CHANGE_TITLE'])
  },
  created () {
    this.CHANGE_TITLE('盘点设置')
  }
}
</script>
<style scoped>
.container{
  width: 7px;
  height: 7px;
  border-top: 2px solid #666;
  border-right: 2px solid #666;
  transform: rotate(45deg);
}
</style>
