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
      gender: ''
    }
  },
  methods: {
    resetField (data) {
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
    }
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
.el-input, .el-button {
  width: 15%;
  margin: 12px 0;
}
</style>
