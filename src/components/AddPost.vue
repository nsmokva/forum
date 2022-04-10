<template>
  <div>
    <v-dialog :value="showDialogPost" @click:outside="closeDialog()" max-width="800">
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
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment';
export default {
  props:['loggedInUser', 'showDialogPost', 'quotedPost', 'topicId'],
  data (){
    return{
      newPost: '',
    }
  },
  methods: {
    publish(){
      var now = moment ();
      axios.post('/backend/posts', {
        post: this.newPost,
        date: now,
        ownerId: this.loggedInUser.id,
        ownerNickName: this.loggedInUser.nickName,
        ownerAvatar: this.loggedInUser.avatar,
        topicId: this.topicId,
        quotedPost: this.quotedPost
      })
      .then(() => {     
        this.$emit('closeDialog', {
          post:{
            ownerNickName: this.loggedInUser.nickName,
            ownerId: this.loggedInUser.id,
            ownerAvatar: this.loggedInUser.avatar,
            date: moment(),
            post: this.newPost,
            topicId: this.topicId,
            quotedPost: this.quotedPost
          }
        })
        this.newPost = ''
      })
      .catch( error => {
        console.log(error);
      });
    },
    closeDialog(){
      console.log('triggered')
      this.$emit('closeDialog')
      this.newPost = ''
    }
  }
}
</script>
