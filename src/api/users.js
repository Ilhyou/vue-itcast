import axios from 'axios'

// 设置基准路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 添加登录验证方法
// 在vue中 暴露成员使用export
export const userLogin = (data) => {
  // 我们不希望通过回调的方式在这边进行操作之后方法调用 因为post请求返回一个promise，所以可以以后在方法调用的时候进行then 和 catch
  return axios({
    url: 'login',
    method: 'post',
    data: data
  })
}
