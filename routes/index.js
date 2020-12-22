// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

// ===========準備引入路由模組===========
// 引入 home 模組程式碼
const home = require('./modules/home')
// 將網址結構符合 / 字串的 request 導向 home 模組 
router.use('/', home)
// 引入 CURD 模組程式碼
const CURD = require('./modules/CURD')
// 將網址結構符合 / 字串的 request 導向 home 模組 
router.use('/', CURD)
const sort = require('./modules/sort')
// 將網址結構符合 / 字串的 request 導向 home 模組 
router.use('/', sort)
// ===========路由模組結束===========


// 匯出路由器
module.exports = router