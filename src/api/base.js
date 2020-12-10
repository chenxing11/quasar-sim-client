/**
 * 接口域名的管理
 */
const base = {
  version: 'http://10.4.17.115:8003/version.html', // 版本号文件 测试与生产同步版本

  api: 'http://10.4.17.115:8004/api', // 测试环境
  posApi: 'http://10.4.17.115:6004/api',
  id: 'http://10.4.17.115:8000', // 测试环境
  print: 'http://10.4.17.115:3001/print' // 测试环境
  /* api: 'http://10.200.128.11:8004/api', // 生产环境
  posApi: 'http://10.200.128.11:6004/api',
  id: 'http://10.200.128.11:8000', // 生产环境
  print: 'http://10.200.128.12:3001/print' // 生产环境 */
}

export default base
