import axios from '~/axios'

export function getRuleList () {
  return axios({
    url: '/admin/rule/1',
    method: 'get'
  })
}

export function createRule (data) {
  return axios({
    url: 'admin/rule',
    method: 'post',
    // 直接写一个data，导致看接口函数不知道要传啥。不如全部定义，虽然麻烦
    data
  })
}

export function updateRule (id, data) {
  return axios({
    url: `admin/rule/${id}`,
    method: 'POST',
    data
  })
}

// 按钮控制
export function updateRuleStatus (id, status) {
  return axios({
    url: `admin/rule/${id}/update_status`,
    method: 'POST',
    data: {
      status
    }
  })
}

export function deleteRule (id) {
  return axios({
    url: `/admin/rule/${id}/delete`,
    method: 'POST',
  })
}
