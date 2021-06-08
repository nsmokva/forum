module.exports = {
  transpileDependencies: [
    'vuetify'
  ],

  devServer: {
    proxy: {
      '/backend/.*': { target: 'http://localhost:4000/' }
    }
  }
}
