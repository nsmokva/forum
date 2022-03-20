<template>
  <div>
    <v-dialog :value="showDialogTopic" @click:outside="closeDialog()" max-width="800">
      <v-card>
        <v-text-field v-model="newTopic" label="Topic title"></v-text-field>
        <v-textarea v-model="newPost" label="First post in topic"></v-textarea>
        <v-btn @click="publish">Publish</v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment';
export default {
  props:['loggedInUser', 'showDialogTopic'],
  data (){
    return{
      newTopic: '',
      newPost: ''
    }
  },
  methods: {
    publish(){
      axios.post('/backend/topics', {
        title: this.newTopic
      })
      .then((result)=>{
        console.log('new topic added, result is ', result.data._id)
        var now = moment ();
        axios.post('/backend/posts', {
          post: this.newPost,
          date: now,
          ownerId: this.loggedInUser.id,
          ownerNickName: this.loggedInUser.nickName,
          ownerAvatar: this.loggedInUser.avatar,
          topicId: result.data._id
        })  
        .then(()=>{
          console.log('first post added')
        })
         
        
      })


      

      // axios.post('/backend/posts', {
      //   post: this.newPost,
      //   date: now,
      //   ownerId: this.loggedInUser.id,
      //   ownerNickName: this.loggedInUser.nickName,
      //   ownerAvatar: this.loggedInUser.avatar,
      //   topicId: this.topicId,
      //   quotedPost: this.quotedPost
      // })
      // .then(() => {     
      //   this.$emit('closeDialog', {
      //     post:{
      //       ownerNickName: this.loggedInUser.nickName,
      //       ownerId: this.loggedInUser.id,
      //       ownerAvatar: this.loggedInUser.avatar,
      //       date: moment(),
      //       post: this.newPost,
      //       topicId: this.topicId,
      //       quotedPost: this.quotedPost
      //     }
      //   })
      //   this.newPost = ''
      // })
      // .catch( error => {
      //   console.log(error);
      // });
    },
    closeDialog(){
      this.$emit('closeDialog')
      this.newPost = ''
    }
  }
}
</script>
