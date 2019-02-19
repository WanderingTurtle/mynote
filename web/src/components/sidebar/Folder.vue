<template>
  <div @mouseenter="handleFolderMouseEnter">
    <transition mode="out-in"> 
      <div v-if="folderState === 'view'" ref="tabView" class="page" :key="this.folderInstance.id + 'view'">
        <el-container direction="vertical">
          <el-row type="flex" class="tag-tool-box" justify="space-between">
            <el-button @click="handleSearchClick()" class="tag-tool-box-item start-search-btn" icon="el-icon-search" circle size="medium"></el-button>
            <el-button class="tag-tool-box-item" icon="el-icon-plus" circle size="medium"></el-button>
            <el-dropdown trigger="click" placement="bottom">
              <span class="el-dropdown-link">
                <el-button class="tag-tool-box-item" circle size="medium">排</el-button>
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
                <el-button class="tag-tool-box-item" icon="el-icon-more" circle size="medium"></el-button>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>x</el-dropdown-item>
                <el-dropdown-item>y</el-dropdown-item>
                <el-dropdown-item>z</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-row>
          <ol class="item-list" ref="itemList">
            <li class="item" v-for="item in this.folderInstance.items" :key="item.created_time">
              <el-tooltip :content="item.tags" :open-delay="618" :hide-after="3618" placement="bottom-end" effect="light">
                <el-card shadow="hover" class="item-title" @click="openFile($event, item.created_time)" :body-style="{padding: '0px'}">
                  {{ item.title === ''? item.created_time:item.title }}
                </el-card>
              </el-tooltip>
            </li>
          </ol>
        </el-container>     
      </div>
      <div 
        v-if="folderState === 'search'" 
        ref="tabSearch" 
        class="page" 
        :key="this.folderInstance.id + 'search'" 
        :style="searchPageStyle">
        <el-container direction="vertical">
          <el-row type="flex" class="tag-tool-box" justify="space-between">
            <el-button @click="handleBackClick()" class="tag-tool-box-item close-search-btn" icon="el-icon-arrow-left" circle size="medium"></el-button>
            <el-input
              class="sub-search-input"
              size="medium"
              placeholder="请输入内容"
              v-model="searchInput"
              clearable>
            </el-input>
          </el-row>
          <ol class="item-list">
            <li class="item" v-for="item in this.searchResults" :key="item.created_time">
              <el-tooltip :content="item.tags" :open-delay="618" :hide-after="3618" placement="bottom-end" effect="light">
                <el-card shadow="hover" class="item-title" @click="openFile($event, item.created_time)" :body-style="{padding: '0px'}">
                  {{ item.title === ''? item.created_time:item.title }}
                </el-card>
              </el-tooltip>
            </li>
          </ol>
        </el-container>
      </div>
    </transition>
  </div>
</template>

<script>

export default {
  name: 'folder',
  props: {
    folderInstance: {
      required: true,
    }
  },
  data: function() {
    return {
      searchInput: '',
      searchResults: [

      ],
      folderState: 'view',
      searchPageStyle: {
        paddingBottom: '0px'
      },
      itemHeight: 0,
    }
  },
  mounted: function() {
    this.searchResults.push(this.folderInstance.items[0]) // test function
  },
  methods: {
    handleSearchClick() {
      this.folderState = 'search'
      let s_l = this.searchResults.length
      let i_l = this.folderInstance.items.length
      if (s_l < i_l) {
        this.searchPageStyle.paddingBottom = Math.floor((i_l - s_l) * this.itemHeight).toString() + 'px'
      }
      // console.log(s_h, v_h)
    },
    handleBackClick() {
      this.folderState = 'view'
    },
    handleFolderMouseEnter() {
      let itemList = this.$refs.itemList
      if (itemList) {
        let listHeight = itemList.clientHeight
        // console.log('hello:', listHeight)
        this.itemHeight = listHeight / this.folderInstance.items.length
      }
    },
    openFile(event, data) {
      console.log(data)
    },
  }
}
</script>
<style scoped>
  .page {
    overflow: hidden;
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
  .tag-tool-box {
    margin-bottom: 16px;
    margin-right: 10px;
  }
  .tag-tool-box-item  {
    margin: 0px;
  }
  .el-tag {
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: default;
  }
  .close-search-btn {
    margin-left: 3px;
  }
  .sub-search-input {
    margin-left: 5px;
    margin-right: 5px;
  }
  .v-enter, 
  .v-leave-to {
    opacity: 0;
    transform: translateX(50px);
  }
  .v-enter-active,
  .v-leave-active {
    transition: all .3s ease;
  }
</style>