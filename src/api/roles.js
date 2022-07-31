import request from '@/utils/request'

/**
 * 获取角色列表
 * @returns
 */
export const getRolesList = () => {
  return request({
    url: 'roles'
  })
}

/**
 * 删除角色指定权限
 * @returns
 */
export const delRoleAuth = (roleId, rightId) => {
  return request({
    url: `roles/${roleId}/rights/${rightId}`,
    method: 'delete'
  })
}

/**
 * roleId  角色 ID
 * rids 权限 ID 列表（字符串） 以 , 分割的权限 ID 列表（获取所有被选中、叶子节点的 key 和半选中节点的 key, 包括 1，2，3 级节点）
 * @param {*} data
 * @returns
 */
export const updateRoleAuth = ({ roleId, rids }) => {
  return request({
    url: `roles/${roleId}/rights`,
    method: 'post',
    data: { rids }
  })
}
