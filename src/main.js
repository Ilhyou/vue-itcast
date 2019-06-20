import Vue from 'vue'
import App from './App.vue'
// 引入路由模块
import router from '@/router.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.less'
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
