import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import 'virtual:windi.css'

import router from './router/index.js'


// createApp(App) 实例化vue   .use返回实例，所以可以链式调用
createApp(App)
  .use(ElementPlus)
  .use(router)
  .mount('#app')
