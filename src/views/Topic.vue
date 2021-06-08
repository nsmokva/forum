<template>
  <v-container class="mt-12">    
    <v-btn class="mb-4 primary" x-large @click="post">New Post</v-btn>
    <v-dialog v-model="showDialogLogIn" max-width="800">
      <v-card>
        log in to post
      </v-card>
    </v-dialog>
    <v-dialog v-model="showDialogPost" max-width="800">
      <v-card>
        <v-card v-if="this.quotedPost" width="95%" color="secondary" class="mx-auto">
          <div>
            <span class="font-weight-bold">{{quotedPost.ownerNickName}}</span>
            <span> says:</span>
          </div>
          <p>{{quotedPost.post}}</p>
        </v-card>
        <v-textarea v-model="newPost"></v-textarea>
        <v-btn @click="publish">Publish</v-btn>
      </v-card>
    </v-dialog>
    <v-row v-for="post in posts" :key="post._id" class="n-border-row mb-4 mt-0 mx-0">
      <v-col class="pa-0">
        <div class="n-color white--text text-h6 pl-3">{{formatDate(post.date)}}</div>
        <v-row class="ma-0">
          <v-col cols="3" class="n-border-right text-h6 pb-16">{{post.ownerNickName}}</v-col>
          <v-col cols="9" class="text-h6 font-weight-light">       
            <template v-if="post.quotedPost">
              <v-card color="secondary" class="mx-auto">
                <div>
                  <span class="font-weight-bold">{{post.quotedPost.ownerNickName}}</span>
                  <span> says:</span>
                </div>
                <p>{{post.quotedPost.post}}</p>
              </v-card>
            </template>  
            <div>{{post.post}}</div>
            <div class="d-flex justify-end"><v-btn class="primary" @click='quote(post)'>Quote</v-btn></div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
//import AddPost from '../components/AddPost.vue'
import axios from 'axios'
import moment from 'moment';
export default {
  components: {
    
  },
  props:['loggedInUser'],
  data: () => {
    return {
      posts: [], 
    showDialogPost: false,
      showDialogLogIn: false,
      newPost: '',
      quotedPost: ''
    }
  },
  methods: {
    post (){
      if(this.loggedInUser.id == ''){
        this.showDialogLogIn = true
      }else{
        this.showDialogPost = true
      }
    },
    publish(){
      var now = moment ();
      axios.post('/backend/posts', {
        post: this.newPost,
        date: now,
        _id: this.loggedInUser.id,
        ownerNickName: this.loggedInUser.nickName,
        quotedPost: this.quotedPost
      })
      .then(response => {
        console.log('post publisked:', response);
        this.showDialogPost = false
        this.posts.push({
          ownerNickName: this.loggedInUser.nickName,
          date: moment(),
          post: this.newPost,
          quotedPost: this.quotedPost
        })
        this.newPost = ''
        this.quotedPost = ''
      })
      .catch( error => {
        console.log(error);
      });
    },
    quote(post){
       if(this.loggedInUser.id == ''){
        this.showDialogLogIn = true
      }else{
        this.showDialogPost = true
        this.quotedPost = post
      console.log('quotedPost is: ', this.quotedPost)
      }    
    },
    getAllPosts(){
      axios.get('/backend/posts')
      .then(response => {
        console.log('get all posts response: ', response)
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
    }
  },
  created(){
    this.getAllPosts()
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
</style>