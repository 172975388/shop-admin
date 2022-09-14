import { ref, reactive, toRaw } from 'vue'
import { useRoute, onBeforeRouteUpdate, useRouter } from 'vue-router'

// 即使useCookies的api再怎么简单，但是导入麻烦，建议封装。前面封装的token甚感不好，不应该写死token
import { useCookies } from '@vueuse/integrations/useCookies'

export function useTabList () {
  const cookies = useCookies()

  const route = useRoute()
  const router = useRouter()

  const activeTab = ref(route.path)

  const tabList = reactive(
    // cookies.get返回的不是响应式对象
    cookies.get('tabList') || [
      {
        title: '后台首页',
        path: '/'
      }
    ]
  )

  /**
   * onBeforeRouteUpdate，是组合式api，只能在setup中使用。
   * 当路由发生改变时触发该钩子。
   * 如果路由没有对应规则，进入404，不触发该钩子。
   *
   * 点击左侧菜单栏导致路由改变，要添加一个对应的右侧标签（有就不添加）
   *
   * 路由对象的path，表示不带query参数。fullPath，带query参数
   */
  onBeforeRouteUpdate(to => {
    addTab({
      title: to.meta.title,
      path: to.path
    })
    activeTab.value = to.path
  })

  /**
   * 右侧添加标签
   */
  function addTab (tabObj) {
    const hasTab = tabList.find(tab => {
      return tab.path === tabObj.path
    })

    if (!hasTab) {
      tabList.push(tabObj)
    }

    cookies.set('tabList', tabList)
  }

  function changeTab (path) {
    router.push(path)
  }

  function removeTab (path) {
    const index = tabList.findIndex(tab => tab.path === path)

    // 如果删除的是当前激活的标签，那么让下一个标签激活。如果没有下一个，就上一个
    if (path === activeTab.value) {
      if (index === tabList.length - 1) {
        activeTab.value = tabList[index - 1].path
      } else {
        activeTab.value = tabList[index + 1].path
      }
    }

    // 不要使用filter。因为filter不改变原数组，tabList是reactive对象，使用filter返回的数组导致外层不是proxy而内层是proxy。
    // toRaw()从响应式对象获取原对象
    // reactive 赋值新的 reactive，不会触发响应式。
    // 如果是ref，则代理对象在value属性上，可以整体替换，仍然触发响应式
    // ref本质上就是reactive({value: xxx})
    tabList.splice(index, 1)

    cookies.set('tabList', tabList)
  }

  // 如果响应式数据要被整个替换，建议使用ref而不是reactive。reactive替换所有不触发响应式。ref替换所有只是替换了value属性值。
  // 下面使用的是reactive，懒得改了。
  function handleClose (command) {
    if (command === 'closeOther') {
      const tab = toRaw(tabList.find(tab => tab.path === route.path))
      tabList.splice(1)
      // 如果当前是首页，那么标签删的只剩一个首页。否则标签剩余两个。
      if (tab.path === '/') {
        activeTab.value = '/'
      } else {
        tabList.push(tab)
        activeTab.value = tabList[1].path
      }
    } else if (command === 'closeAll') {
      tabList.splice(1)
      activeTab.value = '/'
    }
    cookies.set('tabList', tabList)
  }

  return {
    activeTab,
    tabList,
    changeTab,
    removeTab,
    handleClose
  }
}
