<template>
  <div class="container-wrap">
    <div class="container">
      <div class="header">
        <div class="toolbox space-between">
          <div class="toolbox selftool">
            <div class="toolbox-item">加粗</div>
            <div class="toolbox-item">下划</div>
            <div class="toolbox-item" @click="handleTabsEdit(null, 'add')">加页面</div>
            <el-color-picker v-model="fontColor"></el-color-picker>
          </div>
          <div class="toolbox systool align-right">
            <el-tooltip content="打开设置页" :hide-after="3000" placement="left" effect="light">
              <div class="toolbox-item"><i class="el-icon-setting"></i></div>
            </el-tooltip>
          </div>
        </div>
      </div>
      <div class="main">
        <el-tabs v-model="editableTabsValue" type="card" closable @edit="handleTabsEdit">
          <el-tab-pane
            :key="doc.name"
            v-for="(doc) in editableTabs"
            :label="doc.title"
            :name="doc.name"
          >
            <div class="title">
              <div 
                class="title-text" 
                contenteditable="true" 
                v-text="doc.title"
                @input="doc.title=$event.target.innerHTML">
                {{doc.title}}
              </div>
              <div class="title-date">创建于：{{doc.create_date}}</div>
              <div class="title-tags">
                <el-tag
                  :key="tag"
                  v-for="tag in doc.tags"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(doc.tags, tag)">
                  {{tag}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(doc.tags)"
                  @blur="handleInputConfirm(doc.tags)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </div>
            </div>
            <div class="main text-region" contenteditable="true">content</div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputVisible: false,
      inputValue: '',
      fontColor: '#409EFF',
      editableTabsValue: '1',
      tabIndex: 1,
      editableTabs: [
        {
          title: 'abcdefg',
          create_date: new Date(),
          tags: ['标签一', '标签二', '标签三'],
          content: "hello",
          name: '1',
        }
      ]
    };
  },
  methods: {
    handleClose(tags, tag) {
      tags.splice(tags.indexOf(tag), 1);
    },
    showInput() {
      this.inputVisible = true;
    },
    handleInputConfirm(tags) {
      let inputValue = this.inputValue;
      if (inputValue) {
        tags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    handleTabsEdit(targetName, action) {
      if (action === 'add') {
        let newTabName = ++this.tabIndex + '';
        this.editableTabs.push({
          title: 'New Tab',
          name: newTabName,
          content: '',
          tags: [],
          create_date: new Date()
        });
        this.editableTabsValue = newTabName;
      }
      if (action === 'remove') {
        console.log('remove')
        let tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }
        
        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      }
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

  .toolbox {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    user-select: none;
  }

  .toolbox-item {
    flex: 0 0;
    white-space: nowrap;
    padding: 8px;
    border-style: solid;
    border-color: rgb(241, 241, 241);
    border-width: 1px;
  }

  .toolbox-item:hover {
    background-color: rgb(241, 241, 241);
    cursor: pointer;
  }

  .space-between {
    justify-content: space-between;
  }

  .selftool {
    flex: 1 0;
  }

  .systool {
    flex: 0 0;
    flex-direction: row-reverse;
  }
</style>
