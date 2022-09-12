import { ElNotification, ElMessageBox } from 'element-plus'

import nprogress from 'nprogress'

export function toast (message, type = 'success') {
  ElNotification({
    // 非2xx，服务端发来的信息存放在err.response.data中。如果是网络问题，那么err.response.data是undefined。
    message,
    type,
    duration: 2000
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