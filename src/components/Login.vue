<template>
    <v-form ref="form">
      <div class="pb-12 d-flex">
        <v-btn :color="loginColor" class="text-uppercase" :class="orderLogin" tile depressed :ripple="false" x-large width="50%" @click="showLoginForm()">Existing user</v-btn>
        <v-btn :color="registerColor" class="text-uppercase" :class="orderRegister" tile depressed :ripple="false" x-large width="50%" @click="showRegisterForm()">New user</v-btn>
      </div>
      <div class="pa-12">    
        <v-text-field v-model="loginData.nickName" type="text" placeholder="Nick name" outlined :rules="nickRules"></v-text-field>
        <v-text-field v-model="loginData.password" type="password" placeholder="Password" outlined :rules="passRules"></v-text-field>
        <v-btn v-if="loginColor == 'white'" color="primary" class="text-uppercase" tile x-large width="100%" @click="login">Log in</v-btn>
        <v-btn v-else color="primary" class="text-uppercase" tile x-large width="100%">Create account</v-btn>
      </div>
    </v-form>
</template>

<script>
export default {
  props: ['showDialogLogIn'],
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
      nickRules: [
        value => {
          if(value.length == 0){
            return 'Enter nickname.'
          }
        }
      ],
      passRules: [
        value => {
          if(value.length == 0){
            return 'Enter password.'
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
    login(){
      if (this.$refs.form.validate()){
        this.$emit('loggingIn', this.loginData)
        this.$refs.form.resetValidation()
        this.loginData.nickName = '',
        this.loginData.password = ''
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
  /* .n-btn:hover {
    background-color: red;
  } */
  .v-btn:before {
    background-color: transparent !important;
  }
</style>
