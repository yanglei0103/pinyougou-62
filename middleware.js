const config = require('./config')
//自定义中间件
exports.global = (req, res, next) => {
  //每个网页需要的数据  要处理的业务
  res.locals.site = config.site
  next()
}