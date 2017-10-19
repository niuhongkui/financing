<template>
<li class="dropdown user user-menu">
  <a class="dropdown-toggle" href="#" data-toggle="dropdown" aria-expanded="false">
    <img class="user-image" src="http://kr.xingyuanauto.com/staticsfile/public/img/head-default.png">
    <span class="hidden-xs"><span>{{ user.CnName }}</span></span></a>
  </a>
  <ul class="dropdown-menu">
    <li class="user-header">
      <img class="img-circle" src="http://kr.xingyuanauto.com/staticsfile/public/img/head-default.png">
      <p><span>{{ user.PostTitle }}</span></p>
    </li>
    <li class="user-footer">
      <div class="pull-right"><a class="btn btn-default btn-flat" @click="logout" href="#"><span>退出</span></a></div>
    </li>
  </ul>
</li>
</template>

<script>
import api from '../../api'
export default {
  name: 'User',
  data () {
    return {
      user: {}
    }
  },
  methods: {
    getUserInfo () {
      var vm = this
      $.ajax({
        type: 'get',
        url: api.user,
        xhrFields: {
          withCredentials: true
        },
        crossDomain: true,
        success: function (data) {
          vm.user = data
        }
      })
    },
    logout () {
      var vm = this
      $.ajax({
        type: 'post',
        url: api.logout,
        xhrFields: {
          withCredentials: true
        },
        crossDomain: true,
        success: function (data) {
          if (data.success) {
            if (window.location.href.indexOf('op') !== -1 || window.location.href.indexOf('spa') !== -1) {
              window.location.href = 'http://op.kr.xingyuanauto.com/portal/auth/login'
            } else {
              window.location.href = 'http://kr.xingyuanauto.com/portal/auth/login'
            }
          }
        },
        error: function (data) {
            // window.location.href = 'http://op.kr.xingyuanauto.com/portal/auth/login?ReturnUrl=' + window.location.href;
        }
      })
    }
  },
  mounted () {
    this.getUserInfo()
  }
}
</script>

<style>
</style>



// WEBPACK FOOTER //
// src/components/widget/User.vue?bab4d668