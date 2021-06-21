<template>
  <v-app>
    <v-app-bar app color="primary" dark prominent>
      <v-toolbar-title><router-link :to="{ name: 'home'}"><span class="white--text">Forum.hr</span></router-link><span v-if="isTopicPage()">/{{currentTopic.title}}</span></v-toolbar-title>
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
          <v-btn @click="login(loginData)">Login</v-btn>
        </template>
        <template v-else>
          Welcome, {{loggedInUser.nickName}}
          <v-btn @click="logout">Logout</v-btn>
        </template>
    </v-app-bar>
    
    <v-main>
      <router-view :loggedInUser="loggedInUser" :topics="topics" @topicChanged="onTopicChanged" @loggingIn="onloggingIn"></router-view>
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
      },
      currentTopic:{
        id: '',
        title:''
      },
      topics: [],
      gotTopics: false
    }
  },
  methods:{
    login(data){
      axios.get('/backend/login', {
        params: data
      })
      .then(response => {
        sessionStorage.setItem('id', response.data._id);
        this.loggedInUser.id = response.data._id
        this.loggedInUser.nickName = response.data.nickName
        data.nickName = '',
        data.password = ''
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
        this.loggedInUser.id = response.data._id
        this.loggedInUser.nickName = response.data.nickName
      })
      .catch(error => {
        console.log(error)
      })
    },
    onTopicChanged(value){
      this.currentTopic.id = value
      if(this.gotTopics == true){
        const found = this.topics.find(element => element._id == this.currentTopic.id);
        this.currentTopic.title = found.title
      }
      
    },
    isTopicPage(){
      if(this.$route.name == 'topic'){
        return true
      }else{
        return false
      }
    },
    getAllTopics(){
      axios.get('/backend/topics')
      .then(response =>{
        this.topics = response.data
        if(this.currentTopic.id != ''){
          const found = this.topics.find(element => element._id == this.currentTopic.id);
          this.currentTopic.title = found.title
        }
        this.gotTopics = true
      })
      .catch(error => {
        console.log(error)
      })
    },
    onloggingIn(value){
      this.login(value)
    }
  },
  created () {
    this.getLoggedInUserData()
    this.getAllTopics()
  }
};
</script>
