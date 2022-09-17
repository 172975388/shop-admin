import axios from '~/axios'

export function getNoticeList (page) {
  return axios({
    url: `admin/notice/${page}`,
    method: 'get',
  })
}

export function createNotice ({title, content}) {
  return axios({
    url: `admin/notice`,
    method: 'post',
    // 直接写一个data，导致看接口函数不知道要传啥。不如全部定义，虽然麻烦
    data: {
      title,
      content
    }
  })
}

export function deleteNotice (id) {
  return axios({
    url: `/admin/notice/${id}/delete`,
    method: 'POST',
  })
}

export function updateNotice (id, {title, content}) {
  return axios({
    url: `admin/notice/${id}`,
    method: 'POST',
    data: {
      title,
      content
    }
  })
}