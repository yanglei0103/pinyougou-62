//产品相关操作  跟数据相关的
const axios = require('./api')

exports.getLikeProducts = () => {
  //then方法内的return返回的一定是一个 promise 对象
  //当你去调用这个promise对象的then的时候 其实获取的数据 你之前return的
  //catch方法的return的不是一个错误reject函数  then的时候获取到的是err信息
  //Promise.reject(err) 才是错误的回调
  return axios.get('products?type=like&limit=6').then(res => res.data).catch(err => Promise.reject(err))
}

/**
 * 返回获取产品数据的Promise对象
 * @param cateId  分类ID
 * @param page  当前页码
 * @param size  一页多少条  默认10条
 * @param sort  排序的方式  commend / quantity / market_time / price / -price（可选）
 */
exports.getCateProducts = (cateId, page, size, sort) => {
  const url = `categories/${cateId}/products?page=${page}&per_page=${size}&sort=${sort}`
  return axios.get(url)
    .then(res=>({list:res.data,total:res.headers['x-total-pages']}))
    .catch(err=>Promise.reject(err))
}