<template>
  <div class="scan">
    <div class="row">
      <mu-raised-button label="开始扫描" class="demo-raised-button" secondary @click="startScan" />

      <mu-raised-button label="清空" class="demo-raised-button" secondary @click="clear" />

      <mu-raised-button label="执行" class="demo-raised-button" secondary @click="execute" />
    </div>
    <div class="row progress">
      {{cur}} / {{total}}
    </div>
    <div class="row progress">
      本次重复数: {{repeatCount}} albums: {{allAlbums.length}}  songs: {{allSongs.length}} singers: {{allSingers.length}}  lyrics: {{allLyrics.length}}
    </div>

    <div class="row">
      <mu-raised-button label="备份歌词" class="demo-raised-button" secondary @click="backupLyric" />
      <mu-raised-button label="恢复歌词" class="demo-raised-button" secondary @click="restoreLyric" />
    </div>

    <div class="info">
      <!-- {{allLyrics[0]}} -->
    </div>

<!--    <div class="row cover-list">
      <span v-for="i in rows" :key="i" class="item" @click="showAlbum(i)">
        <span class="name">{{i.title}}</span>
        <img :src="i.picture" alt="">
      </span>
    </div> -->
  </div>
</template>

<script>
  import {
    mapState
  } from 'vuex'

  // import Worker2 from './a.worker.js'
  export default {
    data() {
      return {
        albumList: [],
        total: 0,
        max: 10000,
        cur: 0,
        repeatCount: 0,
        rows: []
      }
    },
    computed: {
      ...mapState(['lyric', 'musicDirectory', 'allSongs', 'allAlbums', 'allSingers', 'allLyrics', 'lyricMap'])
    },
    mounted() {
      this.db = window.DB;


    },
    methods: {
      restoreLyric() {
        let name = "lyric";
        let self = this;

        callplus('restore', ['lyric.txt'], async (res) => {
          // this.getRestoreList();
          let list = JSON.parse(JSON.parse(res.data));



          this.db.exec(
            `DELETE FROM lyric`
          )

          for (var i = 0; i < list.length; i++) {
            let lyric = list[i];
            let p = [lyric.name, lyric.content]

            await insertLyric(p);
          }

          window.$V.message2(`恢复${list.length}条歌词`);


          function insertLyric(params) {
            return new Promise((r) => {
              self.db.exec(`INSERT INTO lyric (name, content) VALUES( ?,?)`,
              params, (data)=> {
                // window.$V.message2(params[0])
                r();
              });
            })
          }
        })
      },
      backupLyric() {
        let name = "lyric";

        let data = JSON.stringify(this.allLyrics);


        callplus('backup', [data, name], (res) => {
          // this.getRestoreList();
          window.$V.message2(`备份${this.allLyrics.length}条歌词`)
        })
      },
      showAlbum(item) {
        let self = this;
        self.songRows = []
        this.db.transaction(function(tx) {
          tx.executeSql('SELECT * FROM songs WHERE album_id=?', [item.id], function(tx, rs) {


            // alert(rs.rows.length)
            //遍历结果集，对于每一行，依次调用showData来在table上创建对于的html文本
            for (var i = 0; i < rs.rows.length; i++) {
              //对于item(i)，也就是某一行记录，我们显示其内容到页面的表格中（构建对应的HTML片断）
              self.songRows.push(rs.rows.item(i));

            }

            self.$store.commit('setAlbum', {
              list: self.songRows,
              title: item.title
            })

            self.$router.push('/mp3-list')
          });
        })
      },

      clear() {

        this.db.exec('DROP TABLE albums')
        this.db.exec('DROP TABLE songs')
        this.db.exec('DROP TABLE singers')
        // this.db.exec('DROP TABLE lyric')

        // window.location.reload();
      },

      async execute() {


          let self = this;

      console.log(this.lyricMap)
      console.log(this.allSongs)

      // return
          // alert(self.allSongs.length)

          // self.allSongs.forEach(async (item, index)=> {
          //   if (!self.lyricMap[item.filename])
          //   await window.$Player.getLyric(item.filename)
          // });

          for(let i = 0; i < self.allSongs.length; i++) {
            let item = self.allSongs[i];
            self.repeatCount++;
            if (self.lyricMap[item.filename] === undefined)
            await window.$Player.getLyric(item.filename)
          }

      },

      startScan() {
        let self = this;
        try {


          var list = $Mp3List.allList;
          self.total = list.length;

          self.albumList = [];
          self.rows = [];
          self.cur = 0;

          // this.db.exec('DROP TABLE albums')
          // this.db.exec('DROP TABLE songs')
          // this.db.exec('DROP TABLE singers')

          this.db.exec(
            `CREATE TABLE IF NOT EXISTS albums(
                id INTEGER PRIMARY KEY ,
                title TEXT NOT NULL UNIQUE,
                picture TEXT)`
          )
          this.db.exec(
            `CREATE TABLE IF NOT EXISTS songs(
                id INTEGER PRIMARY KEY ,
                album_id INTEGER ,
                singer_id INTEGER,
                title TEXT NOT NULL,
                filename TEXT NOT NULL UNIQUE)`
          )
          this.db.exec(
            `CREATE TABLE IF NOT EXISTS singers(
                id INTEGER PRIMARY KEY ,
                name TEXT)`
          )

          this.db.exec(
            `CREATE TABLE IF NOT EXISTS lyric(
                id INTEGER PRIMARY KEY ,
                name TEXT NOT NULL UNIQUE,
                content TEXT)`
          )

          // if (self.cur >= 20) {
          //   return;
          // }
          // let item = list[self.cur];
          // let song = self.musicDirectory + item.name

          // alert(list.length)

          getSong();

          function next() {
            self.cur++;

            setTimeout(() => {
              getSong();
            }, 100)
          }

          function insertSong(params) {

            self.db.exec(`INSERT INTO songs (album_id, title, filename, singer_id) VALUES( ?,?,?, ?)`,
            params, (data)=> {
              next();
            });
          }


          function getSong() {

          if (self.cur >= self.max) {
            return;
          }
          let item = list[self.cur];

          let find = false;

          for (let i = 0; i < self.allSongs.length; i++) {
            let song = self.allSongs[i];



            if (song.filename === item.name) {
              find = true;
              break;
            }
          }

          if (find) {
            self.cur++;
            self.repeatCount++;

            return getSong();
          }
          let song = self.musicDirectory + item.name

          window.getSongTags(song, (tags) => {
            tags.picture = window.getCover(tags.picture)


            self.db.exec('SELECT id, title FROM albums WHERE title=?', [tags.album], (album) => {



                function checkSinger(params) {
                  self.db.exec('SELECT id, name FROM singers WHERE name=?', [tags.artist], (singer) => {

                    if (singer.length) {
                      params[3] = singer[0].id;
                      insertSong(params)
                    } else {
                      self.db.exec(`INSERT INTO singers (name) VALUES( ?)`,
                        [tags.artist], (data) => {
                          self.db.exec(`select last_insert_rowid() as id from singers`, [], (data) => {
                            params[3] = data[0].id;
                            insertSong(params)

                          })
                        });
                    }
                 });
                }
                let params = [null, tags.title, item.name, null]

                if (album.length) {
                  params[0] = album[0].id;


                  checkSinger(params)
                } else {

                  self.db.exec(`INSERT INTO albums (title, picture) VALUES( ?,?)`,
                    [tags.album, tags.picture], (data) => {
                      self.db.exec(`select last_insert_rowid() as id from albums`, [], (data) => {
                        params[0] = data[0].id;
                        checkSinger(params)

                      })
                    });

                }



            })
          })

          }

        } catch (e) {
          alert(e)
        }
      },
     }
  }
</script>

<style lang='scss'>
  .scan {
    padding: 12px;
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
