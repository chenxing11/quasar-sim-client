import { Notify } from 'quasar'

function NotiSuccess (msg) {
  return Notify.create({
    color: 'light-green-3',
    textColor: 'green-10',
    message: msg,
    position: 'top',
    timeout: 3000
  })
}
function NotiError (msg) {
  return Notify.create({
    color: 'red-5',
    textColor: 'white',
    message: msg,
    position: 'top',
    timeout: 3000
  })
}
function NotiWarn (msg) {
  return Notify.create({
    color: 'amber-8',
    textColor: 'white',
    message: msg,
    position: 'top',
    timeout: 3000,
    class: 'NotiWarn'
  })
}
export default {
  install (Vue) {
    Vue.prototype.NotiSuccess = NotiSuccess
    Vue.prototype.NotiError = NotiError
    Vue.prototype.NotiWarn = NotiWarn
  }
}
