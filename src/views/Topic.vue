<template>
  <v-container class="mt-12">    
    <v-btn class="mb-4 primary" x-large @click="addPost()">New Post</v-btn>
    <v-dialog :value="showDialogLogIn" @click:outside="closeLogInDialog()" max-width="800">
      <v-card>
        <Login @loggingIn="onLoggingIn" :showDialogLogIn="showDialogLogIn"></Login>
      </v-card>
    </v-dialog>
    <AddPost :loggedInUser="loggedInUser" :showDialogPost="showDialogPost" :quotedPost="quotedPost" :topicId="topicId" @closeDialog="onCloseDialog"></AddPost>
    <v-row v-for="post in posts" :key="post._id" class="n-border-row mb-4 mt-0 mx-0">
      <v-col class="pa-0">
        <div class="n-color white--text text-h6 pl-3">{{formatDate(post.date)}}</div>
        <v-row class="ma-0">
          <v-col cols="3" class="n-border-right text-h6 pb-16">{{post.ownerNickName}}</v-col>
          <v-col cols="9" class="text-h6 font-weight-light d-flex flex-wrap">       
            <template v-if="post.quotedPost">
              <v-card color="secondary" class="mx-auto n-fullRow">
                <div>
                  <span class="font-weight-bold">{{post.quotedPost.ownerNickName}}</span>
                  <span> says:</span>
                </div>
                <p>{{post.quotedPost.post}}</p>
              </v-card>
            </template>  
            <div class="n-fullRow">{{post.post}}</div>
            <div class="d-flex justify-end align-self-end n-fullRow">
              <v-btn class="primary mr-1" @click='addPost(post)'>Quote</v-btn>
              <v-btn v-if="showEdit(post)" class="primary ml-1">Edit</v-btn>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AddPost from '../components/AddPost.vue'
import Login from '../components/Login.vue'
import axios from 'axios'
import moment from 'moment';
export default {
  components: {
    AddPost,
    Login
  },
  props:['loggedInUser', 'topicId'],
  data: () => {
    return {
      posts: [],
      showDialogPost: false,
      showDialogLogIn: false,
      quotedPost: ''
    }
  },
  methods: {
    addPost(post){
       if(this.loggedInUser.id == ''){
        this.showDialogLogIn = true
      }else{
        this.showDialogPost = true
        if(post != undefined){
          this.quotedPost = post
        }
      }    
    },
    getAllPostsinTopic(){
      console.log('topicId ', this.topicId)
      axios.get('/backend/topic', {
        params:{
          id: this.topicId
        }
      })
      .then(response => {
        console.log('all posts in getAllPosts: ', response)
        this.posts = response.data
      })
      .catch(error => {
        console.log(error)
      })
    },
    formatDate(date){
      return moment(date).calendar(null, {
        sameDay: '[Today at ]H[:]m',
        lastDay: '[Yesterday at ]H[:]m',
        lastWeek: 'MMMM Do YYYY[, ]H[:]m',
        sameElse: 'MMMM Do YYYY[, ]H[:]m'
      });
    },
    onCloseDialog(value){
      this.showDialogPost = false
      if(value != undefined){
        this.posts.push(value.post)
      }
      this.quotedPost = ''
    },
    closeLogInDialog(){
      this.showDialogLogIn = false
    },
    showEdit(post){
      if(post.ownerId == this.loggedInUser.id){
        return true
      }else{
        return false
      }
    },
    onLoggingIn(value){
      this.$emit('loggingIn', value)
    }
  },
  watch: {
    topicId: { 
      immediate: true,
      handler (newTopic) {
      this.$emit('topicChanged', newTopic)
      },
    },
    loggedInUser:{
      immediate: true, 
      deep: true,
      handler(newValue){
        if(newValue.id != ''){
          this.closeLogInDialog()
        }
      }
    }
  },
  created(){
    this.getAllPostsinTopic()
    this.quotedPost = ''
  }
}
</script>


<style scoped>
 .n-border-row {
    border: 2px solid #6200EA;
  }
  .n-border-right {
    border-right: 2px solid #6200EA;
  }
  .n-color {
    background-color: #6200EA;
  }
  .n-font-size {
    font-size: 1.25rem;
  }
  .n-fullRow{
    flex-basis: 100%;
  }
</style>