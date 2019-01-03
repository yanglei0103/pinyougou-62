//集合所有的路由  具体路由业务在controllers
const express = require('express')
const router = express.Router()
const home = require('./controllers/home')
const account = require('./controllers/account')



router.get('/', home.index)



router.get('/login', account.login)





//exports 不能导出单个内容
module.exports = router