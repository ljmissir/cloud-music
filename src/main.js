// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import fastClick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'
import store from './store/index'
import 'common/js/fontSize'
import 'common/css/reset.css'
import 'common/font/iconfont.css'

Vue.config.productionTip = false

// vue懒加载插件
Vue.use(VueLazyLoad, {
    loading: require('components/header/cloud.png')
})

// 解决移动端点击延迟300ms问题
fastClick.attach(document.body)

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})
