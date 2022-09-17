import { ElMessageBox, ElMessage } from 'element-plus'

export function showPrompt (message, inputValue = '', title = '') {
  return ElMessageBox.prompt(message, title, {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    /* input-value 输入框初始值  */
    'input-value': inputValue
  })
    .then(({ value }) => {
      ElMessage({
        type: 'success',
        message: `Your email is:${value}`
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Input canceled'
      })
    })
}
