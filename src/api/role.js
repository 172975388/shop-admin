import axios from '~/axios'

export function getRoleList (page) {
  return axios({
    url: `admin/role/${page}`,
    method: 'get'
  })
}

export function createRole (data) {
  return axios({
    url: `admin/role`,
    method: 'post',
    data
  })
}

export function deleteRole (id) {
  return axios({
    url: `/admin/role/${id}/delete`,
    method: 'POST'
  })
}

export function updateRole (id, data) {
  return axios({
    url: `admin/role/${id}`,
    method: 'POST',
    data
  })
}

export function updateRoleStatus (id, status) {
  return axios({
    url: `admin/role/${id}/update_status`,
    method: 'post',
    params: {
      status
    }
  })
}

export function setRoleRules (id, rule_ids) {
  return axios({
    url: 'admin/role/set_rules',
    method: 'POST',
    data: {
      id,
      rule_ids
    }
  })
}
