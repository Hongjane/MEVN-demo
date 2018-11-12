var express = require('express')
var api = require('./api')
var fs = require('fs')
var path = require('path')
// var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
// var logger = require('morgan')

// var indexRouter = require('./routes/index');
// var mongoRouter = require('./routes/mongoRouter');

var app = express()

// app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
// app.use(cookieParser())
app.use(express.static(path.join(__dirname, '../dist')))

app.use(api)

// app.use('/', indexRouter)
// app.use('/users', usersRouter)

app.use('*', (req, res, next) => {
  var home = fs.readFileSync(path.resolve(__dirname + '../dist/index.html'), 'utf-8')
  res.send(home)
})

app.listen(3000)
console.log('Express listening at port 3000')

module.exports = app
