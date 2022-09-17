import { ElNotification, ElMessageBox,ElMessage } from 'element-plus'

import nprogress from 'nprogress'

export function toast (
  message,
  type = 'success',
  dangerouslyUseHTMLString = true
) {
  ElNotification({
    // 非2xx，服务端发来的信息存放在err.response.data中。如果是网络问题，那么err.response.data是undefined。
    message,
    type,
    duration: 1500,
    // message如果是html，dangerouslyUseHTMLString为true则渲染html。
    dangerouslyUseHTMLString
  })
}

export function showModal (content, title = '', type = 'warning') {
  return ElMessageBox.confirm(content, title, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type
  })
}

export function showFullLoading () {
  nprogress.start()
}

export function hideFullLoading () {
  nprogress.done()
}

export function showPrompt (message, inputValue = '', title='') {
  return ElMessageBox.prompt(message, title, {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    /* 输入框初始值  */
    inputValue
  })
}