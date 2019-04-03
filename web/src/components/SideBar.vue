<template>  
<div class="container-wrap">
  <div class="container">
    <transition name="fade" mode="out-in">
      <div 
        class="main" 
        v-if="this.sideBarState === 'sidebar-view'" 
        :key="'sidebarView'" 
        @mouseup="changePageWidth($event, 'up')" 
        @mousemove="changePageWidth($event, 'move')"><!--key must be included in order to work-->
        <div 
          class="page page-left"
          :class="{pause: this.dragging}" 
          :style="'width:' + this.leftPageWidth + 'px;'">
          <div class="page-header">
            <el-button 
              class="button toolbox-item" 
              icon="el-icon-search" circle
              @click="changeSidebarMode('sidebar-search', 'global')">
            </el-button>
            <el-button 
              class="button toolbox-item" 
              icon="el-icon-setting" circle
              @click="showFolder = !showFolder">
            </el-button>
          </div>
          <div class="page-main">
            <div 
              v-for="folder in metafiledata" 
              :key="folder.id"
              @click="handleFolderClick(folder)">
              <div class="list-item">
                <span class="title-text">{{folder.id}}</span>
              </div>
            </div>
          </div>
          <div class="page-footer">
            <el-tooltip content="加文档" effect="light" :hide-after="3000">
              <el-button class="button" icon="el-icon-plus" circle></el-button>
            </el-tooltip>
          </div>
        </div>
        <div class="separate-line" @mousedown="changePageWidth($event, 'down')">

        </div>
        <div class="page page-right" :class="{pause: this.dragging}">
          <!--need justify-->
          <div class="page-header right-align">
            <el-dropdown trigger="click" placement="bottom">
              <span class="el-dropdown-link">
                <el-button class="button toolbox-item" circle>排</el-button>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item disabled>↓</el-dropdown-item>
                <el-dropdown-item>时间</el-dropdown-item>
                <el-dropdown-item>标题</el-dropdown-item>
                <el-dropdown-item disabled divided>↑</el-dropdown-item>
                <el-dropdown-item>时间</el-dropdown-item>
                <el-dropdown-item>标题</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown trigger="click" placement="bottom">
              <span class="el-dropdown-link">
                <el-button 
                  class="button toolbox-item" 
                  icon="el-icon-more" 
                  circle 
                  size="large"></el-button>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>x</el-dropdown-item>
                <el-dropdown-item>y</el-dropdown-item>
                <el-dropdown-item>z</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button 
              class="button toolbox-item" 
              icon="el-icon-search" 
              circle
              size="large"
              @click="changeSidebarMode('sidebar-search', 'local')">
            </el-button>
          </div>
          <div class="page-main">
            <div 
              class="list-item folder-item" 
              v-for="item in this.currFolderInstance.items" 
              :key="item.created_time"
              draggable="true">
              <span class="title-text">{{item.title}}</span>
            </div>
          </div>
          <div class="page-footer">
            <el-tooltip content="加文档" effect="light" :hide-after="3000">
              <el-button class="button" icon="el-icon-plus" circle></el-button>
            </el-tooltip>
          </div>
        </div>
      </div>
      <div class="main" v-if="this.sideBarState === 'sidebar-search'" :key="'sidebarSearch'">
        <div class="page page-right">
          <div class="page-header">
            <el-button class="button toolbox-item" @click="changeSidebarMode('sidebar-view')">
              <i class="el-icon-close"></i>
            </el-button>
            <el-input
              class="search-input"
              size="large"
              placeholder="请输入内容"
              v-model="searchInput"
              clearable>
            </el-input>
            <!--TODO input here, indicate whether is global or local search-->
          </div>
          <div class="page-main">
            search page
            <ul>
              <li class="list-item" v-for="count in 100" :key="count">a {{count}}</li>
            </ul>
          </div>
        </div>
      </div>
    </transition>
  </div>
</div>
</template>

