<template>
  <div class="container">
    <mu-list>
      <mu-list-item v-for="(i,index) in playlist" :class="{active: curIndex == index}">

        <span class="title" @click="play(i.name, index)">{{i.name}}
        </span>



        <mu-icon value="star" class="star" color="yellow" v-show="i.favorited" />

        <mu-icon-menu icon="more_vert" slot="right" @click.native="onOpen" :open="menuOpen">
          <mu-menu-item title="收藏1" @click.native="favorite(i)" />
          <mu-menu-item title="添加到列表"  @click.native="showPlayList(i)"/>

          <mu-menu-item title="菜单 3" />
        </mu-icon-menu>
      </mu-list-item>

      <!-- 		 <mu-list-item v-for="i in 100" :class="{active: curIndex == i}"
		 @click="onClick(i)">{{i}}</mu-list-item>  -->



    </mu-list>

    <div class="cover-box">
      <img :src="cover" alt="">
    </div>

    <DlgPlayList ref="dlgPlayList"></DlgPlayList>
  </div>
</template>

<script>

  import DlgPlayList from './playlist';


  export default {
    data() {
      return {
        list: [],
        musicDirectory: '/storage/emulated/0/netease/cloudmusic/music/',

        curIndex: -1,

        menuOpen: false,

        favoriteList: [],
        cover: ''
      }
    },
    computed: {
      playlist() {

        if (this.$store.state.curListIndex === -1) {
          return this.list
        } else {
          return this.$store.state.playlist[this.$store.state.curListIndex].list;
        }
      }
    },
    components: {DlgPlayList},
    mounted() {

      window.Hub.$on('refresh', function() {
        self.refreshList()
      })
      window.Hub.$on('play-music', function() {
        self.refreshList()
      })
      if (window.player) {
        player.stop()
      }
      let self = this
      window.$Mp3List = self
      setTimeout(function() {

        self.refreshList()

        callplus('getFavorite', [], function(set) {
          self.favoriteList = set.data;
        })
      }, 1000)




    },

    methods: {
      removePlayList(item) {
        this.$refs.dlgPlayList.showDialog(item.name);
      },
      showPlayList(item) {
        this.$refs.dlgPlayList.showDialog(item.name);
      },
      favorite(item) {
        this.favoriteList.push(item.name);

        this.saveFavorite();
      },

      saveFavorite() {

        callplus('saveFavorite', [this.favoriteList], function() {
          window.Hub.$emit('star-getFavorite')
        })
      },
      refreshList: function() {
        callplus('getList', {
          url: self.musicDirectory
        }, function(data) {
          // alert(data.length)

          self.list = data

          for (var i = 0; i < self.list.length; i++) {
            var item = self.list[i];

            if (this.favoriteList.indexOf(item) !== -1) {
              item.favorited = true;
            }
          }
        })
      },
      onOpen($event) {
        this.menuOpen = false;
        // $event.stopPropagation();
      },
      onClick(index) {
        this.curIndex = index
      },
      play(name, index, isFromStart) {
        let self = this;
        if (index == this.curIndex) {

          if (this.isPause) {
            callplus('resume', [], function(isPaused) {})
            this.isPause = false;
          } else {
            callplus('pause', [], function(isPaused) {})

            this.isPause = true;

          }

          return
        }



        self.isPlay = true;
        this.curIndex = index;
        var p = self.musicDirectory + name
          callplus('play', [self.musicDirectory + name, isFromStart], function(data) {

          })
        callplus('getCover', [p], function(res) {
          displayCover(res.data)


        })

        function displayCover(str) {
          let arr = str.split(',');
          let data = window.atob(arr[1])
          let mime = arr[0].match(/:(.*?);/)[1]
          let ia = new Uint8Array(data.length)
          for (var i = 0; i < data.length; i++) {
            ia[i] = data.charCodeAt(i)
          }
          var blob = new Blob([ia], {
            type: mime
          })

          try {
            let url = name;
            ID3.loadTags(url, function() {
              var tags = ID3.getAllTags(url);
              var image = tags.picture;
              if (image) {
                var base64String = "";
                for (var i = 0; i < image.data.length; i++) {
                  base64String += String.fromCharCode(image.data[i]);
                }

                var base64 = "data:" + image.format + ";base64," + window.btoa(
                  base64String);
                self.cover = base64;
              }
            }, {
              tags: ["title", "artist", "album", "picture"],
              dataReader: ID3.FileAPIReader(new window.File([blob], name, {
                // type: file.type
              }))
            });
          } catch (e) {
            alert(e)
          }
        }


      }
    }
  }
</script>

<style lang='scss'>
  .active .mu-item {
    background: #ccc;
    color: #fff;
  }

  .title {
    text-overflow: ellipsis;
    min-width: 70%;
    max-width: 90%;
    display: -webkit-inline-box;
    -webkit-line-clamp: 1;
    overflow: hidden;
    -webkit-box-orient: vertical;
  }

  .mu-list .mu-item {
    position: relative;
  }

  .mu-list .mu-menu {
    display: inline-block;
  }

  .mu-item .star {
    float: right;
    margin-top: -5px;
  }


  .container {
    position: fixed;
    top: 0;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;

    .mu-list {
      min-height: 60%;
      max-height: 60%;
    }

    .cover-box {
      flex: 1;
      background-color: #fff;
      padding: 32px;

      img {
        max-height: 100%;
        max-width: 100%;
      }
    }
  }
</style>
