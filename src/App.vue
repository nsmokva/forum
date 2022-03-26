<template>
  <v-app>
    <v-app-bar app color="primary" dark prominent>
      <v-toolbar-title><router-link :to="{ name: 'home'}"><span class="white--text">Forum.hr</span></router-link><span v-if="isTopicPage()">/{{currentTopic.title}}</span></v-toolbar-title>
        <v-spacer></v-spacer>

        <!-- <v-divider vertical class="mx-4 pa-10"></v-divider> -->
        <div class="n-div mx-4"></div>
        <template v-if="loggedInUser.id ===''">
          <Login :appbar="true" @loggingIn="onLoggingIn"></Login>
          <!-- <div class="pt-1">
            <div class="d-flex">
              <p class="mr-4">Username</p>
              <v-text-field v-model="loginData.nickName" type="text"></v-text-field>
            </div>
            <div class="d-flex">
              <p class="mr-4">Password</p>
              <v-text-field v-model="loginData.password" type="password"></v-text-field>
            </div>
          </div>
          <v-btn @click="login(loginData)">Login</v-btn> -->
        </template>
        <template v-else>
          <div class="d-flex flex-column mt-4">
            <div>
              Welcome, {{loggedInUser.nickName}}
            </div>
          <div class="d-flex justify-end">
            <v-btn plain class="pa-0 mr-4" :to="{ name: 'profile', params: { ownerId: loggedInUser.id}}">Edit profile</v-btn>
            <v-btn @click="logout" plain class="pa-0">Logout</v-btn>
          </div>
         </div>
        </template>
    </v-app-bar>
    
    <v-main>
       current topic is  {{currentTopic}}
      <router-view :loggedInUser="loggedInUser" :topics="topics" :currentTopic="currentTopic" @topicChanged="onTopicChanged" @loggingIn="onLoggingIn" @userUpdated="onUserUpdated" @increaseTotalPosts="onIncreaseTotalPosts"></router-view>
    </v-main> 
  </v-app>
</template>

<script>
import axios from 'axios'
import Login from './components/Login.vue'
export default {
  components: {
    Login
  },
  data: () => {
    return {
      loginData: {
        nickName: '',
        password: ''
      },
      loggedInUser: {
        id: '',
        nickName: '',
        avatar: ''
      },
      currentTopic:{
        id: '',
        title:'',
        totalPosts: 0
      },
      topics: [],
      gotTopics: false
    }
  },
  methods:{
    // login(data){
    //   axios.get('/backend/login', {
    //     params: data
    //   })
    //   .then(response => {
    //     sessionStorage.setItem('id', response.data._id);
    //     this.loggedInUser.id = response.data._id
    //     this.loggedInUser.nickName = response.data.nickName
    //     data.nickName = '',
    //     data.password = ''
    //   })
    //   .catch(error => {
    //     console.log(error)
    //   })
    // },
    logout(){
      sessionStorage.clear();
      this.loggedInUser.id = '',
      this.loggedInUser.nickName = ''
      this.loggedInUser.avatar = ''
    },
    getLoggedInUserData(){
      var id = sessionStorage.getItem('id')
      axios.get('/backend/user', {
        params: {
          id: id
        }
      })
      .then(response =>{
        this.loggedInUser.id = response.data._id
        this.loggedInUser.nickName = response.data.nickName
        this.loggedInUser.avatar = response.data.avatar
      })
      .catch(error => {
        console.log(error)
      })
    },
    onTopicChanged(value){
      this.currentTopic.id = value
      if(this.gotTopics == true){
        const found = this.topics.find(element => element._id == this.currentTopic.id);
        this.currentTopic = found
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
          this.currentTopic = found
        }
        this.gotTopics = true
      })
      .catch(error => {
        console.log(error)
      })
    },
    onLoggingIn(value){
      sessionStorage.setItem('id', value.data._id);
      this.loggedInUser.id = value.data._id
      this.loggedInUser.nickName = value.data.nickName
      this.loggedInUser.avatar = value.data.avatar
    },
    onUserUpdated(value){
      this.loggedInUser.nickName = value.data.nickName
      this.loggedInUser.avatar = value.data.avatar
    },
    onIncreaseTotalPosts(value){

      const found = this.topics.find(element => element._id == value);
      found.totalPosts = found.totalPosts + 1
      this.currentTopic.totalPosts = this.currentTopic.totalPosts + 1
    }
  },
  created () {
    this.getLoggedInUserData()
    this.getAllTopics()
  }
};
</script>

<style scoped>
  .n-div {
    width: 1px;
    height: 100%;
    background-color: white;
  }
</style>
