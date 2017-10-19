<template>
  <div>
    <div class="control-sidebar control-sidebar-light">
      <div class="control-sidebar-hd">
        <div class="hd-toggle">
          <a href="#" data-toggle="control-sidebar">
            <span class="fa fa-angle-right"></span>
          </a>
        </div>
      </div>
      <div class="tab-content">
        <div class="tab-pane active">
          <ul class="control-sidebar-menu" v-if="menu">
             <li :class="item.ClassName" :key="index" v-for="(item, index) in menu">
              <a :href="item.AppUrl">
                <i class="menu-icon" :class="item.AppIcon == 'icon' ? 'icon-JLlogo': item.AppIcon"></i>
                <div class="menu-info">
                  <h4 class="control-sidebar-subheading">{{ item.AppName }}</h4>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="control-sidebar-bg"></div>
  </div>
</template>
<script>
import api from '../../api'
export default {
  data () {
    return {
      menu: []
    }
  },
  methods: {
    fetch () {
      var vm = this
      $.ajax({
        type: 'post',
        url: api.sidebar,
        xhrFields: {
          withCredentials: true
        },
        // data: options.data,
        crossDomain: true,
        success: function (data) {
          vm.menu = data
        },
        error: function (data) {
          window.location.href = api.auth + window.location.href
        }
      })
    }
  },
  mounted () {
    if (window.location.href.indexOf('localhost') === -1) {
      this.fetch()
    }
    $(function () {
      $('body').on('click', function (e) {
        if (
          _.every(
            [$(e.target), $(e.target.parentNode)],
            function (item) {
              return item.data('toggle') !== 'control-sidebar'
            })
          ) {
          var o = $.AdminLTE.options.controlSidebarOptions
          var sidebar = $(o.selector)
          $.AdminLTE.controlSidebar.close(sidebar, o.slide)
        }
      })
    })
  }
}
</script>
<style>
.user-panel .image img {
  border-radius: 50%;
}
</style>



// WEBPACK FOOTER //
// src/components/widget/ControlSidebar.vue?0a4e5633