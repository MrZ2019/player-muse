<template>
  <div class="container">

    <mu-text-field placeholder="" full-width v-model="search" class="inp-search" v-show="!isSingerMode && !isAlbumMode" />

    <div class="singer" v-show="isSingerMode">
      <span class="text">当前歌手: </span>
      <span class="value">{{curSinger}}</span>

      <mu-flat-button @click="backList" primary label="返回" />
    </div>
    <div class="singer" v-show="isAlbumMode">
      <span class="text">当前专辑: </span>
      <span class="value">{{curAlbum.title}}</span>

      <mu-flat-button @click="backList" primary label="返回" v-show="isFromList" />
    </div>

    <mu-list ref="mp3List" @scroll.native="onScroll">
      <draggable :list="playlist" :disabled="!isSortMode" class="list-group" ghost-class="ghost"
        @start="dragging = true" @end="onDragEnd">
        <mu-list-item v-for="(i,index) in mp3list" :class="{active: curIndex == index}">

          <span class="title" @click="play(i.name, index)">{{i.name}}
          </span>



          <mu-icon value="star" class="star" color="yellow" v-show="i.favorited" />

          <mu-icon-menu icon="more_vert" slot="right" @click.native="onOpen" :open="menuOpen">
            <mu-menu-item title="收藏1" @click.native="favorite(i)" />
            <mu-menu-item title="重新播放" @click.native="play(i.name, index, false, true)" />
            <mu-menu-item title="添加到列表" @click.native="showPlayList(i)" />
            <mu-menu-item title="进入歌手页" @click.native="goSinger(i)" />
            <mu-menu-item title="进入专辑页" @click.native="goAlbum(i)" />
            <mu-menu-item title="删除" @click.native="removeSong(index)" />
          </mu-icon-menu>
        </mu-list-item>

        <!-- 		 <mu-list-item v-for="i in 100" :class="{active: curIndex == i}"
		 @click="onClick(i)">{{i}}</mu-list-item>  -->

      </draggable>

    </mu-list>

    <div class="cover-box">
      <div class="top-box">
        <img :src="cover" alt="" @click="openCover" class="rotate" :class="{paused: isPause}">
        <mu-icon :size="36" :color="iconColor" :value="playIcon" @click="togglePlay" v-show="curIndex !== -1 || isPlay"></mu-icon>
        <mu-icon :size="28" :color="iconColor" value="child_care" @click="locate" v-show="curIndex !== -1"></mu-icon>
      </div>
      <div class="right-box">
        <div class="curr">{{curr}}</div>
        <mu-slider class="demo-slider" v-model="linear" @change="onSliderChange" :max="max" color='yellow'></mu-slider>
        <div class="total">{{total}}</div>
      </div>
    </div>

    <DlgPlayList ref="dlgPlayList"></DlgPlayList>


    <mu-dialog width="360" transition="slide-bottom" :open="openFullscreen" @close="close">
      <div class="title">{{albumTitle}} - {{tags.artist}}</div>
      <div class="big-cover-box">
        <img :src="cover" alt="">
      </div>
    </mu-dialog>
  </div>
</template>

