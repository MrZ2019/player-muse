<template>
  <div class="album-box">
    <mu-text-field placeholder="" full-width v-model="search" class="inp-search"/>
    <div class="row cover-list">
      <span v-for="i,index in rows" :key="index" class="item" @click="showAlbum(i)">
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
        allRows: [],
        rowsFilter: [],
        max: 10,
        search: '',
      }
    },
    computed: {
      ...mapState([]),

      rows() {
        let result;
        if (this.search) {
          result = this.rowsFilter;
        } else {
          result = window.pickItems(this.allRows, this.max);
        }

        return result;
      },
    },
    watch: {
      search(val) {

          if (!val) {
            return this.rowsFilter = [];
          }
          try {
            // let list = this.allRows.filter((item)=> {
            //   return item.title.indexOf(val) !== -1 || item.singer.indexOf(val) !== -1;
            // })

            this.query();

            // this.rowsFilter = list;
          } catch(e) {
            alert(e)
          }

      }
    },
    mounted() {
      // let db = window.DB.db;
      let self = this;

      window.DB.exec(`SELECT DISTINCT albums.*, singers.name as singer FROM albums
       left join songs on songs.album_id = albums.id left join singers on singers.id=songs.singer_id LIMIT 100`, null, (data)=> {
         console.log(data[0])
        self.allRows = data;
      })
      this.search = ''
      this.query()
    },
    methods: {
      query() {
        let self = this
        window.DB.exec(`SELECT DISTINCT albums.*, singers.name as singer FROM albums
         left join songs on songs.album_id = albums.id left join singers  on singers.id=songs.singer_id WHERE singers.name LIKE '%${this.search}%' OR albums.title LIKE '%${this.search}%' group by albums.title  LIMIT 200`, null, (data)=> {
          self.rowsFilter = data;
        })
      },
      showAlbum(item) {
        let self = this;
        self.songRows = []

        window.DB.exec('SELECT * FROM songs WHERE album_id=?', [item.id], (data)=> {
          self.songRows = data;

          self.$store.commit('setAlbum', {
            list: self.songRows,
            title: item.title
          })
          self.$store.state.isFromList = false
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
