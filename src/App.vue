<template>
  <v-app>
    <v-app-bar app color="primary" dark prominent>
      <v-toolbar-title>Forum.hr</v-toolbar-title>
        <v-spacer></v-spacer>
        <template v-if="loggedInUser.id ===''">
          <div class="pt-1">
            <div class="d-flex">
              <p class="mr-4">Username</p>
              <v-text-field v-model="loginData.nickName" type="text"></v-text-field>
            </div>
            <div class="d-flex">
              <p class="mr-4">Password</p>
              <v-text-field v-model="loginData.password" type="password"></v-text-field>
            </div>
          </div>
          <v-btn @click="login">Login</v-btn>
        </template>
        <template v-else>
          Welcome, {{loggedInUser.nickName}}
          <v-btn @click="logout">Logout</v-btn>
        </template>
    </v-app-bar>
    
    <v-main>
      <router-view :loggedInUser="loggedInUser"></router-view>
    </v-main> 
  </v-app>
</template>

<script>
import axios from 'axios'
export default {
  data: () => {
    return {
      loginData: {
        nickName: '',
        password: ''
      },
      loggedInUser: {
        id: '',
        nickName: ''
      }
    }
  },
  methods:{
    login(){
      axios.get('/backend/login', {
        params: this.loginData
      })
      .then(response => {
        console.log('responese of login----', response)
        sessionStorage.setItem('id', response.data._id);
        this.loggedInUser.id = response.data._id
        this.loggedInUser.nickName = response.data.nickName
      })
      .catch(error => {
        console.log(error)
      })
    },
    logout(){
      sessionStorage.clear();
      this.loggedInUser.id = '',
      this.loggedInUser.nickName = ''
    },
    getLoggedInUserData(){
      var id = sessionStorage.getItem('id')
      axios.get('backend/user', {
        params: {
          id: id
        }
      })
      .then(response =>{
        console.log('looged in user data', response)
        this.loggedInUser.id = response.data._id
        this.loggedInUser.nickName = response.data.nickName
      })
      .catch(error => {
        console.log(error)
      })
    }
  },
  created () {
    console.log('created loggedin user id ', this.loggedInUser.id)
    this.getLoggedInUserData()
  }
};
</script>
