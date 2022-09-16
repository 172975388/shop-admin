import { createApp } from 'vue'
import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import 'virtual:windi.css'

import router from './router/index.js'
import store from '~/store/index'
import '~/permission'

import 'nprogress/nprogress.css'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import permission from '~/directives/permission'

// createApp(App) 实例化vue   .use返回实例，所以可以链式调用
const app = createApp(App)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app
  .use(ElementPlus)
  .use(router)
  .use(store)
  .use(permission)
  .mount('#app')
