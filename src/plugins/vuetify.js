import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

const vuetify = new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#6200EA',
        secondary: '#EDE7F6',
        accent: '#8c9eff',
        error: '#b71c1c',
      },
    },
  },
})

export default vuetify

