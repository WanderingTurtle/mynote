<template>
  
</template>
<script>

export default {
  name: '',
  props: {
    folderInstance: {
      required: true
    },
  },
  data: function() {
    return {

    }
  },
  mounted: function(){
    // console.log('hello from view tab')
  },
  methods: {
    handleSearchClick() {
      //this.currTab = 'search-tab'
      this.$emit('tab-change', 'folder-search-tab', this.$refs.tab.clientHeight)
      // EventBus.$emit(this.folderInstance.id + 'view-tab-height', this.$refs.tab.clientHeight)
      // this.$emit('view-tab-height')
    },
  }
}
</script>
<style scoped>
  
</style>