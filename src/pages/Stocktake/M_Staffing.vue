<template>
<q-page class="orderlist">
  <q-list>
    <!-- <q-item-section clickable>
      <q-list class="q-pa-xs">
        <q-item-section >
          <q-card-section class="q-pa-xs" caption>
            <span class="q-pa-sm text-weight-bold text-black" style="font-size:1rem;">增加人员</span>
          </q-card-section>
        </q-item-section>
      </q-list>
    </q-item-section> -->

    <div>
      <q-card flat>
        <q-tabs no-shadow
                  v-model="tab"
                  class="text-black"
                  active-color="primary"
                  active-bg-color="white"
                  indicator-color="primary"
                  align="justify"
                  dense
                  no-caps
                  inline-label>
            <q-tab name="basic" label="增加人员" />
            <q-tab name="price" label="异常处理" />
          </q-tabs>

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel class="q-pa-xs" name="basic">
            <div>
              <q-list class="row">
                <q-input outlined dense v-model="inventoryId" class="col-10 q-px-md q-pt-md">
                  <template v-slot:before>
                    <div class=" self-stretch column justify-center">
                      <span class="text-bold text-black " style="font-size:.9rem;color:#black;">工号</span>
                    </div>
                  </template>
                </q-input>

                <q-input outlined dense type="password" v-model="inventoryId" class="col-10 q-px-md q-pt-md">
                  <template v-slot:before>
                    <div class=" self-stretch column justify-center">
                      <span class="text-bold text-black " style="font-size:.9rem;color:#black;">密码</span>
                    </div>
                  </template>
                </q-input>
              </q-list>

              <q-list class="row items-center q-pt-md">
                <div class="text-weight-bold" style="padding-left:16px;">岗位</div>
                <div>
                  <q-radio v-model="shape" val="line" label="录入员" />
                  <q-radio v-model="shape" val="rectangle" label="盘点员" />
                  <q-radio v-model="shape" val="ellipse" label="稽核员" />
                </div>
              </q-list>
              <div class="q-px-md q-mt-md text-right">
                <q-btn class="btn-primary" label="提交" @click="submit()"/>
              </div>
              <div class="q-pa-md" v-if="checkList">
                <q-table
                  flat
                  :data="data"
                  :columns="columns"
                  row-key="index"
                  hide-bottom/>
              </div>
            </div>
          </q-tab-panel>
          <q-tab-panel class="q-pa-xs" name="price">
            <q-list class="row">
                <q-input outlined dense v-model="inventoryId" class="col-10 q-px-md q-pt-md">
                  <template v-slot:before>
                    <div class=" self-stretch column justify-center">
                      <span class="text-bold text-black " style="font-size:.9rem;color:#black;">工号</span>
                    </div>
                  </template>
                </q-input>
            </q-list>
          </q-tab-panel>
        </q-tab-panels>

      </q-card>
    </div>

  </q-list>
</q-page>
</template>
<script>
export default {
  data () {
    return {
      tab: 'basic',
      shape: 'line',
      inventoryId: '',
      columns: [
        { name: 'itemId', align: 'left', label: '工号', field: 'itemId', sortable: true },
        { name: 'description', align: 'left', label: '岗位', field: 'description', sortable: true },
        { name: 'uom', align: 'left', label: '状态', field: 'uom' },
        { name: 'qtyExpected', align: 'left', label: '创建人', field: 'qtyExpected' }
      ],
      data: [
        {
          itemId: 159,
          description: 6.0,
          uom: 24,
          qtyExpected: '张三'
        },
        {
          itemId: 159,
          description: 6.0,
          uom: 24,
          qtyExpected: '李四'
        }
      ],
      checkList: true
    }
  },
  methods: {
    submit () {
      console.log(111)
    }
  }
}
</script>
