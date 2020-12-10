function Number2 (value) {
  var toFixedNum = Number(value).toFixed(4)
  var realVal = toFixedNum.substring(0, toFixedNum.toString().length - 1)
  return realVal
}
function fixNum2 (value) {
  var toFixedNum = Number(value).toFixed(3)
  var realVal = toFixedNum.substring(0, toFixedNum.toString().length - 1)
  return realVal
}
function Number0 (value) {
  var toFixedNum = Number(value).toFixed(1)
  var realVal = toFixedNum.substring(0, toFixedNum.toString().length - 2)
  return realVal
}

export default {
  install (Vue) {
    Vue.prototype.Number2 = Number2
    Vue.prototype.fixNum2 = fixNum2
    Vue.prototype.Number0 = Number0
  }
}
