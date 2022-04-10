<template>
  <div>
    <v-dialog :value="showDialogTopic" @click:outside="closeDialog()" max-width="800">
      <v-card>
        <v-text-field v-model="newTopic" label="Topic title"></v-text-field>
        <v-textarea v-model="newPost" label="First post in topic"></v-textarea>
        <v-btn :class="btnClass" @click="publish">Publish</v-btn>
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
  computed: {
    btnClass(){
      if(this.newTopic!= '' && this.newPost != ''){
        return 'mb-4 primary'
      }else{
        return 'mb-4 secondary'
      }
    }
  },
  methods: {
    publish(){
      if(this.newTopic!= '' && this.newPost != ''){
        axios.post('/backend/topics', {
          title: this.newTopic
        })
      .then((result)=>{
        console.log('new topic added, result is ', result)
        var now = moment ();
        axios.post('/backend/posts', {
          post: this.newPost,
          date: now,
          ownerId: this.loggedInUser.id,
          ownerNickName: this.loggedInUser.nickName,
          ownerAvatar: this.loggedInUser.avatar,
          topicId: result.data._id
        })  
        .then((r)=>{
          this.closeDialog(result)
          console.log('first post added, result is', result)
          console.log('first post added, r is', r)
        })
        .catch((error)=>{
        console.log('publishing error 1', error)
        })
      })
      .catch((error)=>{
        console.log('publishing error 2', error)
      })
      }
    },
    closeDialog(value){
      if(value != undefined){
        this.$emit('closeDialog', {
          _id: value.data._id,
          title: this.newTopic,
          totalPosts: 1
        })
      }else{
        this.$emit('closeDialog')
      } 
      this.newPost = ''
      this.newTopic = ''
    }
  }
}
</script>
