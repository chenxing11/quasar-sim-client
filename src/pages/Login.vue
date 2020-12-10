<template>
  <q-page class="loginback">
    <div
      class="loginback mobile-only"
      :style="loginpage"
    >
      <div class="q-pa-md flex flex-center">
        <div>
          <img
            src="~assets/login-logo.png"
            style="width:100%"
          />
        </div>
        <p class="text-h4 text-white text-bold">{{name}}</p>
      </div>
      <span id="page">
        <div class>
          <div class="num-box">
            <div class="q-pa-md flex flex-center">
              <q-form
                @submit="onSubmit"
                v-if="flag"
                @reset="onReset"
                class="q-gutter-md"
              >
                <q-input
                  color="goldenrod"
                  bg-color="white"
                  outlined
                  ref="username"
                  bottom-slots
                  v-model="loginForm.username"
                  label="用户名"
                  @click="clickKeyWordWrap('username',loginForm.username)"
                >
                  <template v-slot:before>
                    <q-icon
                      name="account_box"
                      color="white"
                    />
                  </template>
                  <template v-slot:append>
                    <q-icon
                      v-if="users.length !== 0"
                      name="playlist_add_check"
                      @click="userlist = true"
                      class="cursor-pointer"
                    />
                    <q-icon
                      v-if="loginForm.username !== ''"
                      name="close"
                      @click="loginForm.username = ''"
                      class="cursor-pointer"
                    />
                  </template>
                </q-input>
                <q-dialog
                  v-model="userlist"
                  persistent
                >
                  <q-card style="width: 100%">
                    <q-bar class="bg-primary text-white">
                      <div class="col text-center">
                        本地缓存用户
                      </div>
                      <q-space />

                      <q-btn
                        dense
                        flat
                        icon="close"
                        v-close-popup
                      >
                        <q-tooltip>关闭</q-tooltip>
                      </q-btn>
                    </q-bar>

                    <q-list
                      bordered
                      separator
                    >
                      <q-item
                        v-for="(user,index) in users"
                        :key="index"
                      >
                        <q-item-section @click="loginForm.username = user,chioseUser()">{{user}}</q-item-section>
                      </q-item>
                    </q-list>
                  </q-card>
                </q-dialog>
                <q-input
                  color="goldenrod"
                  type="password"
                  bg-color="white"
                  outlined
                  ref="password"
                  bottom-slots
                  v-model="loginForm.password"
                  label="密码"
                  @click="clickKeyWordWrap('password',loginForm.password)"
                >
                  <template v-slot:before>
                    <q-icon
                      name="lock"
                      color="white"
                    />
                  </template>
                  <template v-slot:append>
                    <q-icon
                      v-if="loginForm.password !== ''"
                      name="close"
                      @click="loginForm.password = ''"
                      class="cursor-pointer"
                    />
                  </template>
                </q-input>
                <div class="q-pa-xs flex flex-center">
                </div>
                <div class="q-pa-xs flex flex-center q-gutter-lg">
                  <q-btn
                    style="min-width:150px"
                    label="登录"
                    type="submit"
                    color="white"
                    outline
                  />
                </div>
              </q-form>

              <q-form
                @submit="submit"
                v-if="!flag"
                @reset="onReset"
                class="q-gutter-md"
              >
                <q-input
                  color="goldenrod"
                  bg-color="white"
                  outlined
                  ref="username"
                  bottom-slots
                  v-model="loginForm.username"
                  label="用户名"
                  @click="clickKeyWordWrap('username',loginForm.username)"
                >
                  <template v-slot:before>
                    <q-icon
                      name="account_box"
                      color="white"
                    />
                  </template>
                  <template v-slot:append>
                    <q-icon
                      v-if="users.length !== 0"
                      name="playlist_add_check"
                      @click="userlist = true"
                      class="cursor-pointer"
                    />
                    <q-icon
                      v-if="loginForm.username !== null"
                      name="close"
                      @click="loginForm.username = null"
                      class="cursor-pointer"
                    />
                  </template>
                </q-input>
                <q-input
                  color="goldenrod"
                  type="password"
                  bg-color="white"
                  outlined
                  ref="password"
                  bottom-slots
                  v-model="loginForm.password"
                  label="密码"
                  @click="clickKeyWordWrap('password',loginForm.password)"
                >
                  <template v-slot:before>
                    <q-icon
                      name="lock"
                      color="white"
                    />
                  </template>
                  <template v-slot:append>
                    <q-icon
                      v-if="loginForm.password !== null"
                      name="close"
                      @click="loginForm.password = null"
                      class="cursor-pointer"
                    />
                  </template>
                </q-input>
                <q-dialog
                  v-model="userlist"
                  persistent
                >
                  <q-card style="width: 100%">
                    <q-bar class="bg-primary text-white">
                      <div class="col text-center">
                        本地缓存用户
                      </div>
                      <q-space />

                      <q-btn
                        dense
                        flat
                        icon="close"
                        v-close-popup
                      >
                        <q-tooltip>关闭</q-tooltip>
                      </q-btn>
                    </q-bar>

                    <q-list
                      bordered
                      separator
                    >
                      <q-item
                        v-for="(user,index) in users"
                        :key="index"
                      >
                        <q-item-section @click="loginForm.username = user,chioseUser()">{{user}}</q-item-section>
                      </q-item>
                    </q-list>
                  </q-card>
                </q-dialog>
                <div class="q-pa-xs flex flex-center">
                </div>
                <div class="q-pa-xs flex flex-center q-gutter-lg">
                  <q-btn
                    style="min-width:150px"
                    label="登录"
                    type="submit"
                    color="white"
                    outline
                  />
                </div>
              </q-form>

            </div>
            <div class="q-pa-xs flex flex-center">
              <span><a
                  href="javascript:void(0)"
                  style="color:yellow;"
                  @click="Toggle()"
                >{{toggle}}>></a></span>
            </div>
          </div>
        </div>
        <span
          class="keyboard-wrap"
          v-if="keyBoardStatus === true"
        >
          <div class="keyboard">
            <span
              v-for="(item,index) in capitalKeyWord._1"
              :key="index"
              @click="clickKeyBoard(item)"
            >{{item}}</span>
          </div>
          <div
            class="keyboard"
            v-if="capsStatus"
          >
            <span
              v-for="(item,index) in capitalKeyWord._2"
              :key="index"
              @click="clickKeyBoard(item)"
            >{{item}}</span>
          </div>
          <div
            class="keyboard"
            v-if="capsStatus === false"
          >
            <span
              v-for="(item,index) in smailKeyWord._2"
              :key="index"
              @click="clickKeyBoard(item)"
            >{{item}}</span>
          </div>
          <div
            class="keyboard"
            v-if="capsStatus"
          >
            <span
              v-for="(item,index) in capitalKeyWord._3"
              :key="index"
              @click="clickKeyBoard(item)"
            >{{item}}</span>
            <span
              class="delete"
              @click="deleteWord"
            >←</span>
          </div>
          <div
            class="keyboard"
            v-if="capsStatus === false"
          >
            <span
              v-for="(item,index) in smailKeyWord._3"
              :key="index"
              @click="clickKeyBoard(item)"
            >{{item}}</span>
            <span
              class="delete"
              @click="deleteWord"
            >←</span>
          </div>
          <span
            class="keyboard"
            v-if="capsStatus"
          >
            <span
              class="caps"
              @click="capitalWord"
            >切换</span>
            <span
              v-for="(item,index) in capitalKeyWord._4"
              :key="index"
              @click="clickKeyBoard(item)"
            >{{item}}</span>
            <span
              class="cancel"
              @click="closeKeyBoard()"
            >关闭</span>
          </span>
          <span
            class="keyboard"
            v-if="capsStatus  === false"
          >
            <span
              class="caps"
              @click="capitalWord"
            >切换</span>
            <span
              v-for="(item,index) in smailKeyWord._4"
              :key="index"
              @click="clickKeyBoard(item)"
            >{{item}}</span>
            <span
              class="cancel"
              @click="closeKeyBoard()"
            >关闭</span>
          </span>
        </span>
      </span>
    </div>
    <div class="loginback mobile-hide">
      <div class="q-pa-md flex flex-center">
        <div>
          <img
            src="~assets/login-logo.png"
            style="width:100%"
          />
        </div>
        <p class="text-h4 text-white text-bold">卖场管理系统</p>
      </div>
      <span id="page">
        <div class>
          <div class="num-box">
            <div class="q-pa-md flex flex-center">
              <q-form
                @submit="onSubmit"
                @reset="onReset"
                class="q-gutter-md"
              >
                <q-input
                  color="goldenrod"
                  bg-color="white"
                  outlined
                  ref="username"
                  bottom-slots
                  v-model="loginForm.username"
                  label="用户名"
                  @click="clickKeyWordWrap('username',loginForm.username)"
                >
                  <template v-slot:before>
                    <q-icon
                      name="account_box"
                      color="white"
                    />
                  </template>
                  <template v-slot:append>
                    <q-icon
                      v-if="users.length !== 0"
                      name="playlist_add_check"
                      @click="userlist = true"
                      class="cursor-pointer"
                    />
                    <q-icon
                      v-if="loginForm.username !== null"
                      name="close"
                      @click="loginForm.username = null"
                      class="cursor-pointer"
                    />
                  </template>
                </q-input>
                <q-dialog
                  v-model="userlist"
                  persistent
                >
                  <q-card style="width: 100%">
                    <q-bar class="bg-primary text-white">
                      <div class="col text-center">
                        本地缓存用户
                      </div>
                      <q-space />

                      <q-btn
                        dense
                        flat
                        icon="close"
                        v-close-popup
                      >
                        <q-tooltip>关闭</q-tooltip>
                      </q-btn>
                    </q-bar>

                    <q-list
                      bordered
                      separator
                    >
                      <q-item
                        v-for="(user,index) in users"
                        :key="index"
                      >
                        <q-item-section @click="loginForm.username = user,chioseUser()">{{user}}</q-item-section>
                      </q-item>
                    </q-list>
                  </q-card>
                </q-dialog>
                <q-input
                  color="goldenrod"
                  type="password"
                  bg-color="white"
                  outlined
                  ref="password"
                  bottom-slots
                  v-model="loginForm.password"
                  label="密码"
                  @click="clickKeyWordWrap('password',loginForm.password)"
                >
                  <template v-slot:before>
                    <q-icon
                      name="lock"
                      color="white"
                    />
                  </template>
                  <template v-slot:append>
                    <q-icon
                      v-if="loginForm.password !== null"
                      name="close"
                      @click="loginForm.password = null"
                      class="cursor-pointer"
                    />
                  </template>
                </q-input>
                <div class="q-pa-md flex flex-center">
                  <q-btn
                    style="min-width:150px"
                    label="登录"
                    type="submit"
                    color="white"
                    outline
                  />
                </div>
              </q-form>
            </div>
          </div>
        </div>
      </span>
    </div>
  </q-page>
