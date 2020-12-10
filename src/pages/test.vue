<template>
  <q-page class="">
    <q-input v-model="text">

    </q-input>
    <div>{{cjkEncode(text)}}</div>
  </q-page>
</template>

<style lang="stylus" ></style>

<script>
import { mapMutations } from 'vuex'
import { date } from 'quasar'
let timeStamp = Date.now()
// let printtime = date.formatDate(timeStamp, 'YYYY-MM-DDTHH:mm:ss.SSSZ')

export default {
  name: 'PageStoreRcvOrder',
  data () {
    return {
      text: null,
      reportLink: 'http://10.0.25.220:8080/WebReport/ReportServer?reportlet=/doc/Primary/Parameter/Parameter.cpt'
    }
  },
  created () {
  },
  mounted () {
    this.printtime = date.formatDate(timeStamp, 'YYYY-MM-DDTHH:mm:ss.SSSZ')
  },
  computed: {
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_PAGE']),
    cjkEncode (text) {
      if (text == null) {
        return ''
      }
      var newText = ''
      for (var i = 0; i < text.length; i++) {
        var code = text.charCodeAt(i)
        if (code >= 128 || code === 91 || code === 93) { // 91 is "[", 93 is "]".
          newText += '[' + code.toString(16) + ']'
        } else {
          newText += text.charAt(i)
        }
      }
      return newText
    },
    loginFR () {
      var link = 'http://10.0.25.220:8080/WebReport/ReportServer?op=fs_load&cmd=sso'
      var json = {
        fr_username: 'ZHANGLEI',
        fr_password: '123456'
      }
      this.$axios({
        method: 'post',
        url: link,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: json
      }).then(res => {
        console.log(res)
        if (res.data.code === 1) {
          this.NotiSuccess(res.data.msg)
        } else {
          this.POP_MSG(res.data.msg)
        }
      })
    }
  }
}
</script>
