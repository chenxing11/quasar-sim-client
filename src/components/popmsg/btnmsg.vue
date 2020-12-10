
<template>
  <q-dialog  persistent v-model="is_show">
      <q-card class="poptip">
        <q-card-section>
          <div class="text-h6">跳转</div>
        </q-card-section>
        <q-card-section>
          {{ '是否跳转至' + $store.state.btnLabel }}
        </q-card-section>
        <q-card-actions class="row justify-center">
          <q-btn  class="btn-primary" type="submit"   label="是"  :to=$store.state.btnRouter @click="is_go" />
          <q-btn  class="btn-negative"  label="否" @click="BTN_SHOW()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<style lang="stylus" >

</style>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'btnmsg',
  data () {
    return {
    }
  },
  methods: {
    ...mapMutations(['BTN_SHOW', 'BTN_GO']),
    is_go () {
      this.BTN_SHOW()
    }
  },
  computed: {
    is_show: {
      get () {
        return this.$store.state.btnShow
      },
      set (newValue) {
        this.$store.state.btnShow = newValue
      }
    }
  }
}
</script>
