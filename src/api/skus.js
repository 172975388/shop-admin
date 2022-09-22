import axios from '~/axios'

export function getSkusList (page) {
  return axios({
    url: `admin/skus/${page}`,
    method: 'get'
  })
}

export function createSkus (data) {
  return axios({
    url: `admin/skus`,
    method: 'post',
    data
  })
}

export function deleteSkus (ids) {
  ids = !Array.isArray(ids) ? [ids] : ids
  return axios({
    url: '/admin/skus/delete_all',
    method: 'POST',
    data: {
      ids
    }
  })
}

export function updateSkus (id, data) {
  return axios({
    url: `admin/skus/${id}`,
    method: 'POST',
    data
  })
}

export function updateSkusStatus (id, status) {
  return axios({
    url: `admin/skus/${id}/update_status`,
    method: 'post',
    params: {
      status
    }
  })
}

