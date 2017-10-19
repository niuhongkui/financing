<template>
  <!-- <ul class="sidebar-menu">
    <li><a href="#"><i class="fa icon-car-dialogue"></i><span>基础信息维护</span><span class="pull-right-container"></span><i class="fa fa-angle-left pull-right"></i></a>
      <ul class="treeview-menu menu-open">
        <li><a href="#">授信模版</a></li>
        <li><a href="#">授信配置</a></li>
        <li><a href="#">应用配置</a></li>
        <li><a href="#">金融产品</a></li>
      </ul>
    </li>
    <li><a href="#/loan/index"><i class="fa icon-list-tree-diagram"></i><span>自采融资管理</span><i class="fa fa-angle-left pull-right"></i></a>
      <ul class="treeview-menu menu-open">
        <li><a href="#/Finance/credit">金融授信</a></li>
        <li><a href="#/loan/index">金融贷款</a></li>
      </ul>
    </li>
    <li><a href="#"><i class="fa icon-list-tree-diagram"></i><span>经销商金融服务</span></a></li>
  </ul> -->
</template>
<script>
export default {
  name: 'SidebarMenu',
  data () {
    return {
      path: ''
    }
  },
  methods: {
    buildMenu (id) {
      var vm = this
      this.path = this.$route.path
      var appKey = '222abe2e-72b3-4257-b284-84e84fb7ee51'
      var menuId
      sidebarMenu({
        url: vm.$api.menu + '?appKey=' + appKey,
        currentMenu: id
      })
    }
  },
  mounted () {
    // if (this.$route.path.indexOf('loan') == -1) {
    //   this.buildMenu(1147)
    // } else {
    //   this.buildMenu(1148)
    // }

    if (this.$route.path.indexOf('loan') == -1) {
      this.buildMenu(156)
    } else {
      this.buildMenu(157)
    }
  },
  watch: {
    '$route': function (newVal, oldVal) {
      this.path = newVal.path
      // $('[data-menuid=1147], [data-menuid=1148]').removeClass('active')
      // if (newVal.path.indexOf('loan') > -1) {
      //   $('[data-menuid=1148]').addClass('active')
      // } else {
      //   $('[data-menuid=1147]').addClass('active')
      // }

      $('[data-menuid=156], [data-menuid=157]').removeClass('active')
      if (newVal.path.indexOf('loan') > -1) {
        $('[data-menuid=157]').addClass('active')
      } else {
        $('[data-menuid=156]').addClass('active')
      }
    }
  }
}
</script>
<style>
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(-90deg);
  }
}
</style>



// WEBPACK FOOTER //
// src/components/widget/Sidebar.vue?5de54d27