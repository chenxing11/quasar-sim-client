<template>
  <q-layout view="lHh Lpr lFf" >
    <q-header>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
      <q-footer>
  </q-footer>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'

export default {
  name: 'NewSIM',
  data () {
    return {
    }
  },
  methods: {
    openURL
  }
}
</script>

<style lang="stylus" >
.test
  background-color white
</style>
