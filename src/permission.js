import router from '~/router/index'
import { addRoutes } from '~/router/index'
import { toast, showFullLoading, hideFullLoading } from '~/composables/util'
import store from '~/store'

let isNecessaryRoute = true

router.beforeEach(async (to, from) => {
  showFullLoading()

  const token = store.state.token

  // 路由表中的meta。
  const title = to.meta.title || ''
  document.title = title

  // && 防止死循环
  if (!token && to.path !== '/login') {
    toast('请先登录', 'error')
    return '/login'
  }
  if (token && to.path === '/login') {
    // 取消导航
    return from.path
  }

  // 获取一次用户数据即可。刷新页面则重新运行代码，isNecessaryRoute为true，重新请求user信息
  if (token && isNecessaryRoute) {
    // 如果用户登录了，每访问一个页面都自动获取用户信息，并存储在vuex当中
    // 我觉得先去vuex中判断user信息是否存在，存在就别发请求了。比较好
    const { menus } = await store.dispatch('getUserInfo')
    // 动态添加路由
    if (isNecessaryRoute) {
      addRoutes(menus)
      // 修改为false，不然无限重定向
      isNecessaryRoute = false
      // 触发重定向
      // 刷新页面，跳转到404。需要重定向到该url。
      return to.fullPath
    }

    // console.log(router.getRoutes())  查看注册的路由
  }
})

router.afterEach(() => {
  hideFullLoading()
})
