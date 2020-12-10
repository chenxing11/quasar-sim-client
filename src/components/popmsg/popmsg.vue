
<template>
  <q-dialog persistent v-model="is_show" @keydown.enter="POP_SHOW()">
    <q-card class="poperror q-px-lg">
      <q-card-section>
        <div class="text-h6">错误</div>
      </q-card-section>
      <q-card-section>{{ $store.state.popMsg }}</q-card-section>
      <q-card-actions class="row justify-end">
        <q-btn
          flat
          type="submit"
          outline
          rounded
          push
          label="确定"
          color="white"
          @click="POP_SHOW()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style lang="stylus" ></style>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'popmsg',
  data () {
    return {}
  },
  methods: {
    ...mapMutations(['POP_SHOW', 'POP_MSG'])
  },
  computed: {
    is_show: {
      get () {
        return this.$store.state.popShow
      },
      set (newValue) {
        this.$store.state.popShow = newValue
      }
    }
  }
}
</script>
