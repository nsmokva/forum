import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Topic from '../views/Topic.vue'
import Profile from '../views/Profile.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/:topicId',
    name: 'topic',
    component: Topic,
    props: true
  },
  {
    path: '/profile/:ownerId',
    name: 'profile',
    component: Profile,
    props: true
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
