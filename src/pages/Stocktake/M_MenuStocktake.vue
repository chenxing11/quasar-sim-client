<template>
<div class="q-pa-xs">
<q-list>
    <div v-for="(item,index) in links" :key="index">
      <q-item clickable v-ripple  :to="{path:'/Stocktake/AreaStocktake', query:{areaName:item.label,areaId:item.id}}">
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
      StocktakeLocationId: null,
      links: []
    }
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_GO', 'BTN_PAGE', 'CHANGE_TITLE']),
    getStocktakeAreaList () { // 获取区域
      this.StocktakeLocationId = localStorage.getItem('StocktakeLocationId')
      this.$api.Stocktake.getStocktakeAreaList(this.StocktakeLocationId).then(res => {
        console.log(res)
        this.links = res.data.data.map(val => {
          let json = {}
          json.label = val.description
          json.id = val.id
          return json
        })
      })
    }
  },
  created () {
    this.CHANGE_TITLE('盘点录入')
    this.getStocktakeAreaList()
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
