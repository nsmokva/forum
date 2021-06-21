<template>
  <div>
    <v-container class="n-border-container mt-12 pa-0">
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
          <!-- {{topic.totalPosts}} -->
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>

export default {
  props:['topics'],
  data: () => {
    return {
    
        // {
        //   title: "Gossip",
        //   lastPost: {
        //     owner: 'Simpsolina',
        //     time: 'Today 11:39'
        //   },
        //   totalPosts: '900'
        // },
        // {
        //   title: "Stocks",
        //   lastPost: {
        //     owner: 'NioFan',
        //     time: 'Today 10:15'
        //   },
        //   totalPosts: '52'
        // },
        // {
        //   title: "Parenting",
        //   lastPost: {
        //     owner: 'Mammma',
        //     time: '3 days ago'
        //   },
        //   totalPosts: '12'
        // },
        // {
        //   title: "Pets",
        //   lastPost: {
        //     owner: 'Mammma',
        //     time: '3 days ago'
        //   },
        //   totalPosts: '12'
        // },
        // {
        //   title: "Work life",
        //   lastPost: {
        //     owner: 'Mammma',
        //     time: '3 days ago'
        //   },
        //   totalPosts: '12'
        // },
        // {
        //   title: "Traveling",
        //   lastPost: {
        //     owner: 'Mammma',
        //     time: '3 days ago'
        //   },
        //   totalPosts: '12'
        // },
        // {
        //   title: "Gastronomy",
        //   lastPost: {
        //     owner: 'Mammma',
        //     time: '3 days ago'
        //   },
        //   totalPosts: '12'
        // },
        // {
        //   title: "Health",
        //   lastPost: {
        //     owner: 'Mammma',
        //     time: '3 days ago'
        //   },
        //   totalPosts: '12'
        // },
        // {
        //   title: "Economy and politics",
        //   lastPost: {
        //     owner: 'Mammma',
        //     time: '3 days ago'
        //   },
        //   totalPosts: '12'
        // },
    }
  },
  methods:{
    
  },
  created(){
    
  }
}
</script>

<style scoped>
  .n-border-container {
    border-top: 8px solid #6200EA;
    border-right: 8px solid #6200EA;
    border-left: 8px solid #6200EA;
    border-bottom: 6px solid #6200EA;
  }
  .n-border-row {
    border-bottom: 2px solid #6200EA;
  }
  .n-color {
    background-color: #6200EA;
  }
</style>