</template>
<style lang="stylus" >
.loginback {
  background: #20543C url('../assets/login-back.png');
  background-size: contain;
}

<style lang='stylus'>, .flex-items-center {
  display: flex;
  align-items: center;
}

.keyboard-wrap {
  background-color: #CCC;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;

  .keyboard {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 2rem;
    margin-bottom: 0.3rem;

    span {
      text-align: center;
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: center;
      height: 1.8rem;
      margin: 0 0.3rem;
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.35);
      background-color: #fff;
      border-radius: 0.125rem;

      &:active {
        background-color: #e4e4e4;
      }

      &.bordernone {
        border: none;
        box-shadow: none;
        background-color: #D2D5DB;

        &:active {
          background-color: #D2D5DB;
        }
      }

      &.caps {
        background-color: #465266;
        color: #fff;
        width: 150%;
      }

      &.cancel {
        background-color: #465266;
        color: #fff;
        width: 150%;
      }

      &.delete {
        background-color: #465266;
        color: #fff;

        img {
          width: 1.15rem;
        }
      }
    }
  }

  .cancel {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    span {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 3.2rem;
      height: 1.8rem;
      background-color: #465266;
      color: #fff;
      border-radius: 0.125rem;
    }
  }
}
</style>

<script>
import { mapMutations } from 'vuex'
import base from 'src/api/base'
export default {
  name: 'PageLogin',
  dense: false,
  height: 0,
  data () {
    return {
      version: null,
      name: '手持终端系统',
      flag: true,
      toggle: '切换至盘点登录',
      loginType: 1,
      text: '',
      users: [],
      loginForm: {
        username: '', // 用户名
        password: '' // 密码
      },
      accept: true,
      dense: true,
      userlist: false,
      loginpage: {
        'height': ''
      },
      capitalKeyWord: {
        _1: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
        _2: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        _3: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        _4: ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
      },
      smailKeyWord: {
        _1: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
        _2: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        _3: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        _4: ['z', 'x', 'c', 'v', 'b', 'n', 'm']
      },
      keyBoardStatus: false,
      capsStatus: true,
      Text: '',
      inputtext: '',
      refName: null
    }
  },
  watch: {
    keyBoardStatus (val) {
      if (this.keyBoardStatus === true) {
        this.height = window.innerHeight
        this.loginpage.height = (this.height * 1.5) + 'px'
      } else if (this.keyBoardStatus === false) {
        this.height = window.innerHeight
        this.loginpage.height = window.innerHeight + 'px'
      }
    }
  },
  created () {
    // this.get_version()
    if (localStorage.getItem('refresh') === 'Y') {
      localStorage.setItem('refresh', 'N')
      this.$router.go(0)
    }
    if (JSON.parse(localStorage.getItem('users')) !== null) {
      this.users = JSON.parse(localStorage.getItem('users'))
    } else {
      this.users = []
    }
    console.log(this.users)
  },
  methods: {
    ...mapMutations(['CHANGELOGIN', 'ISRELOAD', 'POP_MSG']),
    chioseUser () {
      this.userlist = false
      this.keyBoardStatus = !this.keyBoardStatus
    },
    clickKeyBoard (item) {
      // 点击自定义键盘
      console.log(item)
      if (this.refName === 'username') {
        this.Text = this.loginForm.username
        this.Text = this.Text + item
        this.loginForm.username = this.Text
        this.$refs.username.focus()
      } else if (this.refName === 'password') {
        this.Text = this.loginForm.password
        this.Text = this.Text + item
        this.loginForm.password = this.Text
        this.$refs.password.focus()
      }
    },
    deleteWord () {
      // 退格
      if (this.refName === 'username') {
        this.loginForm.username = this.loginForm.username.substring(0, this.loginForm.username.length - 1)
        this.$refs.username.focus()
      } else if (this.refName === 'password') {
        this.loginForm.password = this.loginForm.password.substring(0, this.loginForm.password.length - 1)
        this.$refs.password.focus()
      }
    },
    capitalWord () {
      if (this.refName === 'username') {
        this.capsStatus = !this.capsStatus
        this.$refs.username.focus()
      } else if (this.refName === 'password') {
        this.capsStatus = !this.capsStatus
        this.$refs.password.focus()
      }
    },
    clickKeyWordWrap (ref, text) {
      this.keyBoardStatus = true
      var t = text
      if (t === null) {
        t = ''
      } else {
        t = text
      }
      this.Text = t
      this.refName = ref
    },
    closeKeyBoard () {
      if (this.refName === 'username') {
        this.loginForm.username = this.loginForm.username
        this.keyBoardStatus = false
        this.$refs.username.focus()
      } else if (this.refName === 'password') {
        this.loginForm.password = this.loginForm.password
        this.keyBoardStatus = false
        this.$refs.password.focus()
      }
    },
    onSubmit () {
      if (this.loginForm.username === '' || this.loginForm.password === '') {
        this.NotiError('用户名/密码不能为空')
      } else {
        let postData = this.$qs.stringify({
          username: this.loginForm.username,
          password: this.loginForm.password,
          grant_type: 'password',
          client_id: 'client-sim',
          client_secret: '0E8816F4-07D6-43D7-8917-7D51019043B9'
        })
        this.$api.User.login(postData)
          .then(res => {
            console.log(res)
            this.userToken = 'Bearer ' + res.data.access_token
            // 将用户token保存到vuex中
            this.CHANGELOGIN(this.userToken)
            console.log(this.users)
            if (localStorage.getItem('users') !== null) {
              this.users = JSON.parse(localStorage.getItem('users'))
            }
            console.log(this.users)
            this.users.push(this.loginForm.username)
            console.log(this.users)
            this.users = this._.uniq(this.users)
            console.log(this.users)
            localStorage.setItem('users', JSON.stringify(this.users))
            localStorage.setItem('Authorization', this.userToken)
            this.ISRELOAD()
            this.NotiSuccess('登录成功')
            this.$router.push('/')
          })
          .catch(error => {
            this.loginForm.password = null
            console.log(error.status)
            this.NotiError('登录失败，检查用户名/密码')
          })
      }
    },
    onReset () {
      this.loginForm.username = ''
      this.loginForm.password = ''
    },
    Toggle () {
      if (this.flag) {
        this.toggle = '切换至手持终端登录'
        this.name = '盘点系统'
        this.loginForm.username = ''
        this.loginForm.password = ''
        this.flag = false
      } else {
        this.toggle = '切换至盘点登录'
        this.name = '手持终端系统'
        this.loginForm.username = ''
        this.loginForm.password = ''
        this.flag = true
      }
    },
    submit () {
      let externalNo = localStorage.getItem('externalNo')
      let StoreId = localStorage.getItem('StoreId')
      if (this.loginForm.password === '' || this.loginForm.password === null) {
        this.loginForm.password = 1
      }
      let postData = this.$qs.stringify({
        username: 'S' + externalNo + 'L' + StoreId + 'U' + this.loginForm.username,
        password: this.loginForm.password,
        grant_type: 'password',
        client_id: 'client-sim',
        client_secret: '0E8816F4-07D6-43D7-8917-7D51019043B9'
      })
      this.$api.User.login(postData).then(res => {
        console.log(res)
        this.userToken = 'Bearer ' + res.data.access_token
        // 将用户token保存到vuex中
        this.CHANGELOGIN(this.userToken)
        if (localStorage.getItem('users') !== null) {
          this.users = JSON.parse(localStorage.getItem('users'))
        }
        this.users.push(this.loginForm.username)
        this.users = this._.uniq(this.users)
        localStorage.setItem('users', JSON.stringify(this.users))
        localStorage.setItem('Authorization', this.userToken)
        this.ISRELOAD()
        this.NotiSuccess('登录成功')
        this.$router.push('/')
      }).catch(error => {
        this.loginForm.password = null
        console.log(error)
        this.NotiSuccess('登录失败')
      })
    },
    get_version () {
      console.log(base)
      var _this = this
      // this.axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
      this.$axios({
        method: 'get',
        url: 'http://10.4.17.115:8003/version.html'
      }).then(
        res => {
          console.log(res.data)
          console.log(res)
          _this.version = res.data
          console.log(_this.version)
          console.log(_this.version.version)
          console.log(_this.version.log)
        }).catch(err => console.log(err))
    }
  }
}
</script>
