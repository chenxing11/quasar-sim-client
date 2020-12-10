<template>
  <div>
    <div class="row item-center">
      <!-- <div class="col-3 q-px-xs">收货时间 : </div> -->
      <q-input
        class="col q-px-xs"
        filled
        v-model="startDate"
        mask="date"
        :rules="['date']"
        label="开始日期"
      >
        <template v-slot:append>
          <q-icon
            name="event"
            class="cursor-pointer"
          >
            <q-popup-proxy
              ref="startDate"
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date
                v-model="startDate"
                @input="() => $refs.startDate.hide()"
              />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <q-input
        class="col q-px-xs"
        filled
        v-model="endDate"
        mask="date"
        :rules="['date']"
        label="结束日期"
      >
        <template v-slot:append>
          <q-icon
            name="event"
            class="cursor-pointer"
          >
            <q-popup-proxy
              ref="endDate"
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date
                v-model="endDate"
                @input="() => $refs.endDate.hide()"
              />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
    <div class="q-px-md text-right">
      <q-btn
        class="btn-primary"
        label="查询"
        @click="searchBtn"
      />
    </div>
    <q-expansion-item>
      <template v-slot:header>
        <q-item-section>
          <q-item-label>直送收货</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-item-label>{{ queryData.poCount + queryData.podsdCount + queryData.dsdCount + queryData.freshCount }}</q-item-label>
        </q-item-section>
      </template>
      <q-item>
        <q-item-section class="justify-between">
          <q-item-label
            class="text-weight-bold text-black"
            caption
          >订单收货</q-item-label>
          <q-item-label class="text-grey-8">{{ queryData.poCount }}</q-item-label>
        </q-item-section>
        <q-item-section class="justify-between">
          <q-item-label
            class="text-weight-bold text-black"
            caption
          >永续订单收货</q-item-label>
          <q-item-label class="text-grey-8">{{ queryData.podsdCount }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section class="justify-between">
          <q-item-label
            class="text-weight-bold text-black"
            caption
          >永续收货</q-item-label>
          <q-item-label class="text-grey-8">{{ queryData.dsdCount }}</q-item-label>
        </q-item-section>
        <q-item-section class="justify-between">
          <q-item-label
            class="text-weight-bold text-black"
            caption
          >自采收货</q-item-label>
          <q-item-label class="text-grey-8">{{ queryData.freshCount }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-expansion-item>

    <q-expansion-item>
      <template v-slot:header>
        <q-item-section>
          <q-item-label>退货</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-item-label>{{ queryData.rtvCount + queryData.stwCount }}</q-item-label>
        </q-item-section>
      </template>
      <q-item>
        <q-item-section class="justify-between">
          <q-item-label
            class="text-weight-bold text-black"
            caption
          >退货至供应商</q-item-label>
          <q-item-label class="text-grey-8">{{ queryData.rtvCount}}</q-item-label>
        </q-item-section>
        <q-item-section class="justify-between">
          <q-item-label
            class="text-weight-bold text-black"
            caption
          >退货至仓库</q-item-label>
          <q-item-label class="text-grey-8">{{ queryData.stwCount }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-expansion-item>

    <q-expansion-item>
      <template v-slot:header>
        <q-item-section>
          <q-item-label>店间调拨</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-item-label>0</q-item-label>
        </q-item-section>
      </template>
      <q-item>
        <q-item-section class="justify-between">
          <q-item-label
            class="text-weight-bold text-black"
            caption
          >店间调出</q-item-label>
          <q-item-label class="text-grey-8">0</q-item-label>
        </q-item-section>
        <q-item-section class="justify-between">
          <q-item-label
            class="text-weight-bold text-black"
            caption
          >店间调入</q-item-label>
          <q-item-label class="text-grey-8">0</q-item-label>
        </q-item-section>
      </q-item>
    </q-expansion-item>

    <q-expansion-item>
      <template v-slot:header>
        <q-item-section>
          <q-item-label>配送收货</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-item-label>{{ queryData.wtsCount }}</q-item-label>
        </q-item-section>
      </template>
    </q-expansion-item>

    <!-- <q-expansion-item label="Disabled">
    <q-card>
      <q-card-section>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, eius reprehenderit eos corrupti
        commodi magni quaerat ex numquam, dolorum officiis modi facere maiores architecto suscipit iste
        eveniet doloribus ullam aliquid.
      </q-card-section>
    </q-card>
  </q-expansion-item> -->
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import { date } from 'quasar'
var timeStamp = Date.now()
export default {
  data () {
    return {
      datenow: '', // 当前日期
      startDate: '', // 开始日期
      endDate: '', // 结束日期
      queryData: {} // 收货查询数据
    }
  },
  created () {
    this.datenow = date.formatDate(timeStamp, 'YYYY-MM-DD')
    this.CHANGE_TITLE('收货查询')
    this.startDate = this.datenow
    this.endDate = this.datenow
    this.searchBtn()
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_GO', 'BTN_PAGE', 'CHANGE_TITLE']),
    searchBtn () { // 收货查询
      let obj = {
        shippedDateFrom: this.startDate,
        shippedDateTo: this.endDate,
        locationId: this.$store.state.location.id
      }
      if (new Date(this.endDate) < new Date(this.startDate)) {
        this.POP_MSG('结束日期不能小于开始日期')
      } else {
        this.$api.Ship.GetShipmentsCountByDate(obj).then(res => {
          console.log(res)
          this.queryData = res.data.data
        })
      }
    }
  }
}
</script>
