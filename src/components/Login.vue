<template>
  <div class="mt-4">
    <!-- always on app bar -->
    <v-form v-if="appbar" ref="form"> 
      <div class="d-flex align-end">
        <div class="pt-1">
          <div class="d-flex">
            <p class="mr-4">Username</p>
            <v-text-field v-model="loginData.nickName" type="text" placeholder="Nick name" :rules="nickRules" dense background-color="white" light></v-text-field>
          </div>
          <div class="d-flex">
            <p class="mr-4">Password</p>
            <v-text-field v-model="loginData.password" type="password" placeholder="Password" :rules="passRules" dense background-color="white" light @keyup.enter="login(loginData)"></v-text-field>
          </div>
        </div>
        <div class="mb-5 ml-2 n-btn">
          <v-btn @click="login(loginData)" height="26px">Login</v-btn>
        </div>   
      </div>  
    </v-form>

    <!-- dialog on the topic page occasionally -->
    <v-form v-else ref="form">
      <div class="pb-12 d-flex">
        <v-btn :color="loginColor" class="text-uppercase" :class="orderLogin" tile depressed :ripple="false" x-large width="50%" @click="showLoginForm()">Existing user</v-btn>
        <v-btn :color="registerColor" class="text-uppercase" :class="orderRegister" tile depressed :ripple="false" x-large width="50%" @click="showRegisterForm()">New user</v-btn>
      </div>
      <div class="pa-12">    
        <v-text-field v-model="loginData2.nickName" type="text" placeholder="Nick name" outlined :rules="nickRules"></v-text-field>
        <v-text-field v-model="loginData2.password" type="password" placeholder="Password" outlined :rules="passRules" @keyup.enter="login(loginData2)"></v-text-field>
        <v-btn v-if="loginColor == 'white'" color="primary" class="text-uppercase" tile x-large width="100%" @click="login(loginData2)">Log in</v-btn>
        <v-btn v-else color="primary" class="text-uppercase" tile x-large width="100%">Create account</v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  props: ['showDialogLogIn', 'appbar'],
  data: () => {
    return{
      loginColor: 'white',
      registerColor: 'primary',
      orderLogin: 'order-1',
      orderRegister: 'order-2',
      loginData: {
        nickName: '',
        password: ''
      },
      loginData2: {
        nickName: '',
        password: ''
      },
      nickRules: [
        value => {
          if(value.length == 0){
            return 'Enter nickname.'
          }else{
            return true
          }
        }
      ],
      passRules: [
        value => {
          if(value.length == 0){
            return 'Enter password.'
          }else{
            return true
          }
        }
      ]
    }
  },
  methods: {
    showLoginForm(){
      this.loginColor = 'white'
      this.registerColor = 'primary'
      this.orderLogin = 'order-1'
      this.orderRegister = 'order-2'
    },
    showRegisterForm(){
      this.loginColor = 'primary'
      this.registerColor = 'white'
      this.orderLogin = 'order-2'
      this.orderRegister = 'order-1'
    },
    login(data){
      if (this.$refs.form.validate()){
      axios.get('/backend/login', {
        params: data
      })
      .then(response => {
        this.$emit('loggingIn', response)
      })
      .catch(error => {
        console.log(error)
      })
        this.$refs.form.resetValidation()
        this.loginData.nickName = '',
        this.loginData.password = ''
        this.loginData2.nickName = '',
        this.loginData2.password = ''
      }   
    }
  },
  watch: {
    showDialogLogIn: {
      immediate: true, 
      handler (newValue){
        if(newValue == false){
          console.log('vatchig login dialog getting close')
        this.$refs.form.resetValidation()
        this.loginData.nickName = '',
        this.loginData.password = ''
        }
      }
    }
  }
}
</script>

<style scoped>
  .n-btn {
    padding-top: 4px;
    padding-bottom: 2px;
  }
  .v-btn:before {
    background-color: transparent !important;
  }
</style>
