<template>
  <div class="container-wrap">
    <div class="container">
      <div class="header">edit tools</div>
      <div class="header">tabs</div>
      <div class="main">
        <div class="title">
          <div class="title-text" contenteditable="true">title</div>
          <div class="title-date">创建于：2019年4月2日12点</div>
          <div class="title-tags">
            <el-tag
              :key="tag"
              v-for="tag in dynamicTags"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)">
              {{tag}}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            >
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
          </div>
        </div>
        <div class="main text-region" contenteditable="true">content</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dynamicTags: ['标签一', '标签二', '标签三'],
      inputVisible: false,
      inputValue: ''
    };
  },
  methods: {
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    }
  }
}
</script>

<style scoped>
  .container-wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .container {
    display: flex;
    height: 100%;
    flex-direction: column;
    overflow: hidden;
  }

  .header {
    height: 60px;
    width: 100%;
    flex-grow: 0;
    flex-shrink: 0;
  }

  .main {
    flex-grow: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .title {
    padding: 0px 10px 0px 10px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  .title-text {
    outline: none;
    font-size: x-large;
    max-width: 80%;
    flex-wrap: wrap;
  }

  .title-date {
    width: fit-content;
    white-space: nowrap;
    color:rgb(139, 139, 139);
    margin: 10px 0px 10px 0px;
  }

  .title-tags {
    display: flex;
    flex-direction: row;
    width: 100%;
    overflow-x: hidden;
    overflow-y: visible;
    flex-wrap: wrap;
  }

  .el-tag{
    margin-right: 10px;
  }
  .button-new-tag {
    margin-right: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

  .text-region {
    outline: none;
    padding: 25px 20px 20px 20px;
  }
</style>
