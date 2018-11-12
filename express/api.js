var model = require('./mongo')
var express = require('express')
var router = express.Router()

router.post('/api/login/create', (req, res, next) => {
  let info = new model.Login({
    username: req.body.username,
    age: req.body.age,
    gender: req.body.gender
  })

  info.save((err, data) => {
    if (err) {
      res.send(err)
    } else {
      console.log('Info successfully created: ' + Date())
      res.send('Info successfully created')
    }
  })
})

// Changing from GET method to POST method to retrieve data from server
router.post('/api/login/get', (req, res, next) => {
  model.Login.findOne({'username': req.body.username}, (err, data) => {
    // console.log('Hey there! ' + Date())
    // console.log(req.body.username)
    if (err) {
      console.log('Retrieving error: ' + Date())
      res.send(err)
    } else {
      console.log('Info successfully retrieved: ' + Date())
      console.log(data + ': ' + Date())
      res.send(data)
      // if (data !== null) {
      //   res.send(data)
      // } else {
      //   res.send('null')
      // }
    }
  })
})

router.get('/api/login/getAll', (req, res, next) => {
  model.Login.find((err, data) => {
    if (err) {
      console.log('Retrieving error: ' + Date())
      res.send(err)
    } else {
      console.log('Info successfully retrieved: ' + Date())
      console.log(data)
      res.send(data)
    }
  })
})

module.exports = router
