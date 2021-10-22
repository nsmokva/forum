<template>
  <div>  
    <v-img v-if="loggedInUser.avatar" max-height="150" max-width="250" :src="'/backend/user/images/' + loggedInUser.avatar" class="mx-auto mt-8"></v-img>
    <p class="font-weight-bold text-h4 text-center pt-6">{{loggedInUser.nickName}}</p> 
    <p class="text-center blue--text text-decoration-underline">Change your avatar</p>
    <div class="n-div mx-auto">
      <v-file-input @change="photoChanged"></v-file-input>
    </div>
    {{loggedInUser}}
  </div> 
</template>

<script>
import axios from 'axios'

export default {
  props:['loggedInUser'],
  data: () => {
    return {

    }
  },
  methods:{
    photoChanged(photoFile){
      let formData = new FormData();
      formData.append('upload', photoFile);
      axios.post( '/backend/user/images/' + photoFile.name,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
        }
      })
      .then(()=>{
        console.log('photo saved')
        axios.post('/backend/user/userdata/avatar', {
          id: this.loggedInUser.id,
          avatar: photoFile.name
        })
        .then((response) => {
         console.log('avatar data updated, response is: ', response)
         // this.profileOwnerUser.photoName = p.name
         this.$emit('userUpdated', response)
        })
        .catch(function (error) {
          console.log(error);
        });
      })
    }
  },
  created(){
    
  }
}
</script>

<style scoped>
.n-div{
  width: 200px;
}
</style>
