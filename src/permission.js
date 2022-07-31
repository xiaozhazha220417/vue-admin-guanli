import router from '@/router'
import store from '@/store'
// 创建白名单
const whiteList = ['/login', '/404']
// 前置路由守卫
router.beforeEach(async (to, from, next) => {
  // 校验是否有token
  if (store.getters.token) {
    // 有token
    // 判断是否去登陆页面
    if (to.path === '/login') {
      // 有token再去登陆页面，有点多余，所以直接修改路由，跳转到首页
      next('/')
    } else {
      // 放行通过
      next()
    }
  } else {
    // 没有token
    // 有些路由是不用token的，例如 ：404，/login
    // 判断用户跳转的路由是否在白名单中
    if (whiteList.includes(to.path)) {
      // 去白名单 路由 放行
      next()
    } else {
      // 去有权限的 路由 去登录页
      next('/login')
    }
  }
})
