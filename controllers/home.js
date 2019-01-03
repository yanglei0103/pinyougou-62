//首页相关业务逻辑
const homeModel = require('../models/home')

exports.index = (req, res, next) => {
  //渲染轮播图
  homeModel.getSlider().then(data => {
    res.locals.slider = data
    res.render('home')
  }).catch(err => next(err))
}
