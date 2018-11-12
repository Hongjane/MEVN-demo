var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true })

var mongodb = mongoose.connection
mongodb.once('error', () => {
  console.log('Connection error!')
})
mongodb.once('open', () => {
  console.log('Connection established...')
})

// schema
var loginSchema = mongoose.Schema({
  username: String,
  age: String,
  gender: String
})

// model
var loginModel = {
  Login: mongoose.model('table1', loginSchema)
}

module.exports = loginModel
