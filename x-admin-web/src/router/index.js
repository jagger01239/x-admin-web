import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' ,affix: true}
    }]
  },

  // {
  //   path: '/sys',
  //   component: Layout,
  //   redirect: '/sys/user',
  //   name: 'sysManage',
  //   meta: { title: '系统管理', icon: 'sys' },
  //   children: [
  //     {
  //       path: 'user',
  //       name: 'userList',
  //       component: () => import('@/views/sys/user'),
  //       meta: { title: '用户管理', icon: 'userManage' }
  //     },
  //     {
  //       path: 'role',
  //       name: 'roleList',
  //       component: () => import('@/views/sys/role'),
  //       meta: { title: '角色管理', icon: 'roleManage' }
  //     },
  //     {
  //       path: 'person',
  //       name: 'personMessage',
  //       component: () => import('@/views/sys/Person'),
  //       meta: { title: '个人信息', icon: 'roleManage' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/test',
  //   component: Layout,
  //   redirect: '/test/test1',
  //   name: 'test',
  //   meta: { title: '测试模块', icon: 'form' },
  //   children: [
  //     {
  //       path: 'test1',
  //       name: 'test1',
  //       component: () => import('@/views/test/test1'),
  //       meta: { title: '文件上传', icon: 'form' }
  //     },
  //     {
  //       path: 'test2',
  //       name: 'test2',
  //       component: () => import('@/views/test/test2'),
  //       meta: { title: '整合echarts', icon: 'form' }
  //     },
  //     {
  //       path: 'test3',
  //       name: 'test3',
  //       component: () => import('@/views/test/test3'),
  //       meta: { title: '整合高德地图', icon: 'el-icon-position' }
  //     },
  //   ]
  // },
  // {
  //   path: '/v',
  //   component: Layout,
  //   redirect: '/v/video',
  //   name: 'gongneng',
  //   children: [
  //     {
  //       path: 'video',
  //       name: 'video',
  //       component: () => import('@/views/video/index.vue'),
  //       meta: { title: '集成视频组件', icon: 'form' }
  //     }
  //   ]
  // },{
  //   path: '/m',
  //   component: Layout,
  //   redirect: '/m/markdown',
  //   name: 'mark',
  //   children: [
  //     {
  //       path: 'markdown',
  //       name: 'markdown',
  //       component: () => import('@/views/markdown/index.vue'),
  //       meta: { title: '集成markdown编辑器', icon: 'el-icon-edit' }
  //     }
  //   ]
  // },



  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  // scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
