// import axios from 'axios'

// // 设置基准路径
// axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// // 添加请求拦截器
// axios.interceptors.request.use(function (config) {
//   // 在发送请求之前做些什么
//   // 获取可能有的token数据，进行请求头的设置，格式Authorization:token
//   var token = localStorage.getItem('itcast_manager')
//   // console.log(config)
//   if (token) {
//     config.headers['Authorization'] = token
//   }

//   return config
// }, function (error) {
//   // 对请求错误做些什么
//   return Promise.reject(error)
// })

import axios from '@/utils/myaxios.js'

// 获取角色列表
export const getAllRoles = () => {
  return axios({
    url: `roles`
  })
}

// 删除角色权限根据角色id
/**
 *
 * @param {string} roleId 角色id
 * @param {string} rightId  权限id
 */
export const removeRightByRid = (roleId, rightId) => {
  return axios({
    method: 'delete',
    url: `roles/${roleId}/rights/${rightId}`
  })
}

// 添加角色
export const addRole = (data) => {
  return axios({
    method: 'post',
    url: 'roles',
    data
  })
}

// 编辑角色
export const editRole = (data) => {
  return axios({
    method: 'put',
    url: `roles/${data.id}`,
    data
  })
}

// 删除角色
export const delRole = (id) => {
  return axios({
    method: 'delete',
    url: `roles/${id}`
  })
}

// 授权角色提交
export const rightRole = (id, rids) => {
  return axios({
    method: 'post',
    url: `roles/${id}/rights`,
    data: {
      rids
    }
  })
}
