<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
body {
  font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
  overflow: auto;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
}
.mod-search {
  border-color: #dfe6ec;
}
.content-header > .breadcrumb .active {
  color: inherit;
  font-size: inherit;
}
[v-cloak] {
  display: none;
}
.border-bottom {
  border: none!important;
}
.el-button--primary,
.el-button--primary:hover,
.el-button--primary:focus,
.el-button--primary:active {
  background: #495fcc;
  border-color: #495fcc;
}
.el-button--primary {
  background: #495fcc;
  border-color: #495fcc;
}
</style>
