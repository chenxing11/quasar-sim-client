<template>
  <q-page class="orderlist">
    <div class="q-pa-xs q-gutter-xs row">
      <div class="mobile-only col-12 row">
        <div class="col-4  q-pa-xs text-center text-weight-bolder">选择打印机</div>
        <q-btn-dropdown
          dense
          id="loc-drop"
          color="white"
          text-color="black"
          :label=$store.state.printer
          no-caps
          class="col-8"
        >
          <q-list>
            <q-item
              bordered
              v-for="(loc, index) in locationList"
              :key="index"
              @click=" changePrinter(loc)"
              clickable
              v-close-popup
            >
              <q-item-section>
                <q-item-label class="text-center">{{ loc.label }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>

    </div>
  </q-page>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      printid: null,
      path: null,
      method: null,
      locationList: [],
      ReceivingGoods: '收货',
      Order: '收货号',
      model: '收货',
      options: [
        {
          label: '收货',
          id: '1',
          links: [
            { label: '收货号', id: '1', method: 'Rcv', link: '/Print/OrdRcv' },
            { label: '订单号', id: '2', method: 'Ord', link: '/Print/OrdRcv' },
            { label: '配送单号', id: '3', method: 'Wts', link: '/Print/Wts' },
            { label: '调拨单号', id: '4', method: 'Sts', link: '/Print/Sts' }
          ]
        },
        {
          label: '退货',
          id: '4',
          links: [
            {
              label: '退货至供应商',
              id: '1',
              method: 'Rtv',
              link: '/Print/Rtv'
            },
            { label: '退货至仓库', id: '2', method: 'Rtw', link: '/Print/Rtw' }
          ]
        }
      ],
      options1: [],
      PrinterLabel: null
    }
  },
  created () {
    this.CHANGE_TITLE('重复打印')
    this.getPrinter()
    this.printFirst(
      this.options[0].label,
      this.options[0].id,
      this.options[0].links
    )
    this.PrinterLabel = localStorage.getItem('printer')
  },
  watch: {
    Order (val) {
      setTimeout(() => {
        this.$refs.idinput.focus()
      }, 500)
    }
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_GO', 'BTN_PAGE', 'CHANGE_TITLE', 'RETURNFALSE', 'GET_PRINTER']),
    printFirst (val, id, links) {
      this.ReceivingGoods = val
      this.Order = links[0].label
      this.options1 = links
      this.printSecond(
        this.options1[0].label,
        this.options1[0].id,
        this.options1[0].link,
        this.options1[0].method
      )
    },
    printSecond (val, id, link, method) {
      this.Order = val
      this.path = link
      this.method = method
    },
    inputFocus () {
      this.$refs.idinput.focus()
    },
    getPrinter () {
      this.$api.Basic.listStores().then(res => {
        this.locationList = res.data.data.map(val => {
          let json = {}
          json.id = val.id
          json.name = val.name
          json.label = val.id + '-' + val.name + val.printer
          json.printer = val.printer
          return json
        })
        // console.log(this.locationList)
        if (this.locationList.length <= 20) {
          this.scrollNum = 0
        }
        let Location = localStorage.getItem('Location')
        if (Location == null) {
          localStorage.setItem('Location', this.locationListTemp[0].id)
          localStorage.setItem('printer', this.locationListTemp[0].printer)
        }
      })
    },
    changePrinter (val) {
      this.GET_PRINTER(val.printer)
      localStorage.setItem('printer', val.printer)
      this.PrinterLabel = localStorage.getItem('printer')
    },
    get_printid () {
      if (this.printid !== null) {
        if (this.method === 'Rcv') {
          this.$api.Rcv.getShipmentById(this.printid).then(res => {
            console.log(res.data)
            if (res.data.code === 0) {
              this.POP_MSG(res.data.msg)
            } else {
              if (
                res.data.data.toLocationId !== this.$store.state.location.id
              ) {
                this.POP_MSG(
                  '该订单不是 ' + this.$store.state.location.id + ' 门店订单'
                )
              } else {
                console.log(res.data)
                if (res.data.data.type === 'PO') {
                  this.path = '/Print/OrdRcv'
                  this.$router.push({
                    path: this.path,
                    query: {
                      id: this.printid,
                      printer: this.$store.state.printer,
                      reprint: 1,
                      btn: true,
                      token: localStorage.getItem('Authorization')
                    }
                  })
                } else if (res.data.data.type === 'PODSD') {
                  this.path = '/Print/OrdDsdRcv'
                  this.$router.push({
                    path: this.path,
                    query: {
                      id: this.printid,
                      printer: this.$store.state.printer,
                      reprint: 1,
                      btn: true,
                      token: localStorage.getItem('Authorization')
                    }
                  })
                } else if (res.data.data.type === 'WTS') {
                  if (res.data.data.status !== 'C') {
                    this.POP_MSG('该配送单未收货')
                  } else {
                    this.path = '/Print/Wts'
                    this.$router.push({
                      path: this.path,
                      query: {
                        id: this.printid,
                        printer: this.$store.state.printer,
                        reprint: 1,
                        btn: true,
                        token: localStorage.getItem('Authorization')
                      }
                    })
                  }
                } else if (res.data.data.type === 'STS') {
                  if (res.data.data.status === 'S') {
                    this.path = '/Print/Sts'
                    this.$router.push({
                      path: this.path,
                      query: {
                        id: this.printid,
                        printer: this.$store.state.printer,
                        reprint: 1,
                        btn: true,
                        token: localStorage.getItem('Authorization')
                      }
                    })
                  } else if (res.data.data.status === 'R') {
                    this.path = '/Print/StsReceive'
                    this.$router.push({
                      path: this.path,
                      query: {
                        id: this.printid,
                        printer: this.$store.state.printer,
                        reprint: 1,
                        btn: true,
                        token: localStorage.getItem('Authorization')
                      }
                    })
                  }
                } else {
                  this.path = '/Print/DsdRcv'
                  this.$router.push({
                    path: this.path,
                    query: {
                      id: this.printid,
                      printer: this.$store.state.printer,
                      reprint: 1,
                      btn: true,
                      token: localStorage.getItem('Authorization')
                    }
                  })
                }
              }
            }
          })
        } else if (this.method === 'Ord') {
          this.$api.Rcv.getOrder(this.printid).then(res => {
            if (res.data.code === 0) {
              console.log(res.data.data)
              this.POP_MSG(res.data.msg)
            } else {
              console.log(res.data.data)
              this.printid = res.data.data.id
              this.$api.Rcv.getShipmentByOrderId(this.printid).then(res => {
                if (res.data.code === 0) {
                  this.POP_MSG(res.data.msg)
                } else {
                  if (
                    res.data.data.toLocationId !== this.$store.state.location.id
                  ) {
                    this.POP_MSG(
                      '该订单不是 ' + this.$store.state.location.id + ' 门店订单'
                    )
                  } else {
                    this.printid = res.data.data.id
                    if (res.data.data.type === 'PO') {
                      this.path = '/Print/OrdRcv'
                      this.$router.push({
                        path: this.path,
                        query: {
                          id: this.printid,
                          printer: this.$store.state.printer,
                          reprint: 1,
                          btn: true,
                          token: localStorage.getItem('Authorization')
                        }
                      })
                    } else if (res.data.data.type === 'PODSD') {
                      this.path = '/Print/OrdDsdRcv'
                      this.$router.push({
                        path: this.path,
                        query: {
                          id: this.printid,
                          printer: this.$store.state.printer,
                          reprint: 1,
                          btn: true,
                          token: localStorage.getItem('Authorization')
                        }
                      })
                    } else {
                      this.path = '/Print/DsdRcv'
                      this.$router.push({
                        path: this.path,
                        query: {
                          id: this.printid,
                          printer: this.$store.state.printer,
                          reprint: 1,
                          btn: true,
                          token: localStorage.getItem('Authorization')
                        }
                      })
                    }
                  }
                }
              })
            }
          })
        } else if (this.method === 'Rtv') {
          this.$api.Rtv.getRtv(this.printid).then(res => {
            // 获取订单信息
            if (res.data.code === 0) {
              this.POP_MSG(res.data.msg)
            } else {
              if (res.data.data.locationId !== this.$store.state.location.id) {
                this.POP_MSG(
                  '该退货单不是 ' + this.$store.state.location.id + ' 门店退货单'
                )
              } else {
                this.path = '/Print/Rtv'
                this.$router.push({
                  path: this.path,
                  query: {
                    id: this.printid,
                    printer: this.$store.state.printer,
                    reprint: 1,
                    btn: true,
                    token: localStorage.getItem('Authorization')
                  }
                })
              }
            }
          })
        } else if (this.method === 'Rtw') {
          this.$api.Rtw.getRtw(this.printid).then(res => {
            if (res.data.code === 0) {
              this.POP_MSG(res.data.msg)
            } else {
              if (
                res.data.data.fromLocationId !== this.$store.state.location.id
              ) {
                this.POP_MSG(
                  '该返仓单不是 ' + this.$store.state.location.id + ' 门店返仓单'
                )
              } else {
                this.path = '/Print/Rtw'
                this.$router.push({
                  path: this.path,
                  query: {
                    id: this.printid,
                    printer: this.$store.state.printer,
                    reprint: 1,
                    btn: true,
                    token: localStorage.getItem('Authorization')
                  }
                })
              }
            }
          })
        } else if (this.method === 'Wts') {
          this.$api.Ship.GetWTSShipmentByBolNo(this.printid).then(res => {
            if (res.data.code === 0) {
              this.POP_MSG(res.data.msg)
            } else {
              console.log(res.data)
              if (res.data.data.toLocationId !== this.$store.state.location.id) {
                this.POP_MSG('该配送单不是 ' + this.$store.state.location.id + ' 门店配送单')
              } else if (res.data.data.status !== 'C') {
                this.POP_MSG('该配送单未收货')
              } else {
                this.path = '/Print/Wts'
                this.$router.push({
                  path: this.path,
                  query: {
                    id: res.data.data.id,
                    printer: this.$store.state.printer,
                    reprint: 1,
                    btn: true,
                    token: localStorage.getItem('Authorization')
                  }
                })
              }
            }
          })
        } else if (this.method === 'Sts') {
          this.$api.Ship.GetShipmentByBolNo(this.printid).then(res => {
            console.log(res)
            if (res.data.data === 0) {
              this.POP_MSG(res.data.msg)
            } else {
              if (res.data.data.toLocationId !== this.$store.state.location.id) {
                this.POP_MSG('该调拨单不是 ' + this.$store.state.location.id + ' 门店调拨单')
              } else if (res.data.data.status === 'S') {
                this.path = '/Print/Sts'
                this.$router.push({
                  path: this.path,
                  query: {
                    id: res.data.data.id,
                    printer: this.$store.state.printer,
                    reprint: 1,
                    btn: true,
                    token: localStorage.getItem('Authorization')
                  }
                })
              } else if (res.data.data.status === 'R') {
                this.path = '/Print/StsReceive'
                this.$router.push({
                  path: this.path,
                  query: {
                    id: res.data.data.id,
                    printer: this.$store.state.printer,
                    reprint: 1,
                    btn: true,
                    token: localStorage.getItem('Authorization')
                  }
                })
              }
            }
          })
        }
      }
    }
  }
}
</script>
