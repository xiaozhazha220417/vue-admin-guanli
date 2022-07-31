import request from '@/utils/request'

/**
 * 商品列表数据
 * query 查询参数
 * pagenum 当前页码
 * pagesize  每页显示条数
 * @param {*} params
 * @returns
 */
export const getGoodsList = (params) => {
  return request({
    url: 'goods',
    params
  })
}

/**
 * 获取商品分类数据列表
 * type  值：1，2，3 分别表示显示一层二层三层分类列表【可选参数】如果不传递，则默认获取所有级别的分类
 * pagenum 当前页码值
 * pagesize 每页显示多少条数据
 * @param {*} param0
 * @returns
 */
export const getGoodsClassList = (params) => {
  return request({
    url: 'categories',
    params
  })
}

/**
 * 添加分类
 * @param {*} data
 * @returns
 */
export const addGoodsType = (data) => {
  return request({
    url: 'categories',
    method: 'post',
    data
  })
}

/**
 * 删除分类
 * @param {*} data
 * @returns
 */
export const delGoodsType = (id) => {
  return request({
    url: `categories/${id}`,
    method: 'delete'
  })
}
/**
 * 添加商品
 * @param {*} data
 * @returns
 */
export const addGoods = (data) => {
  return request({
    url: 'goods',
    method: 'post',
    data
  })
}
