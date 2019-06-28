import axios from '@/utils/myaxios.js'

export const getGoodsAllList = (params) => {
  return axios({
    url: 'goods',
    params
  })
}

// 添加商品信息
export const addGoodsInfo = (data) => {
  return axios({
    method: 'post',
    url: 'goods',
    data
  })
}

// 根据 ID 查询商品
export const getGoodsById = (id) => {
  return axios({
    url: `goods/${id}`
  })
}
