// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
// 載入 restaurantList.js
const listGenerated = require('../../models/restaurantList.js')
// 進入index頁面
router.get('/', (req, res) => {
  listGenerated.find()
    .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .then(rList /* rList是清理過後的陣列 */ => {
      res.render('index', { restaurants: rList })
    }) // 將資料傳給 index 樣板
    .catch(error => console.error(error)) // 錯誤處理
})
// 匯出路由模組
module.exports = router