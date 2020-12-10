<template>
  <div class="q-pa-xs">
    <q-list>
      <div v-for="(item,index) in links"
           :key="index">
        <q-item clickable
                v-ripple
                :to="item.Subrouter">
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
          label: '新建价签打印任务',
          Subrouter: '/Store/priceTagPrint'
        },
        {
          label: '价签打印历史查询',
          Subrouter: '/Store/PriceTagSelect'
        }
      ]
    }
  },
  created () {
    this.CHANGE_TITLE('价签打印')
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_GO', 'BTN_PAGE', 'CHANGE_TITLE'])
  }
}
</script>
<style scoped>
.arrow {
  width: 7px;
  height: 7px;
  border-top: 2px solid #666;
  border-right: 2px solid #666;
  transform: rotate(45deg);
}
</style>
