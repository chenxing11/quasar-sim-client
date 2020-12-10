<template>
  <div class="q-pa-xs">
   <q-list>
     <div v-for="(item,index) in links" :key="index">
      <q-item clickable v-ripple  :to="item.Subrouter">
        <q-item-section>{{item.label}}</q-item-section>
        <q-item-section avatar>
          <div class="container"></div>
        </q-item-section>
      </q-item>
      <q-separator inset />
    </div>
      <!-- <q-item clickable v-ripple :to="'/Stocktake/RecordStocktake'">
        <q-item-section>盘点准备录入</q-item-section>
        <q-item-section avatar>
          <div class="container"></div>
        </q-item-section>
      </q-item>
      <q-separator inset /> -->
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
          label: '库区商品标签打印查询',
          Subrouter: '/Stocktake/FindStocktake'
        },
        {
          label: '库区商品标签打印录入',
          Subrouter: '/Stocktake/RecordStocktake'
        }
      ]
    }
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_GO', 'BTN_PAGE', 'CHANGE_TITLE'])
  },
  created () {
    this.CHANGE_TITLE('店内码打印')
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
