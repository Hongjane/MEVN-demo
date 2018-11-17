var model = require('./mongo')
var express = require('express')
var fs = require('fs')
var path = require('path')
var router = express.Router()

var formidable = require('formidable')
var datetime = require('silly-datetime')

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

router.post('/api/upload/avatar', (req, res, next) => {
  var AVATAR_DIR = '/avatar'
  var form = new formidable.IncomingForm()
  form.encoding = 'utf-8'
  form.uploadDir = './dist/static/images' + AVATAR_DIR
  form.keepExtensions = true
  form.maxFieldsSize = 5 * 1024 * 1024
  form.parse(req, (err, fields, files) => {
    var parsedFile = files.file
    console.log(parsedFile)
    if (err) {
      res.json({
        status: 500,
        msg: 'Parsing failure when uploading',
        result: ''
      })
    }
    if (parsedFile.size > form.maxFieldsSize) {
      fs.unlink(parsedFile.path)
      res.json({
        status: '1',
        msg: 'Image size larger than 5M',
        result: ''
      })
    }
    // var extName = ''
    // switch (parsedFile.type) {
    //   case 'image/jpeg':
    //     extName = 'jpg'
    //     break
    //   case 'image/png':
    //     extName = 'png'
    //     break
    // }
    // if (extName.length === 0) {
    //   return res.json({
    //     status: '1',
    //     msg: 'Only jpeg and png files are supported',
    //     result: ''
    //   })
    // }
    var uploadTime = datetime.format(new Date(), 'YYYYMMMDD')
    // var randomNum = parseInt(Math.random() * 8999 + 10000)
    var avatarName = uploadTime + '_' + parsedFile.name
    var avatarPath = form.uploadDir + '/' + avatarName
    fs.rename(parsedFile.path, avatarPath, (err) => {
      if (err) {
        console.log('rename err')
        res.json({
          'code': 401,
          'message': 'Image upload failed'
        })
      } else {
        // UNREACHABLE?
        console.log('rename ready')
        res.json({
          status: '0',
          msg: 'Image successfully uploaded',
          result: {
            data: AVATAR_DIR + '/' + avatarName
          }
        })
      }
    })
  })
})

router.post('/api/upload/image', (req, res, next) => {
  var SLIDER_DIR = '/slider'
  var form = new formidable.IncomingForm()
  form.encoding = 'utf-8'
  form.uploadDir = './static/images' + SLIDER_DIR
  form.keepExtensions = true
  form.parse(req, (err, fields, files) => {
    var parsedFile = files.file
    console.log(parsedFile)
    if (err) {
      res.json({
        status: 500,
        msg: 'Parsing failure when uploading',
        result: ''
      })
    }
    var uploadTime = datetime.format(new Date(), 'YYYYMMMDD')
    var imageName = uploadTime + '_' + parsedFile.name
    var imagePath = form.uploadDir + '/' + imageName
    fs.rename(parsedFile.path, imagePath, (err) => {
      if (err) {
        console.log('rename err')
        res.json({
          'code': 401,
          'message': 'Image upload failed'
        })
      } else {
        // UNREACHABLE?
        console.log('rename ready')
        res.json({
          status: '0',
          msg: 'Image successfully uploaded',
          result: {
            data: SLIDER_DIR + '/' + imageName
          }
        })
      }
    })
  })
})

router.get('/api/upload/image/loadAll', (req, res, next) => {
  console.log('/api/upload/loadAll')
  var SLIDER_DIR = '/slider'
  var imageDir = './static/images' + SLIDER_DIR
  var iteratedFiles = []
  console.log('1')
  function IterateFiles (dir) {
    var files = fs.readdirSync(dir)
    if (files && files.length) {
      console.log('2')
      files.forEach((filename) => {
        var fileFullName = path.join(dir, filename)
        // 根据文件路径获取文件信息，返回一个fs.Stats对象
        var stats = fs.statSync(fileFullName)
        if (stats) {
          console.warn('获取文件stats成功')
          var isFile = stats.isFile()
          var isDir = stats.isDirectory()
          if (isFile) {
            console.warn(fileFullName)
            // 读取文件内容
            // var content = fs.readFileSync(fileFullName, 'utf-8')
            // iteratedFiles.push({imageUrl: fileFullName})
            iteratedFiles.push({imageUrl: fileFullName})
            console.log('iteratedFiles: ' + JSON.stringify(iteratedFiles))
          }
          if (isDir) {
            IterateFiles(fileFullName)
          }
        }
      })
    }
  }
  IterateFiles(imageDir)
  console.log('3')
  console.log('function Finished: ' + JSON.stringify(iteratedFiles))
  console.log('function Finished: ' + iteratedFiles)
  res.json(JSON.stringify(iteratedFiles))
})

module.exports = router
