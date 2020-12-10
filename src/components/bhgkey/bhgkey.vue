<template>
  <span id="page">
    <div class="wrap">
      <div class="num-box">
        <q-input  @click="clickKeyWordWrap(inputref)" v-model="formData.text" :type=inputtype :ref=inputref ></q-input>
        <q-input
            color="goldenrod"
            type="password"
            bg-color="white"
            outlined
            bottom-slots
            v-model="formData.text"
            label="密码"
            @click="clickKeyWordWrap(inputref)"
          >
            <template v-slot:before>
              <q-icon name="lock" color="white" />
            </template>
            <template v-slot:append>
              <q-icon
                v-if="formData.text !== null"
                name="close"
                @click="formData.text = ''"
                class="cursor-pointer"
              />
            </template>
          </q-input>
      </div>
    </div>
    <span class="keyboard-wrap" v-if="keyBoardStatus === true">
      <div class="keyboard">
        <span
          v-for="(item,index) in capitalKeyWord._1"
          :key="index"
          @click="clickKeyBoard(item)"
        >{{item}}</span>
      </div>
      <div class="keyboard"  v-if="capsStatus">
        <span
          v-for="(item,index) in capitalKeyWord._2"
          :key="index"
          @click="clickKeyBoard(item)"
        >{{item}}</span>
      </div>
      <div class="keyboard"  v-if="capsStatus === false">
        <span
          v-for="(item,index) in smailKeyWord._2"
          :key="index"
          @click="clickKeyBoard(item)"
        >{{item}}</span>
      </div>
      <div class="keyboard"  v-if="capsStatus">
        <span
          v-for="(item,index) in capitalKeyWord._3"
          :key="index"
          @click="clickKeyBoard(item)"
        >{{item}}</span>
        <span class="delete" @click="deleteWord">
          ←
        </span>
      </div>
      <div class="keyboard"  v-if="capsStatus === false">
        <span
          v-for="(item,index) in smailKeyWord._3"
          :key="index"
          @click="clickKeyBoard(item)"
        >{{item}}</span>
        <span class="delete" @click="deleteWord">
          ←
        </span>
      </div>
      <span class="keyboard" v-if="capsStatus">
        <span
          v-for="(item,index) in capitalKeyWord._4"
          :key="index"
          @click="clickKeyBoard(item)"
        >{{item}}</span>
        <span class="caps" @click="capitalWord">
          小
        </span>
              <div class="cancel">
        <span @click="keyBoardStatus = false">完成</span>
      </div>
      </span>
      <span class="keyboard" v-if="capsStatus  === false">
        <span
          v-for="(item,index) in smailKeyWord._4"
          :key="index"
          @click="clickKeyBoard(item)"
        >{{item}}</span>
        <span class="caps" @click="capitalWord">
          大
        </span>
              <div class="cancel">
        <span @click="keyBoardStatus = false">完成</span>
      </div>
      </span>
    </span>
  </span>
</template>
<script>
export default {
  data () {
    return {
      formData: {
        id: null,
        ref: null,
        text: '',
        text1: ''
      },
      capitalKeyWord: {
        _1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
        _2: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        _3: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        _4: ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
      },
      smailKeyWord: {
        _1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
        _2: ['a', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        _3: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        _4: ['z', 'x', 'c', 'v', 'b', 'n', 'm']
      },
      keyBoardStatus: false,
      capsStatus: true,
      Text: ''
    }
  },
  watch: {

  },
  props: {
    inputtype: String,
    inputref: String,
    inputtext: String
  },
  mounted () {},
  methods: {
    clickKeyBoard (item) {
      // 点击自定义键盘
      console.log(item)
      this.Text = this.formData.text
      this.formData.text = this.Text + item
      console.log(this.$refs)
      this.$refs.str1.focus()
    },
    deleteWord () {
      // 退格
      this.Text = this.formData.text
      this.formData.text = this.Text.substring(0, this.Text.length - 1)
    },
    capitalWord () {
      this.capsStatus = !this.capsStatus
    },
    clickKeyWordWrap (inputId) {
      this.keyBoardStatus = true
      console.log(this.inputref)
      console.log(this.inputtype)
      console.log(this.$refs)
      console.log(inputId)
    }
  }
}
</script>
<style lang="stylus">
.flex-items-center {
  display: flex;
  align-items: center;
}

.wrap {
  margin: 0.5rem 0.6rem;
  padding: 0.85rem 0.6rem;
  border-radius: 0.5rem;

  // input输入框
  .num-box {
    justify-content: space-between;
    align-items: center;

    .spot {
      width: 0.2rem;
      height: 0.2rem;
      border-radius: 50%;
      background-color: #d8d8d8;
    }

    & > div {
      border: 1px solid #e4e4e4;

      &.focus {
        border: 1px solid #4a90e2;

        &:after {
          border-bottom: 0.5rem solid #4a90e2;
        }
      }

      span {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        font-size: 1rem;
        color: #828282;

        &.none {
          background-color: #9cbce2;
          color: #fff;
          text-indent: 0.4rem;
          border-radius: 0;
        }
      }
    }
  }
}

.keyboard-wrap {
  background-color: #CCC;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.6rem 0.6rem 0.4rem;

  .keyboard {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 2rem;
    margin-bottom: 0.3rem;

    span {
      text-align: center;
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: center;
      height: 1.8rem;
      margin: 0 0.3rem;
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.35);
      background-color: #fff;
      border-radius: 0.125rem;

      &:active {
        background-color: #e4e4e4;
      }

      &.bordernone {
        border: none;
        box-shadow: none;
        background-color: #D2D5DB;

        &:active {
          background-color: #D2D5DB;
        }
      }
      &.caps {
        background-color: #465266;
        color: #fff
      }
      &.delete {
        background-color: #465266;
        color: #fff

        img {
          width: 1.15rem;
        }
      }
    }
  }

  .cancel {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    span {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 3.2rem;
      height: 1.8rem;
      background-color: #465266;
      color: #fff;
      border-radius: 0.125rem;
    }
  }
}
</style>
