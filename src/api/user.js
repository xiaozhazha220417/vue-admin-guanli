// 用户相关信息
import request from '@/utils/request'

/**
 * 登录验证接口
 * @param {*} data
 * @returns
 */
export const login = (data) => {
  return request({
    method: 'post',
    url: 'login',
    data
  })
}

/**
 * 获取用户列表数据
 * @param {*} param0
 * @returns
 */
export const getUserList = ({ query, pagenum, pagesize }) => {
  return request({
    url: 'users',
    params: { query, pagenum, pagesize }
  })
}

/**
 * 删除用户
 * @param {*} id
 * @returns
 */
export const delUser = (id) => {
  return request({
    url: `users/${id}`,
    method: 'delete'
  })
}

/**
 * 添加用户
 * @param {*} id
 * @returns
 */
export const addUser = (data) => {
  return request({
    url: 'users',
    method: 'post',
    data
  })
}

/**
 * 修改用户状态
 * @param {用户id} uid
 * @param {用户状态} type
 * @returns
 */
export const updateUserStatus = (uid, type) => {
  return request({
    url: `users/${uid}/state/${type}`,
    method: 'put'
  })
}

/**
 * 根据用户id查询用户信息
 * @param {用户id} id
 * @returns
 */
export const getUserId = (id) => {
  return request({
    url: `users/${id}`
  })
}

/**
 * 修改用户信息
 * @param {用户id} id
 * @returns
 */
export const updateUserInfo = (data) => {
  return request({
    url: `users/${data.id}`,
    method: 'put',
    data
  })
}
/**
 * 修改用户角色
 * @param {*} data
 * @returns
 */
export const updateUserRole = (data) => {
  return request({
    url: `users/${data.id}/role`,
    method: 'put',
    data
  })
}
