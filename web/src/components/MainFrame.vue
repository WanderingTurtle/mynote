<template>
  <div class="container-wrap">
    <div class="container">
      <div class="main">

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainFrame',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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

  .main {
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    overflow: hidden;
  }

  .side {
    flex: 0 0;
  }

  .separate-line:hover {
    cursor: ew-resize;
  }
</style>
