import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import Layout from '@/layout'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist
router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.meta.title)
  // determine whether the user has logged in
  const hasToken = getToken()
  // console.log(hasToken)
  if (hasToken) {
    console.log(to.path)
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      console.log("+++++++++++++++++++++")
      next({ path: '/' })
      NProgress.done()
    } else {
      // const hasGetUserInfo = store.getters.name
      const hasGetUserInfo = store.getters.name

      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info
          await store.dispatch('user/getInfo')//获取用户信息
          // 路由转换
          let myRoutes = myFilterAsyncRoutes(store.getters.menuList);
          // 404
          myRoutes.push({
            path: '*',
            redirect: '/404',
            hidden: true
          });
          // 动态添加路由
          router.addRoutes(myRoutes);
          // 存至全局变量
          global.myRoutes = myRoutes;
          next({...to,replace:true})  // 防止刷新后页面空白
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

function myFilterAsyncRoutes(menuList) {
  menuList.filter(menu => {
    if (menu.component === 'Layout') {
      menu.component = Layout
      console.log(menu.component);
    } else {
      menu.component = require(`@/views/${menu.component}.vue`).default
    }
    // 递归处理子菜单
    if (menu.children && menu.children.length) {
      menu.children = myFilterAsyncRoutes(menu.children)
    }
    return true
  })
  return menuList;
}

//
// 上述代码是一个Vue Router中的路由守卫，用于在路由导航之前进行一些操作。下面是每个部分的解释：
//
// 1. `NProgress.start()`：开始进度条。
//
// 2. `document.title = getPageTitle(to.meta.title)`：设置页面标题。
//
// 3. `const hasToken = getToken()`：检查用户是否已登录，这里使用`getToken()`方法获取用户的登录状态。
//
// 4. 对于已登录的用户：
//    - 如果目标路径是`'/login'`，则重定向到主页。
//    - 否则，检查用户是否已获取用户信息，通过`store.getters.name`判断。
//      - 如果已获取用户信息，直接跳转到目标路由。
//      - 如果未获取用户信息，调用`store.dispatch('user/getInfo')`获取用户信息。
//        - 获取用户信息后，通过`myFilterAsyncRoutes`方法过滤出用户具有访问权限的动态路由。
//        - 将动态路由添加到路由器中，使用`router.addRoutes(myRoutes)`。
//        - 存储动态路由到全局变量。
//        - 跳转到目标路由，使用`next({...to, replace: true})`。
//          - 这里使用`replace: true`来替换当前路由，以防刷新页面后导致页面内容为空白。
//
// 5. 对于未登录的用户：
//    - 如果目标路径在白名单（`whiteList`）中，则直接跳转到目标路由。
//    - 如果目标路径不在白名单中，则重定向到登录页面。
//
// 6. `NProgress.done()`：结束进度条。
//
// 在上述代码中，您需要根据您的具体需求和项目的路由配置进行适当的修改和适配。

