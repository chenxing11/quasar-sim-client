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
          label: '新建',
          Subrouter: '/Bill/BillList',
          AuthName: 'InventoryAdjustQuery'
        },
        {
          label: '查询',
          Subrouter: '/Bill/BillSelect',
          AuthName: 'InventoryAdjustQuery'
        }
      ]
    }
  },
  created () {
    this.CHANGE_TITLE('出清')
    let power = this.$store.state.auths
    // console.log(power)
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
