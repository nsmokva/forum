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
          <v-col cols="3" class="n-border-right pb-16">
            <div class='text-h6'>{{post.ownerNickName}}</div>
            <v-img :src="'/backend/user/images/' + post.ownerAvatar" max-height="180" max-width="180"></v-img>
          </v-col>
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
    <v-row  class="d-flex justify-end">
      <v-col cols="3">
        <v-container >
          <v-pagination :value="page" :length="length" @input="pagInput"></v-pagination>
        </v-container>
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
  props:['loggedInUser', 'topicId', 'topics', 'currentTopic'],
  data: () => {
    return {
      posts: [],
      showDialogPost: false,
      showDialogLogIn: false,
      quotedPost: '',
      page: 1,
      topicChanged: false
    }
  },
  computed: {   
    length: function(){
      if(this.topics.length!=0){
        return Math.ceil(this.currentTopic.totalPosts/3)
      }else{
        return 0
      }
    }
  },
  methods: {
    addPost(post){
       if(this.loggedInUser.id == ''){
        if(post != undefined){
          this.quotedPost = post
        }
        this.showDialogLogIn = true
      }else{
        this.showDialogPost = true
        if(post != undefined){
          this.quotedPost = post
        }
      }    
    },
    formatDate(date){
      return moment(date).calendar(null, {
        sameDay: '[Today at ]H[:]mm',
        lastDay: '[Yesterday at ]H[:]mm',
        lastWeek: 'MMMM Do YYYY[, ]H[:]mm',
        sameElse: 'MMMM Do YYYY[, ]H[:]mm'
      });
    },
    onCloseDialog(value){
      this.showDialogPost = false
      if(value != undefined){
        this.posts.push(value.post)
        console.log('posts areeee ', this.posts)
        console.log('route is ', this.$route)
        if(this.posts.length === 4){
         //here need to push change to route -- incerease this.$route.query by 1
        var path = this.$route.path
        var query = parseInt(this.$route.query.page) + 1
        this.$router.push({ path: path, query: { page: query } })
        }
        this.$emit('increaseTotalPosts', value.post.topicId)
      }
      this.quotedPost = ''
    },
    closeLogInDialog(){
      this.showDialogLogIn = false
      this.quotedPost = ''
    },
    showEdit(post){
      if(post.ownerId == this.loggedInUser.id){
        return true
      }else{
        return false
      }
    },
    onLoggingIn(value){
      this.showDialogPost = true
      this.$emit('loggingIn', value)
    },
    pagInput(value, shouldReplace){
      this.page = parseInt(value)
      console.log ('pagInput is ', value)
      if (shouldReplace == true){
        this.$router.replace({name: 'topic', query: {page: value}})
      }else{
        this.$router.push({name: 'topic', query: {page: value}})
      }    
      //sessionStorage.setItem('page', value);
      //instruct axios to give you items for a specific page
       axios.get('/backend/topic/page', {
        params:{
          id: this.topicId,
          page: value,
          limit: 3
        }
      })
      .then(response => {
        console.log('posts in page: ', response)
        this.posts = response.data
       
      })
      .catch(error => {
        console.log(error)
      })


    },
    pagNext(value){
      console.log('pagNext is ', value)
    }
  },
  watch: {
    topicId: { 
      immediate: true,
      handler (newTopic) {
      this.$emit('topicChanged', newTopic)
      //this.page = 1
      this.topicChanged = true
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
    },
    $route (to, from){
      if(to.query.page != this.page){
        this.pagInput(to.query.page)
      }
      console.log('watching route "to" is ', to)
      console.log('watching route "from" is ', from)
  }
  },
  created(){
     if(this.$route.query.page){
      this.pagInput(this.$route.query.page, false)
     }else{
      this.pagInput(1, true)
     }
     console.log('created topic')
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