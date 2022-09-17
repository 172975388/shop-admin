import axios from '~/axios'

export function getImageList (id, page = 1, params = { limit: 10 }) {
  return axios({
    method: 'get',
    url: `admin/image_class/${id}/image/${page}`,
    // limit，非必填，默认10 每页显示条数
    params
  })
}

export function renameImage (id, name) {
  return axios({
    method: 'post',
    url: `admin/image/${id}`,
    data: {
      name
    }
  })
}

export function deleteImage (id) {
  return axios({
    method: 'post',
    url: `admin/image/delete_all`,
    data: {
      ids: [id]
    }
  })
}

export function uploadImage (data) {
  /**
   * 上传文件，不需要修改headers: { 'Content-Type': 'multipart/form-data' }  axios自动完成
   * 把所有body数据，放入formData中。
   * const formData = new FormData()
   * formData.append(k, v)
   */
  return axios({
    method: 'post',
    url: 'admin/image/upload',
    data
    // 
  })
}
