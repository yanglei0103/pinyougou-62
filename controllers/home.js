//首页相关业务逻辑
const homeModel = require('../models/home')
const productModel = require('../models/product')

exports.index = (req, res, next) => {
  //渲染轮播图
  // homeModel.getSlider().then(data => {
  //   res.locals.slider = data
  //   res.render('home')
  // }).catch(err => next(err))

  //渲染猜你喜欢
  // productModel.getLikeProducts().then(data=>{
  //   return res.json(data)
  // }).catch(err=>{
  //   return next(err)
  // })

  //渲染轮播图   获取数据
  //渲染猜你喜欢  获取数据
  // 两个 Promise 对象同时执行且  监听到最慢的那个执行完成 获取所有的结果
  // Promise.all([Promise对象,Promise对象]) 并且执行多个Promise最慢的结束执行then()
  // Promise.race() 并且执行多个Promise最快的结束执行then()
  Promise.all([homeModel.getSlider(), productModel.getLikeProducts()])
    .then(results => {
      //results 是一个数组 数组内的数据顺序和传入的Promise对象的顺序一样的
      //res.json(results)
      res.locals.slider = results[0]
      res.locals.like = results[1]
      res.render('home')
    }).catch(err => next(err))
}

exports.like = (req, res, next) => {
  productModel.getLikeProducts().then(data => res.json(data)).catch(err => next(err))
}
