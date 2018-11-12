<template>
  <div class="content">
    <h1>{{ msg }}</h1>
    <span v-if="fetched">Raw data: {{ fetchedData }}</span>
    <el-row>
      <el-button class="el-button" type="info" @click="fetchData">Fetch info</el-button>
    </el-row>
    <el-row>
      <el-input class="el-input" v-model="username" placeholder="Username" type="text"></el-input>
    </el-row>
    <el-row>
      <el-input class="el-input" v-model="age" placeholder="Age" type="text"></el-input>
    </el-row>
    <el-row>
      <el-input class="el-input" v-model="gender" placeholder="Gender" type="text"></el-input>
    </el-row>
    <el-row>
      <el-button class="el-button" type="success" @click="register">Register</el-button>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      fetched: false,
      fetchedData: [],
      username: '',
      age: '',
      gender: ''
    }
  },
  methods: {
    fetchData () {
      this.$http.get('/api/login/get')
        .then((res) => {
          console.log('Info successfully retrieved')
          console.log(res.body)
          this.fetchedData = res.body
          this.username = this.fetchedData.username
          this.age = this.fetchedData.age
          this.gender = this.fetchedData.gender
          this.$message({
            message: 'Congrats, loading successful!',
            type: 'success'
          })
        }).catch((err) => {
          console.log(err)
        })
      this.fetched = true
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
          // var message = res.body.message
          // alert(message)
        }).catch((err) => {
          console.log(err)
        })
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
