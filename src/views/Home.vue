<template>
  <div>
    <v-container class="mt-12 pa-0">
      <v-btn class="mb-4 primary" x-large @click="addTopic()">New Topic</v-btn>
      <v-dialog :value="showDialogLogIn" @click:outside="closeLogInDialog()" max-width="800">
        <v-card>
          <Login @loggingIn="onLoggingIn" :showDialogLogIn="showDialogLogIn"></Login>
        </v-card>
      </v-dialog>
      <AddTopic :loggedInUser="loggedInUser" :showDialogTopic="showDialogTopic" @closeDialog="onCloseDialog"></AddTopic>
      <v-row class="n-border-row n-color ma-0">
        <v-col>
          Topic
        </v-col>
        <v-col>
          Last post
        </v-col>
        <v-col>
          Posts
        </v-col>
        <v-col>
          Views
        </v-col>
      </v-row>
      <v-row v-for="topic in topics" :key="topic.title" class="n-border-row ma-0">
        <v-col>
          <router-link :to="{ name: 'topic', params: { topicId: topic._id}}">{{topic.title}}</router-link>
        </v-col>
        <v-col>
          <!-- <div>{{topic.lastPost.time}}</div>
          <div>by {{topic.lastPost.owner}}</div> -->

        </v-col>
        <v-col>
          {{topic.totalPosts}}
        </v-col>
        <v-col>
          <!-- views-->

        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Login from '../components/Login.vue'
import AddTopic from '../components/AddTopic.vue'
export default {
  components: {
    Login,
    AddTopic
  },
  data: () => {
    return {
      showDialogLogIn: false,
      showDialogTopic: false
    }
  },
  props:['topics', 'loggedInUser'],
  methods:{
    onLoggingIn(value){
      this.showDialogTopic = true
      this.$emit('loggingIn', value)
    },
    closeLogInDialog(){
      this.showDialogLogIn = false
    },
    addTopic(){
      if(this.loggedInUser.id == ''){
        this.showDialogLogIn = true
      }else{
        console.log('show dialog check', this.showDialogTopic)
        this.showDialogTopic= true
      }    
    },
    onCloseDialog(value){                                     //---------------------------------- 15 3 22 needs to be adjusted to topic!
      this.showDialogTopic = false
      this.$emit('closeDialog', value)
      // if(value != undefined){
      //   this.posts.push(value.post)
      //   this.$emit('increaseTotalPosts', value.post.topicId)
      // }
      // this.quotedPost = ''
    },
  },
  watch: {
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
    
  }
}
</script>

<style scoped>
  /* .n-border-container {
    border-top: 8px solid #6200EA;
    border-right: 8px solid #6200EA;
    border-left: 8px solid #6200EA;
    border-bottom: 6px solid #6200EA;
  } */
  .n-border-row {
    border-bottom: 2px solid #6200EA;
  }
  .n-color {
    background-color: #6200EA;
  }
</style>
