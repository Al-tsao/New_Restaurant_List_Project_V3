const mongoose = require('mongoose')
const Schema = mongoose.Schema
const todoSchema = new Schema({
  // id: { type: String },
  name: {
    type: String, // 資料型別是字串
    required: true // 這是個必填欄位
  },
  name_en: { type: String },
  category: { type: String },
  image: { type: String },
  location: { type: String },
  phone: { type: String },
  google_map: { type: String },
  rating: { type: String },
  description: { type: String }
})
module.exports = mongoose.model('rList', todoSchema)