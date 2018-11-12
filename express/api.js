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
      console.log('Info successfully created')
      res.send('Info successfully created')
    }
  })
})

router.get('/api/login/get', (req, res, next) => {
  model.Login.findOne({'username': 'Jack'}, (err, data) => {
    if (err) {
      console.log('Retrieving error')
      res.send(err)
    } else {
      console.log('Info successfully retrieved')
      console.log(data)
      res.send(data)
    }
  })
})

router.get('/api/login/getAll', (req, res, next) => {
  model.Login.find((err, data) => {
    if (err) {
      console.log('Retrieving error')
      res.send(err)
    } else {
      console.log('Info successfully retrieved')
      console.log(data)
      res.send(data)
    }
  })
})

module.exports = router
