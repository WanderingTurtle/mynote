<template>
  
</template>
<script>


export default {
  name: 'folder-search-tab',
  props: {
    folderInstance: {
      required: true
    },
    
  },
  data: function() {
    return {
      searchInput: '',
      searchResults: [],
      pageStyle: {
        paddingBottom: '0px'
      },
      dummy: 'a'
    }
  },
  beforeUpdated: function() {
    console.log('before updating')
    let vt_height = this.$parent.viewTabHeight
    this.handlePadding(vt_height)
  },
  mounted: function() {
    //console.log('hello from search tab')
    this.dummy === 'a'? this.dummy = 'b':this.dummy = 'a'
    this.$nextTick(function() {
      //console.log(vt_height)
      //EventBus.$on(this.folderInstance.id + 'view-tab-height', this.handlePadding)
    })
  },
  methods: {
    handleBackClick() {
      //this.currTab = 'view-tab'
      this.$emit('tab-change', 'folder-view-tab')
    },
    handlePadding(vt_height) {
      let myHeight = this.$refs.tab.clientHeight
      if (myHeight < vt_height) {
        this.pageStyle.paddingBottom = (vt_height - myHeight).toString() + 'px'
      }
    }
  }
}
</script>
<style scoped>
  
</style>


