### 回顾第二天的内容

##### 错误处理
1. 处理404这种请求
- 定义了一个全局的路由中间件在 其他的中间件和路由的后面
- 前面有处理用户的请求的中间件  说明是没找到 404
- 创建了一个404错误对象  扔给了下一错误统一处理中间件
2. 错误统一处理中间件
- 如果是开发环境  输出了一个错误信息比较完整的页面  youch 包
- 如果是生成环境  渲染 404 500 页面  友好一些

##### 判断现在的运行环境

1. 通过环境变量去判断  临时环境变量
2. 设置环境变量：
- windows --> set NODE_ENV=production|development
- 其他的系统不是这个样的命令
- 使用了一个命令行工具  cross-env
3. 在package.json 文件中配置  scripts
4. 内容
```json
    {
      "scripts":{
        "dev":"cross-env NODE_ENV=development nodemon app.js",
        "start":"cross-env NODE_ENV=production node app.js"
      }
    }
```
5. 获取临时的环境变量
```javascript
    var env = req.app.get('env') 
    var env = process.env.NOde_ENV
```

##### 配置模版引擎
```javascript
//模版引擎
app.engine('art', artTemplate)
//设置默认渲染引擎
app.set('view engine', 'art')
//模版引擎的配置项
app.set('view options', {
  debug: process.env.NODE_ENV !== 'production'
  //判断当前运行环境  如果是开发环境不压缩不缓存
})
```

##### 其他的中间件配置

1. 静态资源  express.static
2. 网站小图标 favicon
3. 输出日志  morgan 
4. 请求体解析 body-parser


##### 一个请求到页面响应的流程
1. 请求走到中间件
2. 走到自定义的中间件
3. 走到自己的路由中间件
4. 走到控制器
5. 走到数据模型层
6. 去请求接口服务器
7. 返回数据 -> 控制器 
8. 把数据设置到 res 对象中的 locals
9. 渲染页面 使用 locals 中的数据
10 响应渲染好的页面给浏览器 