<script>
  import DlgPlayList from './playlist';
  import draggable from "vuedraggable";
  import {
    mapState
  } from 'vuex'

  export default {
    beforeRouteEnter(from, to, next) {
      next((vm) => {
        vm.$refs.mp3List.$el.scrollTop = window.mp3ListScrollTop
      })


    },
    data() {
      return {

        list: [],
        allList: [],


        curIndex: -1,

        menuOpen: false,

        favoriteList: [],
        cover: '',
        albumTitle: '',
        tags: {},
        search: '',

        linear: 50,

        total: '',
        max: 100,
        curr: '',
        openFullscreen: false,
        playIcon: 'play_arrow',
        iconColor: '',
        isPlay: false,
        dragging: false,
        enabled: true,
        lastTags: {},
      }
    },
    watch: {
      search(val) {
        // let _this = this;
        try {


          let list = this.allList.filter((item) => {
            return item.name.indexOf(val) !== -1;
          })

          this.playlistFilter = list;

        } catch (e) {
          alert(e)
        }

      }
    },
    computed: {
      ...mapState(['isAll', 'isSortMode', 'musicDirectory', 'isSingerMode', 'isAlbumMode', 'curSinger', 'curAlbum',
        'isFromList', 'playlist', 'groupList', 'curGroupIndex'
      ]),
      // curPlayList() {

      // },
      mp3list() {
        this.curIndex = -1;

        if (this.$store.state.isSingerMode) {
          return this.$store.state.singerSongs;
        }

        if (this.$store.state.isAlbumMode) {
          return this.$store.state.curAlbum.list;
        }
        if (this.$store.state.curListIndex === -1) {

          if (this.isAll) {

            if (this.search) {

              return this.playlistFilter;
            }
            return this.allList.slice(0, 50);
          }
          return this.list
        } else {
          let list;
          if(this.curGroupIndex === 0) {
            list = this.playlist
          } else {
            list = this.groupList[this.curGroupIndex].playlist;
          }
          return list[this.$store.state.curListIndex].list;
        }
      }
    },
    components: {
      DlgPlayList,
      draggable
    },
    mounted() {
      this.iconColor = localStorage.getItem('background')

      // alert(this.iconColor)
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

      // self.$router.push('/scan')

      setTimeout(function() {

        self.refreshList()

        callplus('getFavorite', [], function(set) {
          self.favoriteList = set.data;
        })
      }, 1000)




    },
    filters: {
      limit(list) {
        return list.slice(0, 50)
      },
    },
    methods: {

      backList() {
        this.$store.state.isSingerMode = false;
        this.$store.state.isAlbumMode = false;
        let val = window.mp3ListScrollTopSinger
        this.$nextTick(() => {
          this.$refs.mp3List.$el.scrollTop = val
        })
      },
      goSinger(i) {
        window.mp3ListScrollTopSinger = this.$refs.mp3List.$el.scrollTop
        window.getSongTags(this.musicDirectory + i.name, (tags) => {
          this.lastTags = tags;

          this.$store.commit('getSinger', tags.artist)
        })
      },
      goAlbum(i) {
        this.$store.state.isFromList = true
        window.mp3ListScrollTopSinger = this.$refs.mp3List.$el.scrollTop
        window.getSongTags(this.musicDirectory + i.name, (tags) => {
          this.lastTags = tags;

          this.$store.commit('getAlbum', tags.album)
        })
      },
      onDragEnd() {
        this.dragging = false;

        this.$store.commit('savePlayList')
      },
      togglePlay() {
        this.play(this.name, this.curIndex);

      },
      locate() {
        this.$refs.mp3List.$el.querySelector('.active').scrollIntoView()
      },
      close() {
        this.openFullscreen = false;
      },
      openCover() {
        this.openFullscreen = true;
      },
      onSliderChange(isStart) {
        this.linear = parseInt(this.linear - 0);
        // alert(this.linear)
        // clearTimeout(this.startSlideHandle);

        this.startSlideHandle = setTimeout(() => {
          if (isStart !== true)
          callplus('seek', [this.linear], function(data) {})


          this.startSlide();
        }, 1000)

      },
      startSlide() {
        this.stopSlide();
        this.sliderHandle = setInterval(() => {
          this.linear += 1;

          this.curr = window.formatTime(this.linear);

          if (this.curr === this.total) {
            this.stopSlide();
            this.isPause = true;
            this.linear = 0;
            this.curr = window.formatTime(this.linear);
            this.playIcon = 'play_arrow'

          }
        }, 1000)
      },
      stopSlide() {
        clearInterval(this.sliderHandle);
      },
      onScroll($event) {
        var el = $event.target;

        window.mp3ListScrollTop = el.scrollTop;
      },
      removePlayList(item) {
        this.$refs.dlgPlayList.showDialog(item.name);
      },
      showPlayList(item) {
        this.$refs.dlgPlayList.showDialog(item.name);
      },
      removeSong(index) {
        this.$store.commit('removeSong', index);
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
        let self = this;
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

          self.$nextTick(()=> {
            self.$refs.mp3List.$el.scrollTop = 0;
          })
        })
      },
      onOpen($event) {
        this.menuOpen = false;
        // $event.stopPropagation();
      },
      onClick(index) {
        this.curIndex = index
      },
      play(name, index, isFromStart, isReplay) {
        let self = this;
        if (!isReplay && index == this.curIndex && this.name == name) {

          if (this.isPause) {
            callplus('resume', [], function(isPaused) {})
            this.isPause = false;
            this.startSlide();
          } else {
            callplus('pause', [], function(isPaused) {})

            this.isPause = true;
            this.stopSlide();

          }

          this.playIcon = this.isPause ? 'play_arrow' : 'pause_arrow';
          return
        }



        self.isPlay = true;
        this.isPause = false;
        this.playIcon = this.isPause ? 'play_arrow' : 'pause_arrow';
        this.curIndex = index;
        this.name = name;
        var p = self.musicDirectory + name
        callplus('play', [self.musicDirectory + name, isFromStart], function(data) {
          let s = data.data.length;
          self.max = Math.ceil(s);
          self.linear = data.data.pos - 0;

          self.total = window.formatTime(s);

          self.onSliderChange(true)

          // alert()
        })

        try {
          let song = name.split('-');

          if (song[1]) {
            song = song[1].trim();
            let index = song.indexOf('.');
            song = song.slice(0, index)
          }


          this.$axios.get(this.$apis.lyric + song).then((res) => {
            res = res.data;
            if (res.result[0]) {
              let s = res.result[0].lrc;

              let index = s.indexOf('/lrc/')

              let lrc = s.slice(index + 4);


              this.$axios.get(this.$apis.lrc + lrc).then((res) => {

                this.$store.commit('setLyric', res.data)
              }).catch((e) => {
                // alert(e)
              })

            }
          }).catch((e) => {
            // alert(e)
          })
        } catch (e) {
          alert(e)
        }

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
              self.tags = tags;
              self.albumTitle = tags.title;
              var image = tags.picture;
              if (image) {
                let base64 = window.getCover(image)
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


  .right-box {
    display: flex;

  }

  .container {
    position: fixed;
    top: 0;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;

    .top-box {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    .mu-list {
      min-height: 60%;
      max-height: 60%;
    }

    .inp-search,
    .singer {
      margin-top: 64px;
    }

    .singer {
      padding: 0 0 0 16px;
    }

    .cover-box {
      flex: 1;
      background-color: #fff;
      padding: 32px;

      img {
        max-height: 100%;
        max-width: 100%;
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
    }
  }

  .big-cover-box img {
    width: 100%;
  }

  @keyframes rotate {
    from {
      transform: rotateZ(0deg);
    }
    to {
      transform: rotateZ(359deg);
    }
  }
  .rotate {
    animation: rotate 7s infinite;
    animation-timing-function: linear;
    // border: 2px solid;
  }

  .rotate.paused {
    animation-play-state:paused;
  }
</style>
