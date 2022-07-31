import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 保证每个浏览器样式一致
import 'normalize.css/normalize.css'
// 路由守卫
import '@/permission' // permission control 权限访问
// 表格插件
import TreeTable from 'vue-table-with-tree-grid'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 面包屑组件
import Breadcrumb from '@/components/Breadcrumb'
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.component('Breadcrumb', Breadcrumb)
// 全局组件
Vue.component('TreeTable', TreeTable)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
