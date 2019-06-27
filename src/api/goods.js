import axios from '@/utils/myaxios.js'

export const getGoodsAllList = (params) => {
  return axios({
    url: 'goods',
    params
  })
}
