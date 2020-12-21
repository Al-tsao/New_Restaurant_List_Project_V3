// require packages used in the project
const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser') //讓express可以用POST
const mongoose = require('mongoose') // 載入 mongoose
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB
const listGenerated = require('./models/restaurantList.js') // 載入 restaurantList.js

// require express-handlebars here
const exphbs = require('express-handlebars')

// 載入同層的JS檔
// const gTrashTalk = require('./generate_trashTalk.js')

// 引入Jason檔案
// const restaurantList = require('./restaurant.json')

// 為了要使用register helper而引入
const handlebars = require('handlebars')

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting static files 設定 Express 路由以提供靜態檔案(就是讓CSS或者是JS可以使用)
app.use(express.static('public'))

// setting body-parser
app.use(bodyParser.urlencoded({ extended: true }))

// register helper
handlebars.registerHelper('ifEqual', function (job, targetJob, options) {
  if (job === targetJob) {
    return options.fn(this)
  }
  return options.inverse(this)
})

// mongoDB資料連線
// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

// =========== routes setting Start ===========
// 進入index頁面
app.get('/', (req, res) => {
  listGenerated.find()
    .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .then(rList /* rList是清理過後的陣列 */ => {
      res.render('index', { restaurants: rList })
    }) // 將資料傳給 index 樣板
    .catch(error => console.error(error)) // 錯誤處理
})
// 進入read頁面
app.get('/read/:id', (req, res) => {
  const id = req.params.id
  listGenerated.findById(id)
    .lean()
    .then(rList => {
      res.render('read', { restaurant: rList })
    }) // 將資料傳給 index 樣板
    .catch(error => console.error(error)) // 錯誤處理)
})
//搜尋餐廳並將結果列表顯示 
app.get('/search', (req, res) => {
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
app.get('/create', (req, res) => {
  res.render('create')
})
// 送出create頁面資料到MongoDB(新增資料)
app.post('/create/new', (req, res) => {
  const newRestaurenat = req.body       // 從 req.body 拿出表單裡的 name 資料
  return listGenerated.create(newRestaurenat)     // 存入資料庫，create(這裡面的格式要是物件)
    .then(() => res.redirect('/')) // 新增完成後導回首頁
    .catch(error => console.log(error))
})
// 刪除餐廳資料
app.get('/delete/:id', (req, res) => {
  const id = req.params.id
  listGenerated.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})
// 進入update頁面
app.get('/update/:id', (req, res) => {
  const id = req.params.id
  return listGenerated.findById(id)
    .lean()
    .then(restaurant => {
      res.render('update', { restaurant: restaurant })
    })
    .catch(error => console.log(error))
})
// 送出update頁面資料到MongoDB(修改資料)
app.post('/update/confirm/:id', (req, res) => {
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
// =========== routes setting End ===========

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})