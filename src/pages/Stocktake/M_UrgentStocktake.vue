<template>
  <q-page class="orderlist">
    <br>
    <div>
    <q-list class="q-pa-xs row items-center q-pb-md">
        <q-select outlined dense v-model="ReceivingGoods" :options="region" class="col-10 q-px-xs" style="line-height:40px">
          <template v-slot:before>
            <div class="self-stretch column items-center">
              <span class="text-bold text-black " style="font-size:.9rem;color:#black;"><span style="opacity:0;">区</span>区域</span>
            </div>
          </template>
        </q-select>
    </q-list>
    <q-separator inset />
    <q-list class="q-pa-md">
      <q-form @submit="RETURNFALSE()" @keydown.enter="getitem()"
              class="orderinput">
        <q-input outlined dense label="扫描商品" v-model="Zone"/>
      </q-form>
    </q-list>
    <q-list class="q-pa-md row">
        <q-input outlined dense v-model="Zone" autofocus @keydown.enter="Channel()" class="col-6 q-px-xs items-center" style="line-height:40px;">
          <template v-slot:before>
            <div class="self-stretch column">
              <span class="text-bold text-black " style="font-size:.9rem;color:#black;">通道号</span>
            </div>
          </template>
        </q-input>
        <q-input outlined dense v-model="Bay" ref="shelves" @keydown.enter="shelves()" class="col-6 q-px-xs items-center" style="line-height:40px;">
          <template v-slot:before>
            <div class="self-stretch column">
              <span class="text-bold text-black " style="font-size:.9rem;color:#black;">货架号</span>
            </div>
          </template>
        </q-input>
    </q-list>
     <div class="q-pa-md" v-if="checkList">
        <q-table
          flat
          :data="data"
          :columns="columns"
          row-key="index"
          hide-bottom/>
      </div>

      <q-list  class="q-pa-sm" v-if="checkItem">
          <q-card-section class="q-pa-xs"
              caption>
            <span class="q-pa-sm text-weight-bold text-black">商品货号</span>
            <span class="q-pa-sm text-black">1111</span>
          </q-card-section>
          <q-card-section class="q-pa-xs"
            caption>
            <span class="q-pa-sm text-weight-bold text-black">品名</span>
            <span class="q-pa-sm text-black">111</span>
          </q-card-section>
        <q-form @submit="RETURNFALSE()" @keydown.enter.stop="qtyRule(adjQty)">
          <q-card-actions class="q-pa-xs"
          style="width:100%"
          caption
          line="1">
        <span class="InputLabel q-pa-sm text-weight-bold text-black">接受数量</span>
          <q-input id="adjQtyInput"
            :input-style="{ 'text-align': 'center' }"
            color="black"
            class="q-pa-xs"
            autofocus
            :suffix=" item.uom"
            v-model.number="adjQty"
            :dense="true" />
            </q-card-actions>
        </q-form>
      </q-list>

      <div class="rcv-btn" v-if="checkItem" >
        <div class="text-grey-8 q-gutter-xs q-pa-md">
          <q-btn class="btn-primary" label="确定" @click="qtyRule(adjQty)"/>
        </div>
      </div>
      <div class="rcv-btn" v-if="!checkItem">
        <div class="text-grey-8 q-gutter-xs q-pa-md">
          <q-btn class="btn-primary" @click="EndBay()" label="结束本Bay"/>
        </div>
      </div>
    </div>

      <q-dialog v-model="icon">
    <q-card>
      <q-card-section class="row items-center">
        <div class="text-h6">录入人登录</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <q-input outlined dense v-model="Zone" class="col-6 q-mb-lg items-center" style="line-height:40px">
          <template v-slot:before>
            <div class="self-stretch column">
              <span class="text-bold text-black " style="font-size:.9rem;color:#black;">账号</span>
            </div>
          </template>
        </q-input>
        <q-input outlined dense type="password" v-model="Zone" class="col-6 q-mb-lg items-center" style="line-height:40px">
          <template v-slot:before>
            <div class="self-stretch column">
              <span class="text-bold text-black " style="font-size:.9rem;color:#black;">密码</span>
            </div>
          </template>
        </q-input>
      </q-card-section>
      <div class="q-px-md q-mb-md text-center">
        <q-btn class="btn-primary" @click="signIn()" label="登录"/>
      </div>
    </q-card>
  </q-dialog>

  </q-page>
</template>
<script>
export default {
  data () {
    return {
      item: {
        uom: '袋'
      },
      adjQty: null,
      checkItem: false,
      icon: false,
      checkList: true,
      region: ['库区', '销售区'],
      ReceivingGoods: '库区',
      Zone: null,
      Bay: null,
      columns: [
        { name: 'itemId', align: 'left', label: '通道号', field: 'itemId', sortable: true },
        { name: 'description', align: 'left', label: '货架号', field: 'description', sortable: true },
        { name: 'uom', align: 'left', label: '状态', field: 'uom' },
        { name: 'qtyExpected', align: 'left', label: '录入员', field: 'qtyExpected' }
      ],
      data: [
        {
          itemId: 159,
          description: 6.0,
          uom: 24,
          qtyExpected: 4.0
        },
        {
          itemId: 159,
          description: 6.0,
          uom: 24,
          qtyExpected: 4.0
        }
      ]
    }
  },
  methods: {
    Channel () {
      this.$refs.shelves.focus()
    },
    shelves () {
      console.log(3333)
      this.icon = true
    },
    signIn () {

    },
    getitem () {
      this.checkList = false
      this.checkItem = true
    },
    qtyRule () {
      this.checkList = true
      this.checkItem = false
    }
  }
}
</script>
