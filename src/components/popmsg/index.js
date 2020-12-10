import PopMsgComponent from './popmsg.vue'
import BtnMsgComponent from './btnmsg.vue'
const popmsg = {
  install (Vue) {
    Vue.component('popmsg', PopMsgComponent)
    Vue.component('btnmsg', BtnMsgComponent)
  }
}
export default popmsg
