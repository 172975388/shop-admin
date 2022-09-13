import { createRouter, createWebHashHistory } from 'vue-router'

import Index from '~/pages/index.vue'
import Login from '~/pages/login.vue'
import NotFound from '~/pages/404.vue'
import Admin from '~/layouts/admin.vue'
import GoodList from '~/pages/goods/list.vue'
import CategoryList from '~/pages/category/list.vue'

/* const routes = [
  {
    path: '/',
    component: Admin,
    children: [
      {
        path: '',
        component: Index,
        meta: {
          title: '后台首页'
        }
      },
      {
        path: '/goods/list',
        component: GoodList,
        meta: {
          title: '商品管理'
        }
      },
      {
        path: '/category/list',
        component: CategoryList,
        meta: {
          title: '分类列表'
        }
      }
    ]
  },
  {
    path: '/login',
    component: Login,
    meta: {
      title: '登录页'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
] */

// 默认路由，所有用户都能访问
const routes = [
  {
    path: '/',
    // router.addRoute 需要 父路由的name
    name: 'admin',
    component: Admin
  },
  {
    path: '/login',
    component: Login,
    meta: {
      title: '登录页'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

// 动态路由。存放所有动态路由规则
// 根据接口返回的用户能访问的路由，从asyncRoutes找出这些路由，联合默认路由进行注册。
const asyncRoutes = [
  {
    path: '',
    name: 'Index',
    component: Index,
    meta: {
      title: '后台首页'
    }
  },
  {
    path: '/goods/list',
    name: 'GoodList',
    component: GoodList,
    meta: {
      title: '商品管理'
    }
  },
  {
    path: '/category/list',
    name: 'CategoryList',
    component: CategoryList,
    meta: {
      title: '分类列表'
    }
  }
]

const router = createRouter({
  // 路由模式，hash
  history: createWebHashHistory(),
  routes
})

// 路由前置守卫中调用该方法。
export function addRoutes (menus) {
  for (let routeItem of menus) {
    asyncRoutes.find(asyncRoute => {
      if (asyncRoute.path === routeItem.frontpath) {
        // addRoute自动过滤已经注册的路由（根据name判断）
        router.addRoute('admin', asyncRoute)
      }
      if (routeItem.child && routeItem.child.length > 0) {
        addRoutes(routeItem.child)
      }
    })
  }
}

export default router

/**
 * 根据接口返回的用户信息，用户的能访问的路由存放在menus中。根据menus生成左侧菜单栏，根据menus动态注册路由。
 */
