<template>
  <mu-list>
    <mu-list-item v-for="(i,index) in list" :class="{active: curIndex == index}">

      <span class="title" @click="play(i, index)">{{i}}
      </span>



      <mu-icon value="star" class="star" color="yellow" v-show="i.favorited" />

      <mu-icon-menu icon="more_vert" slot="right" @click.native="onOpen" :open="menuOpen">
        <mu-menu-item title="取消收藏" @click.native="unfavorite(i)" />
        <mu-menu-item title="菜单 2" />
      </mu-icon-menu>
    </mu-list-item>

    <!-- 		 <mu-list-item v-for="i in 100" :class="{active: curIndex == i}"
		 @click="onClick(i)">{{i}}</mu-list-item>  -->



  </mu-list>
</template>

<script>
  export default {
    data() {
      return {
        list: [],
        musicDirectory: '/storage/emulated/0/netease/cloudmusic/music/',

        curIndex: -1,

        menuOpen: false,

        favoriteList: [],
      }
    },

    mounted() {
      
      window.Hub.$on('star-getFavorite', function() {
        self.getFavorite()
      })

      window.Hub.$on('play-music', function() {
        self.refreshList()
      })
      if (window.player) {
        player.stop()
      }
      let self = this
      window.$StarList = self
      setTimeout(() => {


        this.getFavorite()
      }, 1000)




    },

    methods: {
      unfavorite(item) {
        var index = this.favoriteList.indexOf(item);
        this.favoriteList.splice(index, 1)
        this.saveFavorite();
      },
      getFavorite() {
        callplus('getFavorite', [], (set) => {
          this.favoriteList = this.list = set.data
        })
      },
      saveFavorite() {
        callplus('saveFavorite', [this.favoriteList], () => {
          this.getFavorite();
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

        callplus('play', [self.musicDirectory + name, isFromStart], function(data) {

        })

        self.isPlay = true;
        this.curIndex = index;


      }
    }
  }
</script>

<style>
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
</style>
