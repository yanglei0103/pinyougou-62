const productModel = require('../models/product')
const categoryModel = require('../models/category')
const pagination = require('../utils/pagination')
//产品相关的路由中间件
exports.list = (req, res, next) => {
  //restful 获取的参数
  const cateId = req.params.id
  //获取get传参
  const page = req.query.page || 1
  const size = req.query.size || 5
  const sort = req.query.sort || 'commend'
  // productModel.getCateProducts(cateId, page, size, sort)
  //   .then(data => {
  //     //data = {list:[],total:8}  list是列表数据 total是总页数
  //     res.locals.list = data.list
  //     res.locals.total = data.total
  //     //1. 渲染列表
  //     //2. 渲染 路径 导航  分类 上一级分类  上上级分类
  //     //合适么？
  //     //3. 渲染排序
  //     //4. 渲染分页
  //     res.render('list')
  //   }).catch(err => next(err))

  Promise.all([
    productModel.getCateProducts(cateId, page, size, sort),
    categoryModel.getCategoryParent(cateId)
  ]).then(results => {
    //处理一下
    //1. 渲染列表
    //2. 渲染 路径 导航  分类 上一级分类  上上级分类
    //3. 渲染排序   -price升序 默认  price降序
    //4. 渲染分页
    res.locals.list = results[0].list   //列表数据
    //res.locals.total = results[0].total  //总页数
    res.locals.cate = results[1]        //分类 路径导航
    res.locals.sort = sort              //当前排序方式
    //pagination格式是HTML格式的字符串
    //模版输出的默认是转义过后的字符串  不会输出HTML格式  < &lt;  > &gt;
    //如果你想输出HTML格式的字符串让浏览器去解析 {{@变量名称}} {{#变量名称}}
    res.locals.pagination = pagination({page,total:results[0].total,req})
    res.render('list')
  }).catch(err => next(err))
}