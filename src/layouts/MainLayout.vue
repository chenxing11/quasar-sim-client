<template>
  <q-layout view="lHh Lpr lFf">
    <popmsg />
    <btnmsg />
    <q-header
      elevated
      class=""
    >
      <q-bar
        dense
        class="row justify-between bg-primary text-white mobile-only"
      >
        <div>
          <q-icon name="account_balance" />
          <span class="q-px-sm">{{$store.state.location.id}}</span>
          <q-icon name="account_box" /><span class="q-px-sm">{{$store.state.realName }}</span>
        </div>
        <span class="justify-end">{{ datenow }}</span>
      </q-bar>
      <q-toolbar class="text-primary bg-white mobile-hide no-shadow">
        <q-toolbar-title>
          <q-btn
            flat
            dense
            round
            @click="leftDrawerOpen = !leftDrawerOpen"
            aria-label="Menu"
            icon="menu"
          >
            <q-tooltip>切换</q-tooltip>
          </q-btn>
        </q-toolbar-title>
        <span class="q-px-sm">{{$store.state.location.id}}</span>
        <span class="q-px-sm">{{$store.state.location.name}}</span>
        <span class="q-px-sm">{{$store.state.realName }}</span>
        <q-btn
          flat
          icon="settings"
          to="/Setting"
          exact
        >
          <q-tooltip>设置</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>
    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      content-class="col-2 bg-primary text-white mobile-hide"
    >
      <q-list
        padding
        class="menu-list"
      >
        <q-item-label
          header
          class="text-yellow-4"
        >BHG LifeStyle</q-item-label>
        <q-item
          to="/index"
          clickable
          active-class="text-yellow-4"
        >
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>
            首页
          </q-item-section>
        </q-item>
        <q-expansion-item
          v-for="i in adminList"
          :key="i.id"
          expand-icon-class="text-white"
        >
          <template v-slot:header>
            <q-item-section avatar>
              <q-icon :name="i.icon" />
            </q-item-section>

            <q-item-section>
              {{i.label}}
            </q-item-section>
          </template>
          <q-list class="text-center bg-grey-9">
            <q-item
              v-for="l in i.list"
              :key="l.id"
              :to="l.link"
              active-class="text-white bg-secondary"
            >
              <q-item-section>
                <q-item-label>{{l.description}}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>
      </q-list>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer
      elevated
      class
    >
      <div
        indicator-color="white"
        active-color="white"
        class="row bhg-footer mobile-only"
      >
        <q-btn
          id="btn-home"
          class="col-4 btn-tabs"
          name="home"
          icon="home"
          :label="btns.home.btnLabel"
          @click="$store.state.btnPage ? BTN_GO(btns.home):pagego(btns.home.btnRouter)"
          exact
        />
        <q-btn
          id="btn-Staging"
          class="col-4 btn-tabs"
          name="Staging"
          icon="view_module"
          :label="btns.Staging.btnLabel"
          @click="$store.state.btnPage ? BTN_GO(btns.Staging):pagego(btns.Staging.btnRouter)"
          exact
        />
        <q-btn
          id="btn-Setting"
          class="col-4 btn-tabs"
          name="Setting"
          icon="settings"
          :label="btns.Setting.btnLabel"
          @click="$store.state.btnPage ? BTN_GO(btns.Setting):pagego(btns.Setting.btnRouter)"
          exact
        />
      </div>
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
      stocktakeauth: ['Index'],
      btnPage1: this.$store.state.btnPage,
      leftDrawerOpen: this.$q.platform.is.desktop,
      btns: {
        home: {
          btnLabel: '首页',
          btnRouter: '/'
        },
        Staging: {
          btnLabel: '功能',
          btnRouter: '/Staging'
        },
        Setting: {
          btnLabel: '设置',
          btnRouter: '/Setting'
        }
      },
      adminList: [],
      authList: [
        {
          id: 1,
          label: '盘点',
          icon: 'las la-mobile',
          list: [
            { id: 1, description: '盘点管理', link: '/WebStocktake/Manage', auth: 'StocktakeManagement', isActive: false },
            { id: 2, description: '盘点导入', link: '/WebStocktake/Imp', auth: 'StocktakeUpload', isActive: false }
          ]
        },
        {
          id: 2,
          label: '单据查询',
          icon: 'las la-list',
          list: [
            { id: 1, description: '收退货单据', link: '/WebOrderSelect/Select', auth: 'PoReceiving', isActive: false }
          ]
        },
        {
          id: 3,
          label: '生鲜自采',
          icon: 'las la-apple-alt',
          list: [
            { id: 1, description: '自采订货', link: '/FreshOrder/OrderList', auth: 'FreshPurchase', isActive: false },
            { id: 2, description: '自采审批', link: '/FreshOrder/OrderListAuditing', auth: 'FreshPurchaseApproval', isActive: false }
          ]
        },
        {
          id: 4,
          label: '退货审批',
          icon: 'las la-apple-alt',
          list: [
            { id: 1, description: '退货至仓库', link: '/return/returnRtw', auth: 'SystemSetting', isActive: false },
            { id: 2, description: '退货至供应商', link: '/return/returnRtv', auth: 'SystemSetting', isActive: false }
          ]
        },
        {
          id: 5,
          label: '系统管理',
          icon: 'las la-cog',
          list: [
            { id: 1, description: '版本更新', link: '/Sys/SetVersion', auth: 'SystemSetting', isActive: false }
          ]
        }
      ]
    }
  },
  created () {
    this.datenow = date.formatDate(timeStamp, 'YYYY-MM-DD')
    this.getAuths()
    this.GetPermissions()
    if (this.$store.state.location === null) {
      this.GET_LOCATION({ id: 0 })
    }
  },
  methods: {
    ...mapMutations(['LOGINOUT', 'BTN_GO', 'GET_LOCATION']),
    getAuths () {
      this.$api.User.info().then(res => {
        this.stocktakeauth = JSON.stringify(res.data.data.auths)
        this.StocktakeUpload = this.stocktakeauth.includes('StocktakeUpload')
        this.StocktakeManagement = this.stocktakeauth.includes('StocktakeManagement')
        this.SystemSetting = this.stocktakeauth.includes('SystemSetting')
      })
    },
    async GetPermissions () {
      await this.$api.User.info().then(res => {
        var arr = res.data.data.auths
        // console.log(arr)
        this.authList.forEach(
          l => l.list.forEach(m => {
            arr.forEach(n => {
              if (m.auth === n) {
                m.isActive = true
              }
            })
          }))
      })
      // console.log(this.authList)
      this.adminList = this.authList.map(i => {
        var json = i
        json.list = i.list.filter(m => m.isActive === true)
        return json
      }).filter(k => k.list.length !== 0)
      // console.log(this.adminList)
    },
    pagego (router) {
      this.$router.push(router).catch(err => {
        console.log(err)
      })
    },
    openURL
  }
}
</script>

<style>
</style>
