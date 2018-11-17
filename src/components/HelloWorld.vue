<template>
  <div class="content">
    <h1>{{ msg }}</h1>
    <span v-if="fetched">Raw data: {{ fetchedData }}</span>
    <el-row>
      Retrieve your info: <el-input class="el-input" v-model="username" placeholder="Username" type="text"></el-input>
    </el-row>
    <el-row>
      <el-button class="el-button" type="info" @click="fetchData(username)">Fetch info</el-button>
    </el-row>
    <span v-if="fetched">Welcome, {{ username }}!</span>
    <el-row>
      <el-input class="el-input" v-model="username" placeholder="Username" type="text"></el-input>
    </el-row>
    <el-row>
      <el-input class="el-input" v-model="age" placeholder="Age" type="text"></el-input>
    </el-row>
    <el-row>
      <el-input class="el-input" v-model="gender" placeholder="Gender" type="text"></el-input>
    </el-row>
    <span v-if="fetched && found">Not what you are looking for? Register now!</span>
    <span v-if="fetched && !found">Found nothing? Register now!</span>
    <el-row>
      <el-button class="el-button" type="success" @click="register">Register</el-button>
    </el-row>
    <h1 v-if="registered">Greetings {{ username }}, You are all set!</h1>
    <el-upload ref="upload" class="avatar-uploader" drag action=""
               :on-preview="handlePreviewFile" :on-remove="handleRemoveFile"
               :on-success = "handleUploadSuccess" :before-upload = "handleBeforeImageUpload"
               list-type="picture" :auto-upload="false" accept="image/*" multiple>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只能上传图片文件，且不超过5M</div>
    </el-upload>
    <el-row>
      <el-button size="small" type="primary" @click="handleSubmitFile">上传</el-button>
      <el-button size="small" @click="handleCancel">取消</el-button>
    </el-row>
    <el-row class="image-display" :gutter="10">
      <el-col :span="24" v-for="o in imageList" :key="o">
        <el-card :body-style="{ padding: '1px' }" style="margin: 5px">
          <!--<div v-if="imageUrl">-->
          <div v-if="o.imageUrl">
            <!--<img :src="imageUrl" class="avatar" width="50px">-->
            <img :src="o.imageUrl" class="avatar" width="50px">
            <div>
              <!--<span>Your image</span>-->
              <el-row class="bottom clearfix">
                <time v-if="uploadTime" class="time">{{ uploadTime }}</time>
                <time v-else class="time">{{ o.imageUrl }}</time>
                <el-button type="danger" icon="el-icon-delete" class="el-button-remove-cloud" @click="removeCloudImage" circle></el-button>
              </el-row>
            </div>
          </div>
          <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
        </el-card>
      </el-col>
    </el-row>
    <el-card :body-style="{ padding: '1px' }">
      <el-row :gutter="5">
        <el-col :span="4">
          <el-upload
            class="avatar-uploader" action=""
            :show-file-list="false"
            :on-success="handleUploadSuccess"
            :before-upload="handleBeforeAvatarUpload">
            <img v-if="avatarUrl" :src="avatarUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-col>
        <el-col :span="20">
          <div class="avatar-intro">
            PLACEHOLDER TEXT
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      fetched: false,
      found: false,
      registered: false,
      fetchedData: [],
      username: '',
      age: '',
      gender: '',
      imageList: [],
      imageUrl: '',
      avatarUrl: '',
      uploadTime: ''
    }
  },
  methods: {
    resetField () {
      // this.username = ''
      this.age = ''
      this.gender = ''
    },
    getField (data) {
      this.username = data.username
      this.age = data.age
      this.gender = data.gender
    },
    fetchData (queriedName) {
      let params = {
        username: queriedName
      }
      // Changing from GET method to POST method to retrieve data from server
      this.$http.post('/api/login/get', params)
        .then((res) => {
          console.log('Info successfully retrieved: ' + Date())
          console.log('body: ' + res.body)
          this.fetched = true
          if (res.body !== '') {
            this.found = true
            this.fetchedData = res.body
            this.getField(this.fetchedData)
            this.$message({
              message: 'Congrats, loading successful!',
              type: 'success'
            })
          }
        }).catch((err) => {
          console.log(err)
        })
    },
    register () {
      let params = {
        username: this.username,
        age: this.age,
        gender: this.gender
      }
      this.$http.post('/api/login/create', params)
        .then((res) => {
          console.log(res)
          this.$message({
            message: 'Congrats, insertion successful!',
            type: 'success'
          })
          this.registered = true
          this.resetField()
        }).catch((err) => {
          console.log(err)
        })
    },
    handleUploadSuccess (res, file) {},
    handleBeforeAvatarUpload (file) {
      console.log('handleBeforeAvatarUpload: ')
      console.log(file)
      var formData = new FormData()
      formData.append('file', file)
      this.$http.post('/api/upload/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then((res) => {
          console.log('handleUploadSuccess: ')
          console.log(res)
          // if (res.status === '0') {
          // eslint-disable-next-line
          if (true) {
            console.log('success msg')
            this.$message({
              message: res.msg,
              type: 'success'
            })
            var windowURL = window.URL || window.webkitURL
            this.imageUrl = windowURL.createObjectURL(file)
            console.log('this.imageUrl: ' + this.imageUrl)
            this.avatarUrl = windowURL.createObjectURL(file)
            console.log(file.lastModifiedDate)
            // this.uploadTime = file.lastModifiedDate
            // this.uploadTime = file.name
            // windowURL.revokeObjectURL(this.avatarUrl)
          } else {
            console.log('error msg')
            this.$message.error(res.msg)
          }
        }).catch((err) => {
          console.log(err)
        })
    },
    handleBeforeImageUpload (file) {
      console.log('handleBeforeImageUpload: ')
      console.log(file)
      var formData = new FormData()
      formData.append('file', file)
      this.$http.post('/api/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then((res) => {
          console.log('handleUploadSuccess: ')
          console.log(res)
          // if (res.status === '0') {
          // eslint-disable-next-line
          if (true) {
            console.log('success msg')
            this.$message({
              message: res.msg,
              type: 'success'
            })
          } else {
            console.log('error msg')
            this.$message.error(res.msg)
          }
        }).catch((err) => {
          console.log(err)
        })
    },
    handlePreviewFile () {
      console.log('handlePreviewFile()')
    },
    handleRemoveFile () {
      console.log('handleRemoveFile()')
    },
    handleSubmitFile () {
      console.log('handleSubmitFile()')
      this.$refs.upload.submit()
      this.$http.get('/api/upload/image/loadAll')
        .then((res) => {
          console.log('/api/upload/loadAll')
          console.log('Info successfully retrieved: ' + Date())
          console.log('res.data: ' + res.data + '.')
          this.imageUrl = []
          this.imageList = JSON.parse(res.data)
        }).catch((err) => {
          console.log(err)
        })
    },
    handleCancel () {
      this.$refs.upload.clearFiles()
    },
    removeCloudImage () {}
  },
  watch: {
    username (newVal, oldVal) {
      if (this.fetched === true) {
        this.fetched = false
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.content {
  padding: 15px;
}
.el-input {
  width: 15%;
  margin: 12px 0;
}
.el-button {
  margin: 12px 0;
}
.image-display {
  margin: 1rem;
}
.el-button-remove-cloud {
  float: right;
  margin: 2%;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #f0c78a;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  margin: 5px;
  border-radius: 8px;
  width: 178px;
  height: 178px;
  display: block;
}
.avatar:hover {
  opacity: .75;
}
.avatar-intro {
  padding: 2%;
}
.time {
  font-size: 13px;
  color: #999;
}
.bottom {
  margin-top: 13px;
  line-height: 12px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
</style>
