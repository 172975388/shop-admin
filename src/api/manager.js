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
    method: 'post',
  })
}

export function logout () {
  return axios({
    url: '/admin/logout',
    method: 'post',
  })
}

export function updatePassword (data) {
  return axios({
    url: '/admin/updatepassword',
    method: 'post',
    data
  })
}