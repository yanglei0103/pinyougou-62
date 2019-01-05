const config = require('./config')
const categoryModel = require('./models/category')
//自定义中间件
exports.global = (req, res, next) => {
  //每个网页需要的数据  要处理的业务
  //网站的头部信息
  res.locals.site = config.site
  //获取分类信息
  //如果没有缓存数据  就去请求接口服务器
  if(!req.app.locals.category){
    categoryModel.getCategoryTree().then(data => {
      //res 响应对象 locals 值提供给页面使用
      res.locals.category = data
      //req.app 是应用对象  也有 locals 用来存储数据
      //缓存数据
      req.app.locals.category = data
      next()
    }).catch(err => next(err))
  }
  //如果有缓存数据 直接走缓存即可
  else {
    res.locals.category = req.app.locals.category
    next()
  }
}