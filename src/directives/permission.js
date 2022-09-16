/**
 * https://cn.vuejs.org/guide/reusability/plugins.html#writing-a-plugin
 * 插件 (Plugins) 是一种能为 Vue 添加全局功能的工具代码
 * 实例化vue在main.js中实现。main.js引入当前js文件。
 * 当前js文件只能通过插件的形式获取到实例化的vue。
 *
 * 一个插件可以是一个拥有 install() 方法的对象，也可以直接是一个安装函数本身。
 * install第一个参数是vue实例
 * 使用app.use(插件) 来安装插件。
 * 
 * 用户个人信息（存入了vuex）里有其能访问的接口。用数组表示，每个元素是字符串，格式为 接口别名,方法  如getStatistics3,GET
 * 有些展示的数据，或者点击的按钮，需要发送ajax请求数据。假如用户没有对应权限，那么没有必要显示数据、按钮等。
 * 一个接口，可以设置其path末尾为别名。那么就有了接口别名，以及用户能访问的接口别名数组。
 * 一个div是否显示，可以根据接口别名是否在用户信息的接口别名数组中。
 * 对于这个逻辑判断，可以封装到自定义指令中。
 */

import store from '~/store'

export default {
  install (app) {
    // 使 v-permission 在所有组件中都可用
    // 自定义指令的全局注册
    app.directive('permission', (el, binding) => {
      // binding.value，v-permission=  的值。注意里面的值被当成js表达式解析。所以ss 表示 ss变量而不是ss字符串
      if (!Array.isArray(binding.value)) {
        throw new Error('v-permission需要接收数组')
      }
      const hasAuth = store.state.user.ruleNames.includes(binding.value[0])
      if (!hasAuth) {
        el.parentNode.removeChild(el)
      }
    })
  }
}
