<template>
  <q-page  class="">
    <div class="q-pa-md">
      <q-btn class="btn-back col-2 text-primary" flat
             icon="arrow_back_ios"
             style="font-size:1rem;"
             to='/WebStocktake/Imp' />
    <div class="row">
      <span class="col-12 q-px-md text-black text-bold" style="font-size:1.2rem;">导入</span>
      <div class="col-4 q-pa-md">
      <q-uploader
        color="teal"
        flat
        :headers= "getheader"
        :url="geturl('layout')"
        :form-fields ="getform"
        bordered
        ref="layoutUploaded"
        @uploaded="layoutUploaded"
        @finish ="$refs['layoutUploaded'].removeUploadedFiles()"
        accept=".xlsx"
        style="width:100%;"
      >
      <template v-slot:header="scope">
        <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
          <q-btn v-if="scope.queuedFiles.length > 0" icon="clear_all" @click="scope.removeQueuedFiles" round dense flat >
            <q-tooltip>清空</q-tooltip>
          </q-btn>
          <q-btn v-if="scope.uploadedFiles.length > 0" icon="delete" @click="scope.removeUploadedFiles" round dense flat >
            <q-tooltip>移除已上传</q-tooltip>
          </q-btn>
          <q-spinner v-if="scope.isUploading" class="q-uploader__spinner" />
          <div class="col">
            <div class="q-uploader__title">通道货架列表</div>
            <div class="q-uploader__subtitle">{{ scope.uploadSizeLabel }} / {{ scope.uploadProgressLabel }}</div>
          </div>
          <q-btn v-if="scope.canAddFiles" type="a" icon="add_box"  round dense flat>
            <q-uploader-add-trigger />
            <q-tooltip>选择文件</q-tooltip>
          </q-btn>
          <q-btn v-if="scope.canUpload" icon="cloud_upload" @click="scope.upload" round dense flat >
            <q-tooltip>上传</q-tooltip>
          </q-btn>

          <q-btn v-if="scope.isUploading" icon="delete" @click="scope.abort" round dense flat >
            <q-tooltip>移除已上传</q-tooltip>
          </q-btn>
        </div>
      </template>
      <template v-slot:list="scope">
        <q-list separator>
          <q-item v-if="scope.files.length === 0" class="text-grey"><q-item-section>可拖拽文件至此处</q-item-section></q-item>
          <q-item v-for="file in scope.files" :key="file.name">
            <q-item-section>
              <q-item-label class="full-width ellipsis">
                {{ file.name }}
              </q-item-label>
              <q-item-label caption>
                {{ file.__sizeLabel }} / {{ file.__progressLabel }}
              </q-item-label>
            </q-item-section>

            <q-item-section
              v-if="file.__img"
              thumbnail
              class="gt-xs"
            >
              <img :src="file.__img.src">
            </q-item-section>

            <q-item-section top side>
              <q-btn
                class="gt-xs"
                size="12px"
                flat
                dense
                round
                icon="ti-check"
                @click="scope.removeFile(file)"
              ><q-tooltip>已完成</q-tooltip>
              </q-btn>
            </q-item-section>
          </q-item>

        </q-list>
      </template>
      </q-uploader>
      </div>
      <div class="col-4  q-pa-md">
        <q-uploader
        color="teal"
        flat
        :headers= "getheader"
        :url="geturl('user')"
        bordered
        accept=".xlsx"
        :form-fields ="getform"
        ref="userUploaded"
        @uploaded="userUploaded"
        @finish ="$refs['userUploaded'].removeUploadedFiles()"
        style="width:100%;"
      >
      <template v-slot:header="scope">
        <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
          <q-btn v-if="scope.queuedFiles.length > 0" icon="clear_all" @click="scope.removeQueuedFiles" round dense flat >
            <q-tooltip>清空</q-tooltip>
          </q-btn>
          <q-btn v-if="scope.uploadedFiles.length > 0" icon="delete" @click="scope.removeUploadedFiles" round dense flat >
            <q-tooltip>移除已上传</q-tooltip>
          </q-btn>
          <q-spinner v-if="scope.isUploading" class="q-uploader__spinner" />
          <div class="col">
            <div class="q-uploader__title">盘点人员采集表</div>
            <div class="q-uploader__subtitle">{{ scope.uploadSizeLabel }} / {{ scope.uploadProgressLabel }}</div>
          </div>
          <q-btn v-if="scope.canAddFiles" type="a" icon="add_box"  round dense flat>
            <q-uploader-add-trigger />
            <q-tooltip>选择文件</q-tooltip>
          </q-btn>
          <q-btn v-if="scope.canUpload" icon="cloud_upload" @click="scope.upload" round dense flat >
            <q-tooltip>上传</q-tooltip>
          </q-btn>

          <q-btn v-if="scope.isUploading" icon="delete" @click="scope.abort" round dense flat >
            <q-tooltip>移除已上传</q-tooltip>
          </q-btn>
        </div>
      </template>
      <template v-slot:list="scope">
        <q-list separator>
          <q-item v-if="scope.files.length === 0" class="text-grey"><q-item-section>可拖拽文件至此处</q-item-section></q-item>
          <q-item v-for="file in scope.files" :key="file.name">
            <q-item-section>
              <q-item-label class="full-width ellipsis">
                {{ file.name }}
              </q-item-label>
              <q-item-label caption>
                {{ file.__sizeLabel }} / {{ file.__progressLabel }}
              </q-item-label>
            </q-item-section>

            <q-item-section
              v-if="file.__img"
              thumbnail
              class="gt-xs"
            >
              <img :src="file.__img.src">
            </q-item-section>

            <q-item-section top side>
              <q-btn
                class="gt-xs"
                size="12px"
                flat
                dense
                round
                icon="ti-check"
                @click="scope.removeFile(file)"
              ><q-tooltip>已完成</q-tooltip>
              </q-btn>
            </q-item-section>
          </q-item>

        </q-list>
      </template>
      </q-uploader>
      </div>
      <span class="col-12 text-red q-pa-md">请使用xlsx格式的EXCEL表上传。</span>
      <span class="col-12 q-px-md text-black text-bold" style="font-size:1.2rem;">信息</span>
      <div class="col-6 q-pa-md">
        <div class="text-black text-bold">通道货架列表</div>
        <div class="text-black q-px-md text-red">{{ locError }}</div>
      </div>
      <div class="col-6 q-pa-md">
        <div class="text-black text-bold">盘点人员采集表</div>
        <div class="text-black q-px-md text-red">{{ userError }}</div>
      </div>
    </div>
    </div>
  </q-page>
