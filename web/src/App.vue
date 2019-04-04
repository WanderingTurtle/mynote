<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  overflow: hidden;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  font-size: 18;
}

  /*滚动条整体部分,必须要设置*/
  ::-webkit-scrollbar{
    width: 12px;
    height: 10px;
    background-color: rgb(219, 219, 219);
  }
  /*滚动条的轨道*/
  ::-webkit-scrollbar-track{
    box-shadow: inset 0 0 5px rgba(161, 161, 161, 0.3);
    background-color: rgb(255, 255, 255);
  }
  /*滚动条的滑块按钮*/
  ::-webkit-scrollbar-thumb{
    border-radius: 10px;
    background-color: rgb(201, 201, 201);
    box-shadow: inset 0 0 5px rgb(240, 240, 240);
  }
  /*滚动条的上下两端的按钮*/
  ::-webkit-scrollbar-button{
    height: 0px;
  }
</style>
