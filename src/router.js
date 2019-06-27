import Vue from 'vue'
import VueRouter from 'vue-router'

// 引入登陆组件
// 在项目中引入资源，一般使用绝对路径
// 在配置文件中，已经进行根目录的配置。@符合就代码src根目录
import Login from '@/views/login.vue'
import Home from '@/views/home.vue'
import Welcome from '@/views/welcome.vue'
import Users from '@/views/users/users.vue'
import Right from '@/views/rights/right.vue'
import Roles from '@/views/rights/roles.vue'
import Goods from '@/views/goods/goods.vue'
import List from '@/views/goods/list.vue'
import Add from '@/views/goods/add.vue'
Vue.use(VueRouter)
// 创建路由模块
var router = new VueRouter({
  routes: [{
    path: '/',
    // 实现重定向
    redirect: {
      name: 'Login'
    }
  },
  {
    name: 'Login',
    path: '/login',
    component: Login
  },
  {
    name: 'Home',
    path: '/home',
    component: Home,
    // 实现重定向
    redirect: {
      name: 'Welcome'
    },
    // 添加嵌套路由
    children: [{
      name: 'Welcome',
      path: 'welcome',
      component: Welcome
    }, {
      name: 'Users',
      path: 'users',
      component: Users
    }, {
      name: 'Right',
      path: 'rights',
      component: Right
    },
    {
      name: 'Roles',
      path: 'roles',
      component: Roles
    },
    {
      name: 'Goods',
      path: 'goods',
      component: Goods,
      redirect: {
        name: 'List'
      },
      children: [{
        name: 'List',
        path: 'list',
        component: List
      },
      {
        name: 'Add',
        path: 'add',
        component: Add
      }
      ]
    }
    ]
  }
  ]
})
// module.exports = router
export default router
