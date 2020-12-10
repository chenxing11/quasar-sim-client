<template>
  <q-page>
    <q-list>
      <q-item>
        <q-item-section class="justify-between">
          <q-item-label caption>服务器版本号</q-item-label>
          <q-item-label>{{ServerVersion}}</q-item-label>
        </q-item-section>
        <q-item-section class="justify-between">
          <q-item-label caption>客户端版本号</q-item-label>
          <q-item-label>{{LocalVersion}}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section class="justify-between">
          <q-item-label caption>更新日志</q-item-label>
          <q-item-label>{{LocalVersionLog}}</q-item-label>
        </q-item-section>
      </q-item>
      <q-separator />
      <q-item>
        <q-item-section class="justify-between">
          <q-btn-dropdown
            dense
            id="loc-drop"
            style="width:100%"
            color="white"
            text-color="black"
            label="管理本地缓存用户"
            @click="checkUser()"
            no-caps
          >
            <q-list>
              <q-item
                bordered
                v-for="(value,index) in users"
                :key="index"
                v-model="users"
              >
                <q-item-section :class="removeBtn?'col-12':'col-9'">
                  <q-item-label class="text-center">{{ value }}</q-item-label>
                </q-item-section>
                <q-item-section
                  class="col-3"
                  v-if="removeBtn !==  true"
                >
                  <q-btn
                    color="primary"
                    label="移除"
                    size="xs"
                    @click="removeUser(value)"
                    v-close-popup
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </q-item-section>
      </q-item>
    </q-list>
    <div class="setting-btn">
      <div class="text-grey-8 q-gutter-xs q-pa-md">
        <q-btn
          class="bhg-btn"
          label="注销"
          to="/Login"
          @click="LOGINOUT()"
        />
      </div>
    </div>
  </q-page>
</template>

<style lang="stylus"></style>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'PageSetting',
  data () {
    return {
      shipmentId: null,
      xxx: null,
      date: null,
      imageSrc: '',
      ServerVersion: null,
      LocalVersion: localStorage.getItem('Version'),
      LocalVersionLog: null,
      users: [],
      removeBtn: false
    }
  },
  methods: {
    ...mapMutations([
      'LOGINOUT',
      'ISRELOAD',
      'BTN_PAGE',
      'CLEAR_EXTTERNALNO',
      'CLEAR_ORDERID',
      'CLEAR_SHIPMENTID',
      'POP_MSG',
      'BTN_PAGE'
    ]),
    checkUser () {
      this.users = JSON.parse(localStorage.getItem('users'))
      console.log(this.users)
      if (this.users.length === 0) {
        this.users.push('本地无缓存用户')
        this.removeBtn = true
      }
    },
    removeUser (user) {
      this._.pull(this.users, user)
      console.log(user)
      console.log(this.users)
      localStorage.setItem('users', JSON.stringify(this.users))
    },
    get_version () {
      this.$api.Sys.Get_V().then(res => {
        this.ServerVersion = res.data.data.version
        this.LocalVersionLog = res.data.data.versionDescription
        if (localStorage.getItem('Version') !== this.ServerVersion) {
          localStorage.setItem('Version', this.ServerVersion)
          localStorage.setItem('refresh', 'Y')
        }
        console.log(res.data.data)
      })
    }
  },

  created () {
    this.get_version()
    this.BTN_PAGE(false)
    this.CLEAR_ORDERID()
    this.CLEAR_EXTTERNALNO()
    this.CLEAR_SHIPMENTID()
  }
}
</script>
