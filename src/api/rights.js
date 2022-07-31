import request from '@/utils/request'

/**
 * 获取左侧权限接口
 * @returns
 */
export const getLeftRoles = () => {
  return request({
    url: 'menus'
  })
}

/**
 * 所有权限列表
 * @param {值 list 或 tree , list 列表显示权限, tree 树状显示权限,参数是url参数:type} type
 * @returns
 */
export const getAllAuth = (type) => {
  return request({
    url: `rights/${type}`
  })
}
