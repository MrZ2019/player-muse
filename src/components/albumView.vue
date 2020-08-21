<template>
  <div class="album-box">
    <div class="row cover-list">
      <span v-for="i in rows" :key="i" class="item" @click="showAlbum(i)">
        <span class="name">{{i.title}}</span>
        <img :src="i.picture" alt="">
      </span>
    </div>
  </div>
</template>

<script>
  import {
    mapState
  } from 'vuex'
  export default {
    data() {
      return {
        rows: [],
      }
    },
    computed: {
      ...mapState([])
    },
    mounted() {
      // let db = window.DB.db;
      let self = this;

      window.DB.exec('SELECT * FROM albums', null, (data)=> {
        self.rows = data;
      })
    },
    methods: {
      showAlbum(item) {
        let self = this;
        self.songRows = []
        
        window.DB.exec('SELECT * FROM songs WHERE album_id=?', [item.id], (data)=> {
          self.songRows = data;
          
          self.$store.commit('setAlbum', {
            list: self.songRows,
            title: item.title
          })
          
          self.$router.push('/mp3-list')
        })
        
      },

    }
  }
</script>

<style lang='scss'>
  .album-box {
    .cover-list {

      .item {
        max-width: 128px;
      }

      img {
        width: 128px;
      }

      .name {
        display: block;
      }
    }
  }
</style>
