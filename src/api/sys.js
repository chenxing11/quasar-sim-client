
import base from './base' // 导入接口域名列表
import axios from 'src/tools/http' // 导入http中创建的axios实例

const Sys = {
  Get_V (params) {
    return axios.get(`${base.api}/SystemOption/GetSystemVersion`, params)
  },
  Set_V (versionNo, versionDescription) {
    return axios.get(`${base.api}/SystemOption/SetSystemVersion`, {
      params: {
        versionNo: versionNo,
        versionDescription: versionDescription
      }
    })
  }
}

export default Sys
