import { createStore } from 'vuex'
import { login, getUserInfo, logout } from '~/api/manager'
import { getToken, setToken, removeToken } from '~/composables/auth'

// 创建一个新的 store 实例
const store = createStore({
  state () {
    return {
      user: {},
      // token存储在vuex中是为了速度。
      // 对于token的操作逻辑都应该放在vuex中。login接口用于获取token，所以不应该在登录组件中发起login请求，而是把login封装到vuex中。
      token: getToken(),
      // 侧边栏宽度
      asideWidth: '250px'
    }
  },
  mutations: {
    setUserInfo (state, user) {
      // user的信息不能存在本地。因为如果每次从本地读取user，那么user信息改变（别的电脑改的），那么每次读取的仍然是本地过时的信息
      state.user = user
    },
    removeUserInfo (state) {
      state.user = {}
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    removeToken (state) {
      state.token = ''
      removeToken()
    },
    // 展开/折叠 侧边栏
    handleAsideWidth (state) {
      state.asideWidth = state.asideWidth === '250px' ? '64px' : '250px'
    }
  },
  actions: {
    async getUserInfo (context) {
      const res = await getUserInfo()
      context.commit('setUserInfo', res)

      return res
    },
    async login (context, form) {
      const { token } = await login(form)
      context.commit('setToken', token)

      context.dispatch('getUserInfo')
    },
    async logout (context) {
      await logout()
      context.commit('removeToken')
      context.commit('removeUserInfo')
    }
  }
})

export default store
