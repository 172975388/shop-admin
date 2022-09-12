import axios from 'axios'
import { toast } from '~/composables/util'
import store from '~/store'


const service = axios.create({
  baseURL: '/api'
})

// cookies.set('admin-token', res.token)

/**
 * api接口返回的json对象，其key都统一为msg和data
 */

// 添加请求拦截器
service.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    const token = store.state.token
    if (token) {
      config.headers['token'] = token
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
service.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response.data.data
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    // 非2xx，服务端发来的信息存放在err.response.data中。如果是网络问题，那么err.response.data是undefined。
    toast(error.response.data?.msg || '请求失败', 'error')
    // 必须发送一个Promise.reject以终止promise链
    return Promise.reject(error)
  }
)

export default service
