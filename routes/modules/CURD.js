// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
// 載入 restaurantList.js
const listGenerated = require('../../models/restaurantList.js')

// ===========準備引入路由模組===========
// 進入read頁面
router.get('/read/:id', (req, res) => {
  const id = req.params.id
  listGenerated.findById(id)
    .lean()
    .then(rList => {
      res.render('read', { restaurant: rList })
    }) // 將資料傳給 index 樣板
    .catch(error => console.error(error)) // 錯誤處理)
})
//搜尋餐廳並將結果列表顯示 
router.get('/search', (req, res) => {
  const keyword = req.query.keyword
  listGenerated.find()
    .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .then(rList /* rList是清理過後的陣列 */ => {
      const restaurants = rList.filter(restaurant => {
        return restaurant.name.toLowerCase().includes(keyword.toLowerCase()) || restaurant.category.toLowerCase().includes(keyword.toLowerCase())
      })
      res.render('index', { restaurants: restaurants, keyword: keyword })
    }) // 將資料傳給 index 樣板
    .catch(error => console.error(error)) // 錯誤處理
})
// 進入create頁面
router.get('/create', (req, res) => {
  res.render('create')
})
// 送出create頁面資料到MongoDB(新增資料)
router.post('/create/new', (req, res) => {
  const newRestaurenat = req.body       // 從 req.body 拿出表單裡的 name 資料
  return listGenerated.create(newRestaurenat)     // 存入資料庫，create(這裡面的格式要是物件)
    .then(() => res.redirect('/')) // 新增完成後導回首頁
    .catch(error => console.log(error))
})
// 刪除餐廳資料
router.get('/delete/:id', (req, res) => {
  const id = req.params.id
  listGenerated.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})
// 進入update頁面
router.get('/update/:id', (req, res) => {
  const id = req.params.id
  return listGenerated.findById(id)
    .lean()
    .then(restaurant => {
      res.render('update', { restaurant: restaurant })
    })
    .catch(error => console.log(error))
})
// 送出update頁面資料到MongoDB(修改資料)
router.post('/update/confirm/:id', (req, res) => {
  //取得restaurant_id
  const id = req.params.id
  const options = req.body
  return listGenerated.findById(id)
    .then((restaurant) => {
      //對應資料，寫入資料庫
      restaurant = Object.assign(restaurant, options)
      return restaurant.save()
    })
    .then(() => res.redirect(`/update/${id}`))
    .catch((error) => console.log(error))
})
// ===========路由模組結束===========

// 匯出路由模組
module.exports = router