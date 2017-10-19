<template>
  <div>
    <div class="main-content">
      <div class="">
        <div class="error-page">
          <div class="headline text-yellow">404</div>
          <div class="error-content">
            <h3><i class="fa fa-warning text-yellow"></i><span class="ml10">服务器不小心弄丢了页面！</span></h3>
            <p><span>找不到您要寻找的页面。您可以</span>
              <router-link href="#" :to="'/'">返回首页</router-link>
              !
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
