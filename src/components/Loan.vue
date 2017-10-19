<template>
<div class="wrapper">
  <div class="main-header">
    <a class="logo">
      <span class="logo-lg">
        <i :class="app.logo"></i>
        {{ app.name }}
      </span>
      <span class="logo-mini"><i :class="app.logo"></i></span>
    </a>
    <div class="navbar">
      <a class="sidebar-toggle" href="#" data-toggle="offcanvas"><span class="sr-only">Toggle navigation</span></a>
      <div class="navbar-custom-menu">
        <ul class="nav navbar-nav">
          <user />
          <li><a href="#" data-toggle="control-sidebar"><span class="glyphicon glyphicon-th"></span></a></li>
        </ul>
      </div>
    </div>
  </div>
  <div class="sidebar-wrapper">
    <div class="main-sidebar">
      <div class="sidebar">
        <Sidebar />
      </div>
    </div>
  </div>
  <div class="content-wrapper">
    <transition name="fade-in">
      <router-view></router-view>
    </transition>
    <!-- <div class="content-header">
      <breadcrumbs></breadcrumbs>
    </div>
    <div class="content" v-title="$route.meta.breadcrumb">
      <transition name="fade-in">
        <router-view ref="demo1"></router-view>
      </transition>
    </div> -->
    <div class="content-footer"><i class="icon icon-xyauto"></i>
      <div class="pull-right hidden-xs">
        Copyright © 2017  行圆汽车
        .
         All rights reserved.
      </div>
    </div>
  </div>
  <control-sidebar />
</div>
</template>

<script>
import Sidebar from './widget/Sidebar'
import ControlSidebar from './widget/ControlSidebar'
import User from './widget/User'

export default {
  data () {
    return {
      app: {
        logo: 'icon-rudder',
        name: '金控系统'
      }
    }
  },
  mounted () {
  },
  components: {
    Sidebar,
    ControlSidebar,
    User
  }
}
</script>

<style scoped>
[v-cloak] {
  display: none;
}
label {
  font-weight: 200;
}
.fade-in-enter-active {
  transition: all .6s ease;
}
.fade-in-leave-active {
  transition: all 0 cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.fade-in-enter, .fade-in-leave-to {
  transform: translateY(10px);
  opacity: 0;
}
.content-header .breadcrumb a.active {
  color: #888
}
</style>



// WEBPACK FOOTER //
// src/components/Loan.vue?0672bece