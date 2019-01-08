//购物车相关的业务
//注意：购物车的操作分两种情况  1.已登录  2. 未登录
//1.已登录 去操作当前用户的购物车信息
//2.未登录 去操作的是客户端的cookie
//以上操作需要session   约定好登录后的用户信息存储的key  req.session.user = {}
const config = require('../config')
const productModel = require('../models/product')
//添加购物车
exports.add = (req, res, next) => {
  const id = req.query.id
  const amount = +req.query.amount || 1
  //添加购物车的业务逻辑
  if (req.session.user) {
    //TODO 已登录状态的加入购物车 待实现
  } else {
    //未登录状态  数据存储在客户端  cookie
    //cookie中间件  cookie-parser  处理cookie数据
    //cookie 可以在客户端存储信息  是以 key 和 value 和 有效期 来存储的
    // ‘name=xpp;Expires=有效期’ 这样的数据不好操作
    //value 只能存字符串数据 如果想存复杂数据格式可以使用json格式的字符串
    //在 req res 对象中拥有  一些操作cookie的api
    // req.cookies 获取客户端所有的cookie信息的方式  req.cookies[‘cookieKey’]
    // res.cookie(key,value,expires) 设置cookie
    //存储的数据格式  数组  [{id:'',amount:''},[id:'',amount:'']]
    /*存储数据的key   'pyg_cart_key'*/

    /*1. 获取现在的购物车信息*/
    const cookieStr = req.cookies[config.cookie.cart_key] || '[]'
    /*2. 转换成数组*/
    const cartList = JSON.parse(cookieStr)
    /*3. 给这个数组 修改 或 添加数据*/
    /*如果添加的  是和之前相同的商品  修改数量*/
    /*如果添加的  是和之前不同的商品  不同*/
    const cart = cartList.find(item => item.id == id)
    if (cart) {
      //有相同 修改数量
      cart.amount += amount
    } else {
      //不同 不同
      cartList.push({id, amount})
    }
    /*4. 修改好的购物车数据  需要重新存储一些  更新一下*/
    const expires = new Date(Date.now() + config.cookie.cart_expires)
    res.cookie(config.cookie.cart_key, JSON.stringify(cartList), {expires})

    /*5. 获取商品基本信息  ｛id,name,thumbnail,提交时候的数量 amount｝*/
    productModel.getProduct(id, true)
      .then(data => {
        //data 确实的商品的数据  但是不符合页面的需要
        res.locals.cartInfo = {
          id: data.id,
          name: data.name,
          thumbnail: data.thumbnail,
          amount
        }
        res.render('cart-add')
      })
  }
}

//跳转购物车页面
exports.index = (req, res, next) => {
  res.render('cart')
}
//查询购物车
exports.find = (req, res, next) => {
  //返回json数据
  /*1. 获取cookie 里面的购物车信息*/
  const cookieStr = req.cookies[config.cookie.cart_key] || '[]'
  const cartList = JSON.parse(cookieStr)
  /*2. 列表中的数据不够完整*/
  /*3. 根据每一个商品的ID去获取数据  基本的商品数据即可*/
  /*4. 有几个商品就生成几个 promise 对象  组织成一个数组*/
  const promiseArr = cartList.map(item => productModel.getProduct(item.id, true))
  /*5. Promise.all 并行执行*/
  Promise.all(promiseArr).then(results => {
    //results 购物车商品的数据的数组
    //results 数据没有表示出自己的购物车有几件商品
    const list = results.map((item, i) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      thumbnail: item.thumbnail,
      amount: cartList[i].amount
    }))
    res.json(list)
  }).catch(err => {
    res.json([])
  })
}

//修改购物车
exports.edit = (req, res, next) => {}

//删除购物车
exports.remove = (req, res, next) => {}