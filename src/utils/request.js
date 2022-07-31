import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
const request = axios.create({
  baseURL: 'http://liufusong.top:8899/api/private/v1/',
  timeout: 5000
})

// 添加请求拦截器
request.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 判断是否有token,有添加头信息
  const token = store.getters.token
  if (token) {
    config.headers.Authorization = token
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
request.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  // 因为响应数据状态码也有201
  const { meta, data } = response.data
  if (meta.status === 200 || meta.status === 201) {
    return data
  } else {
    Message.error(meta.msg)
    return Promise.reject(new Error(meta.msg))
  }
  // console.log(meta.status)
  // if (meta.status !== 200 || meta.status !== 201) {
  //   // 登录失败
  //   Message.error(meta.msg)
  //   return Promise.reject(new Error(meta.msg))
  // }
  // return data
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  return Promise.reject(error)
})
export default request
