import Vue from 'vue'
import VueRouter from 'vue-router'

import layout from '@/views/layout'
Vue.use(VueRouter)
// 创建静态路由
const constantRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login')
  },
  {
    path: '/404',
    component: () => import('@/views/404')
  },
  {
    path: '/',
    component: layout,
    redirect: '/welcome',
    children: [
      {
        path: 'welcome',
        name: 'welcome',
        component: () => import('@/views/home')
      }
    ]
  },
  {
    path: '/',
    component: layout,
    children: [
      {
        path: 'users',
        component: () => import('@/views/users'),
        meta: { title: ['用户管理', '用户列表'] }
      }
    ]
  },
  {
    path: '/',
    component: layout,
    children: [
      {
        path: 'roles',
        component: () => import('@/views/roles'),
        meta: { title: ['权限管理', '角色列表'] }
      }
    ]
  },
  {
    path: '/',
    component: layout,
    children: [
      {
        path: 'rights',
        component: () => import('@/views/rights'),
        meta: { title: ['权限管理', '权限列表'] }
      }
    ]
  },
  {
    path: '/',
    component: layout,
    children: [
      {
        path: 'goods',
        component: () => import('@/views/goods'),
        meta: { title: ['商品管理', '商品列表'] }
      },
      {
        path: 'goods/add',
        component: () => import('@/views/goods/components/add'),
        meta: { title: ['商品管理', '添加商品'] }
      }
    ]
  },
  {
    path: '/',
    component: layout,
    children: [
      {
        path: 'params',
        component: () => import('@/views/params'),
        meta: { title: ['商品管理', '分类列表'] }
      }
    ]
  },
  {
    path: '/',
    component: layout,
    children: [
      {
        path: 'categories',
        component: () => import('@/views/categories'),
        meta: { title: ['商品管理', '商品分类'] }
      }
    ]
  },
  {
    path: '/',
    component: layout,
    children: [
      {
        path: 'orders',
        component: () => import('@/views/orders'),
        meta: { title: ['订单管理', '订单列表'] }
      }
    ]
  },
  {
    path: '/',
    component: layout,
    children: [
      {
        path: 'reports',
        component: () => import('@/views/reports')
      }
    ]
  },
  { path: '*', redirect: '/404' }
]

const createRouter = () => new VueRouter({
  routes: constantRoutes
})
const router = createRouter()

export default router
