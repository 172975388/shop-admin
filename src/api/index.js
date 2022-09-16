import axios from '~/axios'

/**
 * 上方4个面板
 */
export function getStatistics1 () {
  return axios({
    url: 'admin/statistics1',
    method: 'get'
  })
}

/**
 * 图表
 */
export function getStatistics3 (type) {
  return axios({
    url: 'admin/statistics3',
    method: 'get',
    params: { type }
  })
}

/**
 * 右下方两个面板
 */
export function getStatistics2 () {
  return axios({
    url: 'admin/statistics2',
    method: 'get'
  })
}
