import router from '~/router/index'
import { toast, showFullLoading, hideFullLoading } from '~/composables/util'
import store from '~/store'

router.beforeEach(async (to, from) => {
  showFullLoading()

  const token = store.state.token

  // && 防止死循环
  if (!token && to.path !== '/login') {
    toast('请先登录', 'error')
    return '/login'
  }
  if (token && to.path === '/login') {
    // 取消导航
    return from.path
  }
  if (token) {
    // 如果用户登录了，自动获取用户信息，并存储在vuex当中
    await store.dispatch('getUserInfo')
    // 放行即可。不需要return 或者 return true
  }
  
  // 路由表中的meta。
  const title = to.meta.title || ''
  document.title = title

  // 放行即可。不需要return 或者 return true
})

router.afterEach(() => {
  hideFullLoading()
})
