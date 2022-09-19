import axios from '~/axios'

export function login (data) {
  return axios({
    url: '/admin/login',
    method: 'post',
    data
  })
}

export function getUserInfo () {
  return axios({
    url: '/admin/getinfo',
    method: 'post'
  })
}

export function logout () {
  return axios({
    url: '/admin/logout',
    method: 'post'
  })
}

export function updatePassword (data) {
  return axios({
    url: '/admin/updatepassword',
    method: 'post',
    data
  })
}

export function getManagerList (page, params) {
  return axios({
    url: `admin/manager/${page}`,
    method: 'get',
    params
  })
}

export function updateManagerStatus (id, status) {
  return axios({
    url: `admin/manager/${id}/update_status`,
    method: 'post',
    params: {
      status
    }
  })
}

export function createManager (data) {
  return axios({
    url: '/admin/manager',
    method: 'post',
    data
  })
}

export function updateManager (id, data) {
  return axios({
    url: `admin/manager/${id}`,
    method: 'post',
    data
  })
}

export function deleteManager (id) {
  return axios({
    url: `admin/manager/${id}/delete`,
    method: 'post'
  })
}
