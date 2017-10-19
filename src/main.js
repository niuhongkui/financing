// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import App from './App'
import router from './router'
import api from './api'
import axios from 'axios'

Vue.config.productionTip = false

Vue.use(ElementUI)

Vue.directive('title', function(el, binding) {
    if (binding.value) {
        document.title = binding.value
    }
})

Vue.component('breadcrumbs', {
    template: `
      <ol class="breadcrumb" v-if="$breadcrumbs.path.length">
        <a class="back" href="#" v-show="$breadcrumbs.back" @click="go">&lt;&lt; 返回 </a>
        <li :class="[ $breadcrumbs.path.length == index + 1 ? 'active': '']" v-for="(crumb, index) in $breadcrumbs.path">
          <router-link v-if="index < $breadcrumbs.path.length - 1" :to=" { path: crumb.path }">{{ crumb.meta.breadcrumb }}</router-link>
          <span v-else>{{ crumb.meta.breadcrumb }}</span>
        </li>
      </ol>
    `,
    methods: {
        go() {
            this.$router.go(-1)
        }
    }
})

Vue.component('appLayout', {
    template: `
    <div>
      <div class="content-header">
        <slot name="crumb">
          <breadcrumbs></breadcrumbs>
        </slot>
      </div>
      <div class="content" v-title="$route.meta.breadcrumb">
        <slot></slot>
      </div>
    </div>
  `
})
var EventBus = new Vue()

Object.defineProperties(Vue.prototype, {
    $bus: {
        get: function() {
            return EventBus
        }
    },
    $breadcrumbs: {
        get: function() {
            var crumbs = {
                path: [],
                back: false
            }
            for (var i = 0; i < this.$route.matched.length; i++) {
                if (this.$route.matched[i].meta && this.$route.matched[i].meta.breadcrumb) {
                    crumbs.path.push(this.$route.matched[i])
                }
                if (this.$route.matched[i].meta && this.$route.matched[i].meta.back) {
                    crumbs.back = true
                }
            }
            return crumbs
        }
    },
    $api: {
        get: () => api
    },
    axios: {
        get: () => axios
    }
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: {
        App
    }
})


// WEBPACK FOOTER //
// ./src/main.js