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

          <mu-checkbox name="group" :nativeValue="index" v-model="checkList" label="" class="demo-checkbox" v-show="isMultiMode"/>

          <span class="title" @click="play(i.name, index)">{{i.name}}
          </span>



          <mu-icon value="star" class="star" color="yellow" v-show="i.favorited" />

          <mu-icon-menu icon="more_vert" slot="right" @click.native="onOpen" :open="menuOpen">
            <mu-menu-item title="收藏1" @click.native="favorite(i)" />
            <mu-menu-item title="重新播放" @click.native="play(i.name, index, false, true)" />
            <mu-menu-item title="添加到列表" @click.native="showPlayList(i)" />
            <mu-menu-item title="进入歌手页" @click.native="goSinger(i)" />
            <mu-menu-item title="进入专辑页" @click.native="goAlbum(i)" />
            <mu-menu-item title="删除" @click.native="removeSong(i.name)" />
          </mu-icon-menu>
        </mu-list-item>

        <!-- 		 <mu-list-item v-for="i in 100" :class="{active: curIndex == i}"
		 @click="onClick(i)">{{i}}</mu-list-item>  -->

      </draggable>

    </mu-list>

    <DlgPlayList ref="dlgPlayList"></DlgPlayList>

    <player ref="myplayer"></player>

  </div>
</template>

<script>
  import DlgPlayList from './playlist';
  import player from './player';
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

        isPlay: false,
        dragging: false,
        enabled: true,
        lastTags: {},
        checkList: [],


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
      ...mapState(['isAll', 'isSortMode', 'isMultiMode', 'musicDirectory', 'isSingerMode', 'isAlbumMode', 'curSinger', 'curAlbum',
        'isFromList', 'playlist', 'groupList', 'curGroupIndex', 'settings'
      ]),
      // curPlayList() {

      // },
      iconColor() {
        return this.$parent.themeColor;
      },
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
      },


    },
    components: {
      DlgPlayList,
      draggable,
      player
    },
    mounted() {

      this.iconColor = window.theme;

      // alert(this.iconColor)
      window.Hub.$on('refresh', function() {
        self.refreshList()
      })
      window.Hub.$on('play-music', function() {
        self.refreshList()
      })
      window.Hub.$on('multiAdd', function() {
        self.multiAdd();
      })
      if (window.player) {
        player.stop()
      }
      let self = this
      window.$Mp3List = this

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
 multiDelete() {

        let nameList = [];

        for (let index = 0; index < this.checkList.length; index++) {
          const element = this.checkList[index];

          nameList.push(this.mp3list[element]);
        }

        for (let index = 0; index < nameList.length; index++) {
          const element = nameList[index];


          this.removeSong(element.name);

        }

        this.checkList = [];
      },

      multiAdd() {

        // alert(12345)
        let nameList = [];

        for (let index = 0; index < this.checkList.length; index++) {
          const element = this.checkList[index];

          nameList.push(this.mp3list[element]);
        }

        this.$refs.dlgPlayList.showDialog(nameList, true)
      },
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
      removeSong(name) {
        this.$store.commit('removeSong', name);
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
      rankHandle() {
        this.curSongTimer++;

        if (this.curSongTimer >= this.settings.rankTimeout) {
          this.stopRankTimer();
        }
      },
      startRankTimer() {
        this.curSongTimer = 0;
        this.rankTimer = setInterval(this.rankHandle, 1000)
        this.isRankTimerStop = false;
      },
      resumeRankTimer() {
        this.rankTimer = setInterval(this.rankHandle, 1000)
      },
      pauseRankTimer() {
        clearInterval(this.rankTimer);
      },
      stopRankTimer() {
        clearInterval(this.rankTimer);
        this.isRankTimerStop = true;

        if (this.curSongTimer >= this.settings.rankTimeout) {
          this.$store.commit('addRank', {name: this.name})
        }

        this.curSongTimer = 0;
      },
      play(name, index, isFromStart, isReplay) {

        this.curIndex = index;
        this.$refs.myplayer.play.apply(this.$refs.myplayer, arguments)

      }
    }
  }
</script>

<style lang='scss'>
  .active .mu-item {
    background: #ccc;
    color: #fff;
  }

  .demo-checkbox {
    display: inline-block;
    vertical-align: middle;
  }

  .title {
    // display: inline-block;
    vertical-align: middle;

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
    display: flex;
    align-items: center;
  }

  .mu-list .mu-menu {
    display: inline-block;

  }

  .mu-list .mu-icon-menu {
    position: relative;
    top: 1px;
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
    }


</style>
