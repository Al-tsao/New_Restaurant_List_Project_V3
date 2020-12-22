// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
// 載入 restaurantList.js
const listGenerated = require('../../models/restaurantList.js')

// ===========準備引入路由模組===========
// 排序頁面
router.get('/sort/:sortBy/:sortOrder', (req, res) => {
  const sortBy = req.params.sortBy
  const sortOrder = req.params.sortOrder
  var sortByName = ""
  if (sortBy === "name" && sortOrder === "asc") {
    sortByName = "A → Z"
  } else if (sortBy === "name" && sortOrder === "desc") {
    sortByName = "Z → A"
  } else if (sortBy === "category") {
    sortByName = "類別"
  } else if (sortBy === "location") {
    sortByName = "地區"
  }
  listGenerated.find()
    .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .sort({ [sortBy]: sortOrder })
    .then(rList /* rList是清理過後的陣列 */ => {
      res.render('index', { restaurants: rList, sortByName: sortByName })
    }) // 將資料傳給 index 樣板
    .catch(error => console.error(error)) // 錯誤處理
})
// ===========路由模組結束===========

// 匯出路由模組
module.exports = router