//操作分类相关的数据
const axios = require('./api')

//获取树状的分类数据
exports.getCategoryTree = () => {
  return axios.get('categories?format=tree')
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}

//获取当前分类的 上级分类 上上级分类
exports.getCategoryParent = (cateId) => {
  return axios.get(`categories/${cateId}?include=parent`)
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}