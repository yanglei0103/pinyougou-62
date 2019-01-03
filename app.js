//程序核心文件
const express = require('express')
const createError = require('http-errors')
const Youch = require('youch')
const artTemplate = require('express-art-template')
const path = require('path')
const bodyParser = require('body-parser')
const favicon = require('express-favicon')
const logger = require('morgan')

const router = require('./router')
const middleware = require('./middleware')

//创建应用
const app = express()
app.listen(3000, () => console.log('=== server started ==='))

//中间件
//配置日志信息 morgan
app.use(logger('dev'))
//模版引擎
app.engine('art', artTemplate)
//设置默认渲染引擎
app.set('view engine', 'art')
//模版引擎的配置项
app.set('view options', {
  debug: process.env.NODE_ENV !== 'production'
  //判断当前运行环境  如果是开发环境不压缩不缓存
})
//静态资源
app.use('/', express.static(path.join(__dirname, './public')))
//请求体解析  body-parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false})) //设置对象格式的请求体内容
//网站小图标中间件 响应图标 express-favicon
app.use(favicon(path.join(__dirname, 'favicon.ico')))

//自定义中间件
app.use(middleware.global)

//设置路由
app.use(router)

//404情况 上面的路由没有去处理用户的请求
app.use((req, res, next) => {
  //创建一个404错误对象
  // const error = new Error('Not Found')
  // error.status = 404
  //创建错误对象 使用第三方的包  http-errors
  next(createError(404, 'Not Found'))
})
//500情况 服务器出错了
app.use((err, req, res, next) => {
  //统一错误处理中间件
  //1. 如果是开发环境  尽量响应完整的错误信息给客户端
  //2. 如果是生产环境  404 500 页面
  //3. 判断现在是什么环境  通过系统环境变量去判断
  //4. 怎么获取 req.app.get('env') 获取设置的NODEJS相关的环境变量信息
  //5. SET NODE_ENV='development'  命令
  //6. SET NODE_ENV='production'   命令
  //7. 注意：不同的系统设置环境变量的命令是不一样
  //8. 使用 cross-env 命令行工具  npm i cross-env -g
  //9. cross-env NODE_ENV='development'
  //10.  启动的时候  启动开发环境  启动生产环境
  //console.log(req.app.get('env'))
  const env = req.app.get('env')
  if (env === 'development') {
    //开发  错误更详细  使用 第三方错误输出页面 youch
    return new Youch(err, req).toHTML().then(html => res.send(html))
  }
  //生产  渲染页面  art-template express-art-template
  //locals 模版引擎中可以直接使用的数据（locals对象下数据）
  res.locals.status = err.status === 404 ? 404 : 500
  res.render('error')
})
