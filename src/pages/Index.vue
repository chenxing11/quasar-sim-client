<template>
  <q-page class="column">
    <div class="mobile-hide">
      <div
        class="q-pa-xs"
        style="top:50px;"
      >
        <div class="q-pa-md">选择门店/仓库</div>
        <div class="q-px-md">
          <q-btn-dropdown
            dense
            id="loc-drop"
            style="width:20%"
            color="white"
            text-color="black"
            :label=this.$store.state.location.label
            no-caps
          >
            <q-list>
              <q-item
                bordered
                v-for="(loc, index) in locationListTemp"
                :key="index"
                v-model="locationLabel"
                @click="locationLabel = loc.label, changeloc(loc)"
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
    </div>
    <div class="mobile-only">
      <div
        class="q-pa-xs"
        style="top:50px;"
      >
        <div class="q-pa-md">选择门店/仓库</div>
        <div class="q-px-md">
          <q-btn-dropdown
            dense
            id="loc-drop"
            style="width:100%"
            color="white"
            text-color="black"
            :label="this.$store.state.location.label"
            no-caps
          >
            <q-list>
              <q-item
                bordered
                v-for="(loc, index) in locationListTemp"
                :key="index"
                v-model="locationLabel"
                @click="locationLabel = loc.label, changeloc(loc)"
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
        <div class="q-pa-md">选择单据打印机</div>
        <div class="q-px-md">
          <q-btn-dropdown
            dense
            id="loc-drop"
            style="width:100%"
            color="white"
            text-color="black"
            :label="printerLabel"
            no-caps
          >
            <q-list>
              <q-item
                bordered
                v-for="(p, index) in printerList"
                :key="index"
                v-model="printerLabel"
                @click="printerLabel = p.printerName, changePrinter(p)"
                clickable
                v-close-popup
              >
                <q-item-section>
                  <q-item-label class="text-center">{{ p.printerName }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </div>
    </div>
  </q-page>
</template>

<style lang="stylus">
@media only screen and (max-width: 375px) {
}
</style>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'PageIndex',
  data () {
    return {
      itemId: '',
      scrollNum: 0,
      locationListTemp: [],
      locationList: [],
      printerList: [],
      locationId: 0,
      location: {},
      locationLabel: '',
      printerLabel: ''
    }
  },
  created () {
    this.BTN_PAGE(false)
    this.checkUser()
  },
  mounted () {
    if (this.$store.state.isreload === true) {
      this.ISRELOAD()
      // this.$router.go(0)
    }
    // this.locationLabel = this.$store.state.location.label
  },
  watch: {
  },
  methods: {
    ...mapMutations(['ISRELOAD', 'GET_LOCATIONID', 'GET_REALNAME', 'GET_USERNAME', 'GET_GROUPS',
      'GET_ROLES', 'GET_AUTHS', 'GET_LOCATIONS', 'GET_LOCATION', 'BTN_PAGE', 'CLEAR_EXTTERNALNO', 'CLEAR_ORDERID', 'CLEAR_SHIPMENTID', 'POP_MSG', 'GET_PRINTER']),
    changeloc (val) {
      this.GET_LOCATION(val)
      localStorage.setItem('Location', val.id)
      // localStorage.setItem('StoreId', val.id)
      localStorage.setItem('locationList', JSON.stringify(val))
      this.$api.LocationPrint.ListAllLocationPrinters(val.id, 'MerchandiseReceipt').then(res => {
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
        let printer = this.printerList.filter(i => i.mainPrint === true)[0]
        this.printerLabel = printer.printerName
        localStorage.setItem('printer', JSON.stringify(printer))
      })
    },
    changePrinter (val) {
      localStorage.setItem('printer', JSON.stringify(val))
    },
    onLoad (index, done) {
      setTimeout(() => {
        if (this.locationList.length !== 0) {
          this.locationListTemp.push(...this.locationList.splice(0, 20))
          done()
        } else {
          this.scrollNum = 0
          console.log('到底了')
          stop()
          done(true)
        }
      }, 500)
    },
    checkUser () {
      this.$api.User.info().then(res => {
        console.log(res.data.data)
        this.GET_REALNAME(res.data.data.realname)
        this.GET_USERNAME(res.data.data.username)
        this.GET_GROUPS(res.data.data.groups)
        this.GET_ROLES(res.data.data.roles)
        this.GET_AUTHS(res.data.data.auths)
        this.GET_LOCATIONS(res.data.data.organizations)
        // localStorage.setItem('Location', res.data.data.organizations[0])
        localStorage.setItem('auths', JSON.stringify(res.data.data.auths))
        localStorage.setItem('realName', res.data.data.realname)
        localStorage.setItem('username', res.data.data.username)
        this.$api.Basic.listStores().then(res => {
          this.locationList = res.data.data.map(val => {
            let json = {}
            json.id = val.id
            json.name = val.name
            json.label = val.id + '-' + val.name
            json.printer = val.printer
            return json
          })
          // console.log(this.locationList)
          this.locationListTemp = this.locationList
          if (this.locationListTemp.length <= 20) {
            this.scrollNum = 0
          }
          this.locationListTemp = this.locationList
          if (this.locationListTemp.length <= 20) {
            this.scrollNum = 0
          }
          let Location = localStorage.getItem('Location')
          this.$api.LocationPrint.ListAllLocationPrinters(Location === null ? this.locationListTemp[0].id : Location, 'MerchandiseReceipt').then(res => {
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
            let printer = JSON.parse(localStorage.getItem('printer'))
            console.log(printer)
            if (printer == null) {
              console.log(this.printerList)
              let p = this.printerList.filter(i => i.mainPrint === true)[0]
              this.printerLabel = p.printerName
              localStorage.setItem('printer', JSON.stringify(p))
            } else {
              this.printerLabel = printer.printerName
              console.log(printer)
            }
          })
          if (Location == null) {
            localStorage.setItem('Location', this.locationListTemp[0].id)
            // localStorage.setItem('StoreId', this.locationListTemp[0].id)
            localStorage.setItem('locationList', JSON.stringify(this.locationList[0]))
            this.GET_LOCATION(this.locationListTemp[0])
          }
        })
      })
    }
  }
}
</script>
