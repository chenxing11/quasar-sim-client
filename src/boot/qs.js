// import something here
import qs from 'qs'
// "async" is optional
export default async ({ Vue }) => {
  Vue.prototype.$qs = qs
}
