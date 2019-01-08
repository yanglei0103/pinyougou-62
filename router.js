//集合所有的路由  具体路由业务在controllers
const express = require('express')
const router = express.Router()
const home = require('./controllers/home')
const account = require('./controllers/account')
const product = require('./controllers/product')
const cart = require('./controllers/cart')

/*-------------------和首页相关的路由----------------------*/
router.get('/', home.index) //渲染首页
router.get('/like', home.like) //返回json猜你喜欢
/*-------------------和商品相关的路由----------------------*/
// RESTful 规则   /list/7  ===> req.params.id
// get方式   /list?id=7  ===> req.query.id
router.get('/list/:id', product.list) //渲染分类下的商品列表
router.get('/search', product.search) //渲染s搜索时的商品列表
router.get('/item/:id', product.item)
/*---------------------购物车相关的路由-------------------*/

router.get('/cart',cart.index)
router.get('/cart/find',cart.find)  //json
router.get('/cart/add',cart.add)
router.post('/cart/edit',cart.edit) //json
router.post('/cart/remove',cart.remove) //json

router.get('/login', account.login)

//exports 不能导出单个内容
module.exports = router