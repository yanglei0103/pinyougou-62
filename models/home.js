//获取另外一台服务器的数据
//使用 axios 进行数据的提交和获取  可以在服务端使用
//怎么使用
//1. 配置一些公用的请求信息  基础URL 超时时间  认证信息 auth 创建实力 axios 对象
const axios = require('./api')

exports.getSlider = () => {
  // return axios.get('settings/home_slides').then(res => {
  //   return res.data  //传递给下个promise对象的then
  // }).catch(err => {
  //   return Promise.reject(err) //传递错误信息给下个promise对象的catch
  // })

  return axios.get('settings/home_slides')
    .then(res => res.data)
    .catch(err => Promise.reject(err))
}


