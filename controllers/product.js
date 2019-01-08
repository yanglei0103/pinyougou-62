const productModel = require('../models/product')
const categoryModel = require('../models/category')
const pagination = require('../utils/pagination')
const qs = require('querystring')
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
    res.locals.pagination = pagination({page, total: results[0].total, req})
    res.render('list')
  }).catch(err => next(err))
}

/*搜索列表页面*/
exports.search = (req, res, next) => {
  const q = req.query.q
  const sort = req.query.sort || 'commend'
  const page = req.query.page || 1
  const size = req.query.size || 5

  /*转URL编码 解析URL编码*/
  //console.log(qs.escape(q))
  //console.log(qs.unescape(qs.escape(q)))
  //encodeURIComponent('电脑')
  //decodeURIComponent("%E7%94%B5%E8%84%91")

  productModel.getSearchProducts(qs.escape(q), page, size, sort)
    .then(data => {
      //1. 渲染列表  某个关键字下的商品
      res.locals.list = data.list
      //2. 渲染排序的按钮
      res.locals.sort = sort
      //3. 搜索商品列表 是没有分类信息 而是要显示搜索的关键字
      //3.1 在地址栏传参的时候需要使用URL编码
      //3.2 使用中文的时候和使用特殊字符串的时候回出现问题
      //3.3 内置模块 querystring
      res.locals.q = q
      //4. 渲染分页
      res.locals.pagination = pagination({page, total: data.total, req})
      res.render('list')
    }).catch(err => next(err))
}

/*商品详情页面*/
exports.item = (req, res, next) => {
  req.session.abc = 123

  const id = req.params.id
  //1. 商品分类数据
  //2. 商品基本信息
  //3. 商品图片信息
  //4. 商品简介信息
  //5. 随机商品列表信息
  Promise.all([
    productModel.getProduct(id,false),
    productModel.getLikeProducts()
  ]).then(results => {
    res.locals.detail = results[0]
    res.locals.likes = results[1]
    res.render('item')
  }).catch(err => next(err))
}