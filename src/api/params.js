import request from '@/utils/request'

/**
 * 获取参数列表
 * id 分类 ID
 * sel 不能为空,通过 only 或 many 来获取分类静态参数还是动态参数
 * @param {*} param0
 * @returns
 */
export const getParamsList = ({ id, sel }) => {
  return request({
    url: `categories/${id}/attributes`,
    params: { sel }
  })
}

/**
 * 添加动态参数和静态属性
 * @param {*} data
 * @returns
 */
export const addManyAndOnlyAttr = (data) => {
  return request({
    url: `categories/${data.id}/attributes`,
    method: 'post',
    data
  })
}

/**
 * 删除动态参数和静态属性
 * @param {*} id
 * @param {*} attrid
 * @returns
 */
export const delManyAndOnlyAttr = (id, attrid) => {
  return request({
    url: `categories/${id}/attributes/${attrid}`,
    method: 'delete'
  })
}

/**
 * 编辑动态参数和静态属性
 * @param {*} data
 * @returns
 */
export const editManyAndOnlyAttr = (data) => {
  return request({
    url: `categories/${data.id}/attributes/${data.attrId}`,
    method: 'put',
    data
  })
}
