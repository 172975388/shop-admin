import axios from '~/axios'

export function getImageClassList (page, limit = 10) {
  return axios({
    method: 'get',
    url: `admin/image_class/${page}`,
    params: {
      limit
    }
  })
}

export function createImageClass (data) {
  return axios({
    method: 'POST',
    url: 'admin/image_class',
    data
  })
}

export function updateImageClass (id, data) {
  return axios({
    method: 'POST',
    url: `admin/image_class/${id}`,
    data
  })
}

export function deleteImageClass (id) {
  return axios({
    method: 'POST',
    url: `admin/image_class/${id}/delete`
  })
}