</template>

<style lang="stylus" >
</style>

<script>
import { mapMutations } from 'vuex'
import base from 'src/api/base' // 导入接口域名列表

export default {
  name: 'PageStoreRcvOrder',
  data () {
    return {
      StocktakeLocationId: null,
      locError: '未上传',
      userError: '未上传'
    }
  },
  created () {
    this.StocktakeLocationId = this.$route.query.StocktakeLocationId
    console.log(this.$refs)
  },
  mounted () {
  },
  computed: {
  },
  methods: {
    ...mapMutations(['POP_MSG', 'BTN_PAGE']),
    layoutUploaded ({ file, xhr }) {
      console.log(xhr.status)
      if (xhr.status === 200) {
        this.NotiSuccess('通道货架列表上传完成')
        console.log(JSON.parse(xhr.response))
        this.locError = JSON.parse(xhr.response).msg
      } else {
        this.POP_MSG('通道货架列表上传失败')
      }
    },
    userUploaded ({ file, xhr }) {
      console.log(xhr.status)
      if (xhr.status === 200) {
        this.NotiSuccess('盘点人员采集表上传完成')
        console.log(JSON.parse(xhr.response))
        this.userError = JSON.parse(xhr.response).msg
      } else {
        this.POP_MSG('盘点人员采集表上传失败')
      }
    },
    geturl (data) {
      var a
      if (data === 'layout') {
        a = `${base.api}/Stocktake/UploadStocktakeLayout`
      } else if (data === 'user') {
        a = `${base.api}/Stocktake/UploadStocktakeUsers`
      }
      return a
    },
    getheader () {
      var a = [
        { name: 'Authorization', value: localStorage.getItem('Authorization') }
      ]
      return a
    },
    getform () {
      var a = [
        { name: 'StocktakeLocationId', value: this.StocktakeLocationId }
      ]
      return a
    },
    formatStatus (status, fun) {
      if (fun === 0) {
        var text
        switch (status) {
          case 'A':
            text = '未开始'
            break
          case 'B':
            text = '进行中'
            break
          case 'C':
            text = '已结盘'
            break
          case 'D':
            text = '已废盘'
            break
        }
        return text
      } else if (fun === 1) {
        var editStatus
        switch (status) {
          case 'A':
            editStatus = false
            break
          case 'B':
            editStatus = false
            break
          case 'C':
            editStatus = true
            break
          case 'D':
            editStatus = true
            break
        }
        return editStatus
      }
    },
    formatType (status) {
      var TypeText
      switch (status) {
        case 'A':
          TypeText = '生鲜周盘'
          break
        case 'B':
          TypeText = '生鲜月盘'
          break
        case 'C':
          TypeText = '食百大盘'
          break
      }
      return TypeText
    }
  }
}
</script>
