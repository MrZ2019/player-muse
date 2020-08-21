<template>
  <div class="scan">
    <div class="row">
      <mu-raised-button label="开始扫描" class="demo-raised-button" secondary @click="startScan" />
    </div>
    <div class="row progress">
      {{cur}} / {{total}}
    </div>
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

  // import Worker2 from './a.worker.js'
  export default {
    data() {
      return {
        albumList: [],
        total: 0,
        cur: 0,
        rows: []
      }
    },
    computed: {
      ...mapState(['lyric', 'musicDirectory'])
    },
    mounted() {
      this.db = window.DB;
    },
    methods: {
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

            console.log(self.songRows)
            self.$store.commit('setAlbum', {
              list: self.songRows,
              title: item.title
            })

            self.$router.push('/mp3-list')
          });
        })
      },

      startScan() {
        let self = this;
        try {


          var list = $Mp3List.allList;
          self.total = list.length;

          self.albumList = [];
          self.rows = [];
          self.cur = 0;

          this.db.exec('DROP TABLE albums')
          this.db.exec('DROP TABLE songs')

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
                singer TEXT,
                title TEXT NOT NULL,
                filename TEXT NOT NULL UNIQUE)`
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

            self.db.exec(`INSERT INTO songs (album_id, title, filename, singer) VALUES( ?,?,?, ?)`,
            params, (data)=> {
              next();
            });
          }

          function getSong() {

          // if (self.cur >= 20) {
          //   return;
          // }
          let item = list[self.cur];
          let song = self.musicDirectory + item.name

          window.getSongTags(song, (tags) => {
            tags.picture = window.getCover(tags.picture)


            self.db.exec('SELECT id, title FROM albums WHERE title=?', [tags.album], (data) => {
              let params = [null, tags.title, item.name, tags.artist]
              if (data.length) {
                params[0] = data[0].id;
                insertSong(params)
              } else {

                self.db.exec(`INSERT INTO albums (title, picture) VALUES( ?,?)`,
                  [tags.album, tags.picture], (data) => {
                    self.db.exec(`select last_insert_rowid() as id from albums`, [], (data) => {
                      params[0] = data[0].id;
                      insertSong(params)
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
      startScan2() {
        let self = this;
        var db = this.db;
        try {


          var list = $Mp3List.allList;
          self.total = list.length;

          self.albumList = [];
          self.rows = [];
          self.cur = 0;



          //首先它创建一个数据库表，里面有3个字段
          db.transaction(function(tx) {
            // tx.executeSql(
            //   `DROP TABLE album3`,
            //   [], (tx, res) => {
            //     // alert('ok')
            //   }, (tx, error) => {
            //     alert(error.message)
            //   });
            // tx.executeSql(
            //   `DROP TABLE songs`,
            //   [], (tx, res) => {
            //     // alert('ok')
            //   }, (tx, error) => {
            //     alert(error.message)
            //   });

            tx.executeSql(
              `CREATE TABLE IF NOT EXISTS album3(
                id INTEGER PRIMARY KEY ,
                title TEXT NOT NULL UNIQUE,
                picture TEXT,
                time INTEGER)`,
              [], (tx, res) => {
                // alert('ok')
              }, (tx, error) => {
                // alert(error.message)
              });
            tx.executeSql(
              `CREATE TABLE IF NOT EXISTS songs(
                id INTEGER PRIMARY KEY ,
                album_id INT ,
                singer TEXT,
                title TEXT NOT NULL,
                filename TEXT NOT NULL UNIQUE)
              `,
              [], (tx, res) => {
                // alert('ok')
              }, (tx, error) => {
                alert(error.message)
              });

          }, );

          // getSong();
          getData();
        } catch (e) {
          alert(e)
        }


        function getData() {
          db.transaction(function(tx) {
            tx.executeSql('SELECT * FROM album3', [], function(tx, rs) {


              // alert(rs.rows.length)
              //遍历结果集，对于每一行，依次调用showData来在table上创建对于的html文本
              for (var i = 0; i < rs.rows.length; i++) {
                //对于item(i)，也就是某一行记录，我们显示其内容到页面的表格中（构建对应的HTML片断）
                self.rows.push(rs.rows.item(i));
              }
            });
          })
        }
        // for (let i = 0; i < 10; i++) {



        function getSong() {

          if (self.cur >= 20) {
            return;
          }
          let item = list[self.cur];
          let song = self.musicDirectory + item.name
          // self.$worker.run(()=> {

          // setTimeout(() => {
          window.getSongTags(song, (tags) => {

            let newItem = {
              album: tags.album,
              cover: window.getCover(tags.picture)
            }
            self.albumList.push(newItem)

            db.transaction(function(tx) {
              tx.executeSql(`SELECT id, title FROM album3 WHERE title=?`, [newItem.album], function(tx, rs) {

                  let params = [null, tags.title, item.name, tags.artist]
                  if (rs.rows.length) {
                    console.log('找到专辑----------')

                    console.log(rs.rows.item(0));
                    params[0] = rs.rows.item(0).id;

                    insertSong(tx, params)
                  } else {
                    console.log('没有找到专辑')

                    tx.executeSql(`INSERT INTO album3 (title, picture, time) VALUES( ?,?,?)`, [newItem.album,
                        newItem.cover,
                        "datetime('now')"
                      ], function(tx, rs) {
                        console.log("成功保存数据!" + newItem.album);
                        tx.executeSql(`select last_insert_rowid() as id from album3`, [], function(tx, rs) {
                          console.log(rs.rows.item(0).id);
                          params[0] = rs.rows.item(0).id;

                          insertSong(tx, params)
                        }, function(tx, error) {
                          console.log(error.source + "::" + error.message + ' ' + newItem.album);
                        });



                        // next();
                      },
                      //插入失败的回调就是在控制台上输入一行错误日志
                      function(tx, error) {
                        console.log(error.source + "::" + error.message + ' ');

                        // next();
                      });
                  }

                  // next();
                },
                //插入失败的回调就是在控制台上输入一行错误日志
                function(tx, error) {
                  console.log(error.source + "::" + error.message);

                  next();
                });



            })



          })

          function next() {
            self.cur++;
            // self.$forceUpdate();

            setTimeout(() => {
              getSong();
            }, 100)
          }

          function insertSong(tx, params) {
            tx.executeSql(`INSERT INTO songs (album_id, title, filename, singer) VALUES( ?,?,?, ?)`, params, function(
              tx, rs) {
              console.log('插入成功 ' + params[2])

              next();
            }, function(tx, error) {
              console.log(error.source + "::" + error.message);
            })
          }
          // }, 100);
        }


        //   return sum;
        // }).then((res)=> {
        //   self.cur = res;
        // })


        // }


        // let worker = new Worker2()
        // worker.onmessage=function(event){
        //     self.cur = event.data;
        // };




      }
    }
  }
</script>

<style lang='scss'>
  .scan {
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
