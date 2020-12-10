<template>
  <q-page class="orderlist">
    <div class="q-pa-xs q-gutter-xs row">
      <q-btn-dropdown
        :label="ReceivingGoods"
        class="col"
      >
        <q-list>
          <q-item
            style="width:100%"
            clickable
            v-close-popup
            v-for="(loc,index) in options"
            :key="index"
            @click="printFirst(loc.label,loc.id,loc.links)"
          >
            <q-item-section>
              <q-item-label>{{loc.label}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <q-btn-dropdown
        :label="Order"
        class="col-8"
      >
        <q-list>
          <q-item
            style="width:100%"
            clickable
            v-close-popup
            v-for="(loc,index) in options1"
            :key="index"
            @click="printSecond(loc.label,loc.id,loc.link,loc.method)"
          >
            <q-item-section>
              <q-item-label>{{loc.label}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
 <!--      <div class="mobile-only  q-pa-xs col-12 row">
        <div class="col-4  q-pa-xs text-center text-weight-bolder">选择打印机</div>
        <q-btn-dropdown
          dense
          id="loc-drop"
          color="white"
          text-color="black"
          :label="printer.printerName"
          no-caps
          class="col-8"
        >
          <q-list>
            <q-item
              bordered
              v-for="(p, index) in printerList"
              :key="index"
              @click=" changePrinter(p)"
              clickable
              v-close-popup
            >
              <q-item-section>
                <q-item-label class="text-center">{{ p.printerName }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div> -->
      <q-form
        @keydown.enter="get_printid()"
        @submit="RETURNFALSE()"
        class="col-12 q-py-md"
      >
        <q-input
          ref="idinput"
          id="input"
          class="q-px-xs"
          square
          fixed-bottom
          autofocus
          autocomplete="off"
          outlined
          v-model="printid"
          label="单据号"
        >
          <template v-slot:append>
            <q-icon
              name="close"
              @click="printid = null"
              class="cursor-pointer"
            />
          </template>
        </q-input>
      </q-form>
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
      printerList: [],
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
            { label: '调拨单号', id: '4', method: 'Sts', link: '/Print/Sts' },
            { label: '自采单号', id: '5', method: 'FRSH', link: '/Print/Fresh' }
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
      printer: null
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
    this.printer = JSON.parse(localStorage.getItem('printer'))
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
      this.$api.LocationPrint.ListAllLocationPrinters(localStorage.getItem('Location'), 'MerchandiseReceipt').then(res => {
        this.printerList = res.data.data.map(
          i => {
            let json = {}
            json.mainPrint = i.jobName === '0'
            json.printer = i.printer.name
            json.printerName = i.printer.description
            json.p_width = i.printer.pageWidth
            json.p_height = i.printer.pageHeight
            json.p_top = i.printer.pageTopMargin
            json.p_left = i.printer.pageLeftMargin
            json.p_right = i.printer.pageRightMargin
            json.p_bottom = i.printer.pageBottomMargin
            return json
          }
        )
      })
    },
    changePrinter (val) {
      this.printer = val
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
                      printer: this.printer.printer,
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
                      printer: this.printer.printer,
                      reprint: 1,
                      btn: true,
                      token: localStorage.getItem('Authorization')
                    }
                  })
                } else if (res.data.data.type === 'FRSH') {
                  this.path = '/Print/Fresh'
                  this.$router.push({
                    path: this.path,
                    query: {
                      id: this.printid,
                      printer: this.printer.printer,
                      reprint: 1,
                      btn: true,
                      token: localStorage.getItem('Authorization')
                    }
                  })
                } else if (res.data.data.type === 'WTS') {
                  if (res.data.data.status !== 'R') {
                    this.POP_MSG('该配送单未收货')
                  } else {
                    this.path = '/Print/Wts'
                    this.$router.push({
                      path: this.path,
                      query: {
                        id: this.printid,
                        printer: this.printer.printer,
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
                        printer: this.printer.printer,
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
                        printer: this.printer.printer,
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
                      printer: this.printer.printer,
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
                          printer: this.printer.printer,
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
                          printer: this.printer.printer,
                          reprint: 1,
                          btn: true,
                          token: localStorage.getItem('Authorization')
                        }
                      })
                    } else if (res.data.data.type === 'FRSH') {
                      this.path = '/Print/Fresh'
                      this.$router.push({
                        path: this.path,
                        query: {
                          id: this.printid,
                          printer: this.printer.printer,
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
                          printer: this.printer.printer,
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
                    printer: this.printer.printer,
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
                    printer: this.printer.printer,
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
              } else if (res.data.data.status !== 'R') {
                this.POP_MSG('该配送单未收货')
              } else {
                this.path = '/Print/Wts'
                this.$router.push({
                  path: this.path,
                  query: {
                    id: res.data.data.id,
                    printer: this.printer.printer,
                    reprint: 1,
                    btn: true,
                    token: localStorage.getItem('Authorization')
                  }
                })
              }
            }
          })
        } else if (this.method === 'FRSH') {
          this.$api.Rcv.GetOrderByDocumentOrderId(this.printid).then(res => {
            if (res.data.code === 0) {
              this.POP_MSG(res.data.msg)
            } else {
              console.log(res.data)
              this.$api.Rcv.getShipmentByOrderId(res.data.data.id).then(res => {
                console.log(res.data)
                if (res.data.data.toLocationId !== this.$store.state.location.id) {
                  this.POP_MSG('该自采单不是 ' + this.$store.state.location.id + ' 门店自采单')
                } else if (res.data.data.status !== 'R') {
                  this.POP_MSG('该自采单未收货')
                } else {
                  this.path = '/Print/Fresh'
                  this.$router.push({
                    path: this.path,
                    query: {
                      id: res.data.data.id,
                      printer: this.printer.printer,
                      reprint: 1,
                      btn: true,
                      token: localStorage.getItem('Authorization')
                    }
                  })
                }
              })
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
                    printer: this.printer.printer,
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
                    printer: this.printer.printer,
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