<script>
  var testData = [
    {
      id: 'folder1000000000000000000000000000000000000000000000000',
      items: [
        {title: 'title1111111111111111111111111111111111111111', created_time: '20150101', tags:'tag11111111111111111111 tag2 tag3'},
        {title: 'title', created_time: '20150102', tags:'tag1 tag2 tag3'},
        {title: 'title', created_time: '20150103', tags:'tag1 tag2 tag3'},
        {title: 'title', created_time: '20150104', tags:'tag1 tag2 tag3'},
        {title: 'title', created_time: '20150105', tags:'tag1 tag2 tag3'},
        {title: 'title', created_time: '20150106', tags:'tag1 tag2 tag3'},
        {title: 'title', created_time: '20150107', tags:'tag1 tag2 tag3'},
        {title: 'title', created_time: '20150108', tags:'tag1 tag2 tag3'},
        {title: 'title', created_time: '20150109', tags:'tag1 tag2 tag3'},
        {title: 'title', created_time: '20150110', tags:'tag1 tag2 tag3'},
        {title: 'title', created_time: '20150111', tags:'tag1 tag2 tag3'},
        {title: 'title', created_time: '20150112', tags:'tag1 tag2 tag3'},
      ]
    },
    {
      id: 'folder2',
      items: [
        {title: 'title', created_time: '20150113', tags:'tag1 tag2 tag3'},
        {title: 'title', created_time: '20150114', tags:'tag1 tag2 tag3'},
        {title: 'title', created_time: '20151114', tags:'tag1 tag2 tag3'},
        {title: 'title', created_time: '20152114', tags:'tag1 tag2 tag3'},
        {title: 'title', created_time: '20153114', tags:'tag1 tag2 tag3'},
        {title: 'title', created_time: '20154114', tags:'tag1 tag2 tag3'},
        {title: 'title', created_time: '20155114', tags:'tag1 tag2 tag3'},
        {title: 'title', created_time: '20156114', tags:'tag1 tag2 tag3'},
        {title: 'title', created_time: '20157114', tags:'tag1 tag2 tag3'},
        {title: 'title', created_time: '20158114', tags:'tag1 tag2 tag3'},
        {title: 'title', created_time: '20159114', tags:'tag1 tag2 tag3'},
        {title: 'title', created_time: '20160114', tags:'tag1 tag2 tag3'},
        {title: 'title', created_time: '20161114', tags:'tag1 tag2 tag3'},
        {title: 'title', created_time: '20162114', tags:'tag1 tag2 tag3'},
        {title: 'title', created_time: '20163114', tags:'tag1 tag2 tag3'},
        {title: 'title', created_time: '20164114', tags:'tag1 tag2 tag3'},
        {title: 'title', created_time: '20165114', tags:'tag1 tag2 tag3'},
        {title: 'title', created_time: '20166114', tags:'tag1 tag2 tag3'},
      ]
    },
    {
      id: 'folder3',
      items: [
        {title: 'title', created_time: '20150115', tags:'tag1 tag2 tag3'},
        {title: 'title', created_time: '20150116', tags:'tag1 tag2 tag3'},
        {title: 'title', created_time: '20150117', tags:'tag1 tag2 tag3'},
        {title: 'title', created_time: '20150118', tags:'tag1 tag2 tag3'},
        {title: 'title', created_time: '20150119', tags:'tag1 tag2 tag3'},
      ],
      searchResults: [
        {title: 'title', created_time: '20150118', tags:'tag1 tag2 tag3'},
        {title: 'title', created_time: '20150119', tags:'tag1 tag2 tag3'},
      ]
    }
  ]
  
  const sideBarStates = ['sidebar-view', 'sidebar-search'] 

  export default {
    components: { },
    data() {
      return {
        sideBarState: 'sidebar-view',
        separateLineState: 'up',
        leftPageWidth: 200,
        dragging: false,
        metafiledata: testData,
        currFolderInstance: testData[0],
        searchInput: "", // TODO need to separate global and local search inputs
        // TODO drag and drop to move a document to another folder
      };
    },
    methods: {
      changeSidebarMode(curr_state, mode){
        this.sideBarState = curr_state
        switch (mode) {
          case 'global':
            // TODO handle global search mode
            break;
          case 'local':
            // TODO handle local search mode
            break;
        }
      },
      changePageWidth: function(event, action) {
        switch(action) {
          case 'down':
            //console.log(event)
            //console.log('mouse down')
            this.separateLineState = 'down'
            this.dragging = true;
            break;
          case 'move':
            if (this.separateLineState === 'down') {
              //console.log('mouse move')
              //console.log('clientX: ', event.clientX)
              //this.dragging = true;
              let clientX = event.clientX
              if (clientX > 100 && clientX < 400) {
                this.leftPageWidth = clientX
              }
            }
            break;
          case 'up':
            //console.log('mouse up')
            this.separateLineState = 'up'
            this.dragging = false;
            //console.log('clientX: ', event.clientX)
            break;
        }
      },
      handleFolderClick(folderInstance) {
        if (this.currFolderInstance !== null) {
          this.currFolderInstance = folderInstance
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
    box-shadow: -1px -1px 5px 0px #d4d4d4 inset;
  }

  .header {
    height: 60px;
    width: 100%;
  }

  .main {
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    overflow: hidden;
  }

  .page {
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .page-header {
    flex-grow: 0;
    flex-shrink: 0;
    height: 60px;
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    white-space: nowrap;
    user-select: none;
  }

  .page-main {
    flex-grow: 1;
    flex-shrink: 1;
    width: inherit;
    height: 100%;
    white-space: nowrap;
    overflow-x: hidden;
    overflow-y: visible;
    border-width: 3.5px 0px 3.5px 0px;
    border-style: solid;
    border-color: white;
    border-top-color: rgb(231, 231, 231);
    border-bottom-color: rgb(231, 231, 231);
    user-select: none;
  }

  .page-footer {
    flex-grow: 0;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    white-space: nowrap;
    width: 100%;
    height: 60px;
    user-select: none;
  }

  .page-left {
    min-width: 100px;
    max-width: 400px;
    flex-grow: 0;
    flex-shrink: 0;
  }

  .separate-line {
    width: 3.5px;
    background-color:rgb(231, 231, 231);
    height: 100%;
    flex-shrink: 0;
    flex-grow: 0;
  }

  .separate-line:hover {
    cursor: ew-resize;
  }

  .page-right {
    flex-grow: 1;
  }

  .toolbox-item {
    display: inline-block;
    margin: 0px 2px 0px 2px;
  }
  
  .button {
    border: none;
  }

  .list-item {
    width: inherit;
    padding: 10px 5px 10px 5px;
    flex-grow: 0;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    height: 30px;
  }

  .list-item:hover {
    background-color:rgb(211, 238, 238);
  }

  .pause {
    pointer-events: none;
  }

  .highlight {
    background-color:rgb(173, 230, 230);
  }

  .title-text {
    margin: 0px 5px 0px 5px;
    overflow-x: hidden;
    text-overflow: ellipsis;
  }
  
  .search-input {
    padding: 0px 5px 0px 5px;
  }

  /*if element transition has no attribute "name", the default class is v-....*/
  .fade-enter-active, .fade-leave-active {
    transition: all .4s ease;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
    transform: translateX(50px);
  }

</style>
