<template>
  <div class="container-wrap">
    <div class="container">
      <div class="header">
        <div class="toolbox space-between">
          <div class="toolbox selftool">
            <div class="toolbox-item">加粗</div>
            <div class="toolbox-item">下划</div>
            <div class="toolbox-item" @click="handleTabActions($event, 'add', null)">加页面</div>
            <el-color-picker v-model="fontColor"></el-color-picker>
          </div>
        </div>
      </div>
      <div class="main">
        <div class="tab-header">
          <div class="tab-header-main" ref="tabHeader">
            <div 
              class="tab tab-item" 
              v-for="doc in openedDocs" 
              :key="doc.create_date" 
              :class="isTabActive(doc)?'active':''"
              @click="handleTabActions($event, 'change', doc)">
              <div class="tab-title">{{doc.title}}</div>
              <div 
                class="tab-button" 
                @click="handleTabActions($event, 'remove', doc)"
                @change="handleTabActions($event, 'dummy', null)"
                v-if="windowChanging && showTabButton(doc)">
                x
              </div>
            </div>
            <div class="tab-header-blank"></div>
          </div>
          <div 
            class="tab-header-setting tab" 
            :class="settingPageOpened?'active':''"
            @click="handleTabActions($event, 'setting', null)">
            <el-tooltip content="打开设置页" :hide-after="3000" placement="left" effect="light">
              <i class="el-icon-setting"></i>
            </el-tooltip>
          </div>
        </div>
        <div class="title" v-if="activeTab && !settingPageOpened">
          <div 
            class="title-text" 
            contenteditable="true" 
            v-text="activeTab.title"
            @input="activeTab.title=$event.target.innerHTML">
            {{activeTab.title}}
          </div>
          <div class="title-date">创建于：{{activeTab.create_date}}</div>
          <div class="title-tags">
            <el-tag
              :key="tag"
              v-for="tag in activeTab.tags"
              closable
              :disable-transitions="false"
              @close="handleClose(activeTab.tags, tag)">
              {{tag}}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              size="small"
              @keyup.enter.native="handleInputConfirm(activeTab.tags)"
              @blur="handleInputConfirm(activeTab.tags)"
            >
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
          </div>
        </div>
        <div class="tab-main" v-if="!settingPageOpened">
          <div class="text-region" contenteditable="true"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

let test_date = new Date().getTime()

export default {
  data() {
    return {
      inputVisible: false,
      inputValue: '',
      fontColor: '#409EFF',
      activeTabId: test_date,
      activeTab: null,
      prevActiveTab: null,
      settingPageOpened: false,
      windowChanging: 1,
      openedDocs: [
        {
          title: 'abcdefg',
          create_date: test_date,
          tags: ['标签一', '标签二', '标签三'],
          data: "hello",
        }
      ]
    };
  },
  mounted() {
    window.onresize = () => {
      this.windowChanging === 1? this.windowChanging = 2:this.windowChanging = 1;
    }
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
    handleTabActions(event, action, curr_doc) {
      switch(action) {
        case 'setting':
          // TODO handle setting page
          this.settingPageOpened = true
          this.prevActiveTab = this.activeTab
          this.activeTab = null
          break;
        case 'change':
          this.activeTab = curr_doc
          this.settingPageOpened = false
          break;
        case 'add':
          this.openedDocs.push({
            title: 'abcdefg',
            create_date: new Date().getTime(),
            tags: ['标签一', '标签二', '标签三'],
            data: "hello",
          })
          // TODO set new tab as the active tab
          break;
        case 'remove':
          let removeDoc
          let removeIndex = -1
          for (let index in this.openedDocs) {
            let doc = this.openedDocs[index]
            if (doc.create_date === curr_doc.create_date) {
              removeDoc = doc
              removeIndex = index
            }
          }
          if (removeIndex > -1) {
            this.openedDocs.splice(removeIndex, 1)
          }
          if (removeDoc.create_date === this.activeTabId) {
            let nextActiveIndex = removeIndex
            if (nextActiveIndex >= this.openedDocs.length) {
              nextActiveIndex -= 1;
            } 
            let nextActiveTab = this.openedDocs[nextActiveIndex]
            this.activeTab = nextActiveTab
            if (this.openedDocs.length < 1) {
              this.activeTab = null
            }
            //console.log('active tab id: ', this.activeTabId)
          }
          event.stopPropagation();
          break;
        default:
          console.log('detect change')
          break;
      }
    },
    showTabButton(doc) {
      if (!doc || !this.activeTab) return false
      let id = doc.create_date
      let activeTabId = this.activeTab.create_date
      let show = false
      if (this.$refs.tabHeader) {
        let tabWidth = this.$refs.tabHeader.firstElementChild.clientWidth
        if (tabWidth < 100) {
          return (id === activeTabId)
        } 
        return true
      } else {
        return (id === activeTabId)
      }
      //console.log(this.$refs.tabHeader.firstElementChild.clientWidth)
    },
    isTabActive(tab) {
      if (this.activeTab) {
        return this.activeTab === tab
      }
      return false
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
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .title {
    padding: 10px 10px 5px 10px;
    flex-grow: 0;
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

  .el-tabs, .el-tab-pane {
    overflow-y: hidden;
    height: inherit;
    flex-grow: 1;
  }

  .tab-header {
    height: 40px;
    width: 100%;
    flex-grow: 0;
    flex-shrink: 0;
    display: flex;
    flex-direction: row;
    background-color: rgb(255, 255, 255);
    overflow: hidden;
    white-space: nowrap;
    justify-content: space-between;
  }

  .tab-header-main {
    justify-content:left;
    display: flex;
    flex-direction: row;
    flex: 1 1;
    overflow: hidden;
  }

  .tab-header-blank {
    flex: 1 1;
    width: 100%;
    min-width: 0px;
    border-style: solid;
    border-width: 0px 0px 1px 0px;
    border-color: rgb(201, 201, 201)
  }

  .tab-header-setting {
    flex: 0 0;
    padding: 0px 8px 0px 8px;
    width: 50px;
  }

  .tab {
    white-space: nowrap;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-style: solid;
    border-width: 1px 1px 1px 1px;
    border-color: rgb(201, 201, 201);
  }

  .tab + .tab {
    border-width: 1px 1px 1px 0px;
  }

  .tab-item {
    padding: 5px;
    max-width: 120px;
    min-width: 25px;
    flex: 1 1;
  }

  .tab-title {
    overflow: hidden;
    align-items: center;
    user-select: none;
    margin-left: 5px;
    margin-right: 5px;
  }

  .tab-button {
    border-radius: 50%;
    padding: 0px 5px 0px 5px;
    user-select: none;
    align-items: center;
  }

  .tab-button:hover {
    background-color: rgb(245, 245, 245);
  }

  .active {
    border-bottom-color: white;
    background-color: white;
  }

  .tab-main {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0px 2px 3px #e9e9e9 inset;
  }

  .text-region {
    flex-grow: 1;
    height: inherit;
    overflow-y: auto;
    outline: none;
    padding: 30px 20px 20px 20px;
  }
</style>
