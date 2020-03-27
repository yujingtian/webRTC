<template>
  <div id="app">
     <router-view></router-view>
  </div>
</template>

<script>
import cookie from "@/assets/js/common";
export default {
  name: "app",
  data() {
    return {
    
    };
  }
};
</script>

<style lang="less">
@import "~vux/src/styles/reset.less";
@import "../src/assets/less/common.less";
#app{height:100%;}
</style>
