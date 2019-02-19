<template>  
  <div class="container">
    <div class="header">
      <transition name="header" mode="out-in">
        <div class="page" v-if="sideBarState === 'sidebar-view'" key='sidebar-view'>
          <el-row type="flex" class="tool-box-bot row-bg" justify="space-between">
            <el-button circle @click="toggleAllTags($event)">收</el-button>
            <el-button @click="changeSidebarMode('sidebar-search')" class="mainSearchOpen" icon="el-icon-search" circle></el-button>
          </el-row>
        </div>
        <div class="page" v-if="sideBarState === 'sidebar-search'" key='sidebar-search'>
          <el-row type="flex" class="tool-box-bot row-bg" justify="space-between">
            <el-input
              class="main-search-input"
              size="large"
              placeholder="请输入内容"
              v-model="mainSearchInput"
              clearable>
            </el-input>
            <el-button @click="changeSidebarMode('sidebar-view')" class="mainSearchClose" icon="el-icon-close" circle></el-button>
          </el-row>
        </div>
      </transition>  
    </div>
    <div class="main">
      <transition>
      
        <div class="page-scroll" v-show="sideBarState === 'sidebar-view'">
          <div 
            class="page-scroll-container"
            v-for="(folderInstance) in metafiledata" 
            :key="folderInstance.id"
            >
            <transition mode="out-in">
              <el-collapse  
                v-model="activeItemName" 
                @change="handleFolderChange"
                v-show="sideBarState === 'sidebar-view'">
                <el-collapse-item :name="folderInstance.id">
                  <template slot="title" >
                    <p class="folder-title">{{folderInstance.id}}</p>  
                  </template>
                  <folder :folderInstance="folderInstance"></folder>
                </el-collapse-item>
              </el-collapse>
            </transition>
          </div>
          
          <div class="list-end-marker"></div>
        </div>
      </transition>
      <transition mode="out-in"> 
        <div class="page-scroll" v-show="sideBarState === 'sidebar-search'">
          <ol class="item-list">
            <li class="item" v-for="item in this.mainSearchResults" :key="item.created_time">
              <el-tooltip :content="item.tags" :open-delay="618" :hide-after="3618" placement="bottom-end" effect="light">
                <el-card shadow="hover" class="item-title" @click="openFile($event, item.created_time)" :body-style="{padding: '0px'}">
                  {{ item.title === ''? item.created_time:item.title }}
                </el-card>
              </el-tooltip>
            </li>
          </ol>
        </div>
      </transition>
    </div>
    <div class="footer" ref="footer">
      <el-row type="flex" class="tool-box-bot" justify="center">
        <el-button icon="el-icon-circle-plus-outline" circle title="加分类"></el-button>
      </el-row>
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
        // {title: 'title', created_time: '20151114', tags:'tag1 tag2 tag3'},
        // {title: 'title', created_time: '20152114', tags:'tag1 tag2 tag3'},
        // {title: 'title', created_time: '20153114', tags:'tag1 tag2 tag3'},
        // {title: 'title', created_time: '20154114', tags:'tag1 tag2 tag3'},
        // {title: 'title', created_time: '20155114', tags:'tag1 tag2 tag3'},
        // {title: 'title', created_time: '20156114', tags:'tag1 tag2 tag3'},
        // {title: 'title', created_time: '20157114', tags:'tag1 tag2 tag3'},
        // {title: 'title', created_time: '20158114', tags:'tag1 tag2 tag3'},
        // {title: 'title', created_time: '20159114', tags:'tag1 tag2 tag3'},
        // {title: 'title', created_time: '20160114', tags:'tag1 tag2 tag3'},
        // {title: 'title', created_time: '20161114', tags:'tag1 tag2 tag3'},
        // {title: 'title', created_time: '20162114', tags:'tag1 tag2 tag3'},
        // {title: 'title', created_time: '20163114', tags:'tag1 tag2 tag3'},
        // {title: 'title', created_time: '20164114', tags:'tag1 tag2 tag3'},
        // {title: 'title', created_time: '20165114', tags:'tag1 tag2 tag3'},
        // {title: 'title', created_time: '20166114', tags:'tag1 tag2 tag3'},
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
  
  import Folder from './Folder.vue'
  const sideBarStates = ['sidebar-view', 'sidebar-search'] 

  export default {
    components: {
      Folder,
    },
    data() {
      return {
        sideBarState: 'sidebar-view',
        metafiledata: testData,
        mainSearchInput: '',
        mainSearchResults: [],
        activeItemName: [],
      };
    },
    methods: {
      changeSidebarMode(curr_mode){
        this.sideBarState = curr_mode
      },
      toggleAllTags() {
        if (this.activeItemName.length !== 0) {
          this.activeItemName = []
        }
      },
    }
  }
</script>

<style scoped>
  /* .el-collapse {
    padding-bottom: 200px;
  } */
  .container {
    height: 100%;
    overflow: hidden;
  }
  .header {
    margin-left: 10px;
    margin-right: 10px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    overflow: hidden;
  }
  .footer {
    margin-left: 10px;
    margin-right: 10px;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    overflow: hidden;
  }
  .main {
    margin: 10px;
    position: absolute;
    overflow: hidden;
    left: 0;
    right: 0;
    top: 60px;
    bottom: 60px;
  }
  .page-scroll {
    height: 100%;
    overflow-y: visible;
    overflow-x: hidden;
  }
  .tool-box-top {
    padding-block-start: 25px;
    padding-block-end: 25px;
  }
  .main-search-input {
    font-size: 16px;
    margin-right: 10px;
  }
  .folder-title {
    font-size: 18px;
  }
  .tool-box-bot {
    padding-top: 10px;
    overflow:hidden;
  }
  .item-list {
    padding: 0px;
    list-style: none;
  }
  .item-title {
    padding-left: 10px;
    padding-top: 5px;
    padding-bottom: 5px;
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 16px;
  }
  .item-title:hover {
    cursor: pointer;
  }
  .el-popover {
    max-width: 220px;
    overflow: hidden;
  }
  /*if element transition has no attribute "name", the default class is v-....*/
  .header-enter, 
  .header-leave-to {
    opacity: 0;
    transform: translateY(-20px);
  }
  .header-enter-active,
  .header-leave-active {
    transition: all .3s linear;
  }
  .v-enter, 
  .v-leave-to {
    opacity: 0;
    transform: translateY(-100px);
  }
  .v-enter-active,
  .v-leave-active {
    transition: all .4s linear;
  }
</style>
