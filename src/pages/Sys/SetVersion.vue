<template>
  <q-page>
    <q-list padding
            dense>
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
      <q-item >
                <q-item-section class="justify-between q-py-md">
                      <q-item-label caption>更新日志</q-item-label>
                      <q-item-label>{{LocalVersionLog}}</q-item-label>
        </q-item-section>
      </q-item>
      <q-separator   />
      <q-item>
        <q-item-section class="justify-between">
          <q-form
      @keydown.enter="onSubmit"
      @reset="onReset"
      class="q-gutter-md q-pa-xs"
    >
      <q-input
        filled
        v-model="versionNo"
        label="版本号"
      />

      <q-input
        filled
        v-model="versionDescription"
        label="版本日志"
      />

      <q-toggle v-model="accept" label="修改版本信息验证" />

      <div>
        <q-btn label="提交" @click="onSubmit()" color="primary"/>
        <q-btn label="清空" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<style lang="stylus"></style>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'PageSetting',
  data () {
    return {
      versionNo: null,
      versionDescription: null,
      accept: false,
      ServerVersion: null,
      LocalVersion: localStorage.getItem('Version'),
      LocalVersionLog: null
    }
  },
  methods: {
    ...mapMutations([
      'LOGINOUT',
      'ISRELOAD',
      'BTN_PAGE',
      'CHANGE_TITLE',
      'POP_MSG'
    ]),
    onSubmit () {
      if (this.accept !== true) {
        this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: '修改版本信息请点击验证'
        })
      } else {
        this.setVersion(this.versionNo, this.versionDescription)
      }
    },

    onReset () {
      this.versionNo = null
      this.versionDescription = null
      this.accept = false
    },
    getVersion () {
      this.$api.Sys.Get_V().then(res => {
        this.ServerVersion = res.data.data.version
        this.LocalVersionLog = res.data.data.versionDescription
        console.log(res.data.data)
      })
    },
    setVersion (versionNo, versionDescription) {
      this.$api.Sys.Set_V(versionNo, versionDescription).then(res => { // 获取订单信息
        console.log(res)

        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: '提交成功'
        })
        this.getVersion()
      })
    }
  },

  created () {
    this.CHANGE_TITLE('修改版本号')
    this.getVersion()
  }
}
</script>
