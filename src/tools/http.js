/**
 * axios封装
 * 请求拦截、响应拦截、错误统一处理
 */
import axios from 'axios'
import { Notify, Loading, QSpinnerGears } from 'quasar'
/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
/*
const toLogin = () => {
  Router.replace({
    path: '/login'
  })
}
*/
/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, other) => {
  // 状态码判断
  switch (status) {
    // 401: 未登录状态，跳转登录页
    case 401:
      // this.NotiError('密钥过期，请注销后重新登录')
      Notify.setDefaults({
        color: 'red-5',
        textColor: 'white',
        message: '登录过期，请重新登录',
        position: 'top',
        timeout: 1500
      })
      localStorage.removeItem('Authorization')
      break
      // 403 token过期
      // 清除token并跳转登录页
      // 404请求不存在
    case 404:
      // this.NotiError('请求的资源不存在')
      break
    default:
      console.log(other)
  }
}

// 创建axios实例
var instance = axios.create({ timeout: 20000 })
// 设置post请求头
// instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */
instance.interceptors.request.use(
  config => {
    // 登录流程控制中，根据本地是否存在token判断用户的登录情况
    // 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token
    // 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码
    // 而后我们可以在响应拦截器中，根据状态码进行一些统一的操作。
    Loading.show(
      {
        delay: 2000,
        spinner: QSpinnerGears,
        spinnerColor: 'white',
        message: '数据读取中'
      }
    )
    let token = localStorage.getItem('Authorization')
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  error => Promise.error(error))

// 响应拦截器
instance.interceptors.response.use(

  // 请求成功
  res => {
    Loading.hide()
    if (res.status === 200) {
      Promise.resolve(res)
      return res
    } else {
      Promise.reject(res)
    }
  },
  // res.status === 200 ? Promise.resolve(res) : Promise.reject(res),
  // 请求失败
  error => {
    const { response } = error
    Loading.hide()
    if (response) {
      // 请求已发出，但是不在2xx的范围
      errorHandle(response.status, response.data.message)
      return Promise.reject(response)
    } else {
      Notify.setDefaults({
        color: 'red-5',
        textColor: 'white',
        message: '网络超时，请检查网络',
        position: 'top',
        timeout: 1500
      })
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
      console.log(error)
    }
  })

export default instance
