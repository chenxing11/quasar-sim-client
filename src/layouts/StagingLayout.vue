<template>
  <q-layout view="lHh Lpr lFf">
        <popmsg />
        <btnmsg />
    <q-header class="glossy">
      <q-slide-transition :duration="100">
      <q-bar dense class="row justify-between bg-primary text-white" v-if="user">
      <div><q-icon name="account_balance" />
      <span class="q-px-sm">{{$store.state.location.id}}</span><q-icon name="account_box" /><span class="q-px-sm">{{$store.state.realName }}</span></div>
      <span class="justify-end">{{ datenow }}</span>
    </q-bar>
      </q-slide-transition>
        <q-toolbar class="row bg-white" style="min-height:100%">
      <q-btn class="btn-back col-2 text-primary" flat
             icon="arrow_back_ios"
             @click="$router.back(-1)" /><span class="col-8 text-black text-weight-bold text-center">{{ $store.state.title }}</span>
                          <q-btn class="btn-back col-1 text-primary" flat
             :icon="user? 'close':'account_box'"
             @click="user = !user" />
             <q-btn class="btn-back col-1 text-primary" flat
             :icon="footer? 'close':'menu'"
             @click="footer = !footer" />
    </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
      <q-footer elevated class="glossy">
        <q-slide-transition :duration="500">
      <div v-if="footer"
        indicator-color="white"
        active-color="white"
        class="row bhg-footer">
        <q-btn id='btn-home' class="col-4 btn-tabs" name="home" icon="home" :label="btns.home.btnLabel" @click="$store.state.btnPage ? BTN_GO(btns.home):pagego(btns.home.btnRouter)" exact />
        <q-btn id='btn-Staging' class="col-4 btn-tabs" name="Staging" icon="view_module" :label="btns.Staging.btnLabel" @click="$store.state.btnPage ? BTN_GO(btns.Staging):pagego(btns.Staging.btnRouter)" exact />
        <q-btn id='btn-Setting' class="col-4 btn-tabs" name="Setting" icon="settings" :label="btns.Setting.btnLabel" @click="$store.state.btnPage ? BTN_GO(btns.Setting):pagego(btns.Setting.btnRouter)" exact />
      </div>
        </q-slide-transition>
  </q-footer>
  </q-layout>
</template>

<script>
import { openURL, date } from 'quasar'
import { mapMutations } from 'vuex'
var timeStamp = Date.now()

export default {
  name: 'NewSIM',
  data () {
    return {
      btnPage1: this.$store.state.btnPage,
      leftDrawerOpen: this.$q.platform.is.desktop,
      user: false,
      footer: false,
      datenow: null,
      btns: {
        home:
        {
          btnLabel: '首页',
          btnRouter: '/'
        },
        Staging:
        {
          btnLabel: '功能',
          btnRouter: '/Staging'
        },
        Setting:
        {
          btnLabel: '设置',
          btnRouter: '/Setting'
        }

      }
    }
  },
  created () {
    this.datenow = date.formatDate(timeStamp, 'YYYY-MM-DD')
  },
  methods: {
    ...mapMutations(['LOGINOUT', 'BTN_GO']),
    pagego (router) {
      this.$router.push(router)
    },
    openURL
  }
}
</script>

<style>
</style>
