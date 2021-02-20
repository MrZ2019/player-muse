<template>
  <div id="app">
    <div class="image-box" :style="{'backgroundImage': 'url(' + imageData + ')', opacity: bgOpacity}">

    </div>
    <mu-appbar :title="appTitle" :style="styleObj">
      <mu-icon-button icon="menu" slot="left" @click.native="open = true" />
      <mu-icon-button icon="title" slot="right" @click.native="goLyric" v-show="!isAlbumView" />
      <mu-icon-button icon="refresh" slot="right"  @click='refresh' v-show="!isStar && !isAlbumView && !isRankView"/>
      <mu-icon-button icon="list" slot="right"  @click='backList' v-show="!isMainView"/>
      <mu-icon-button :icon="icon" slot="right"  @click='goStar'/>
      <mu-icon-menu icon="more_vert" slot="right">
        <mu-menu-item title="主题色" @click.native="openPicker"/>
        <mu-menu-item title="主题背景" @click.native="openGallery"/>
        <mu-menu-item title="新建列表"  @click.native="createList"/>
        <mu-menu-item title="新建组"  @click.native="createListGroup"/>
        <mu-menu-item title="切换组"  @click.native="changeGroup"/>
        <mu-menu-item title="移动当前列表"  @click.native="movePlayList" v-show="curListIndex !== -1"/>
        <mu-menu-item title="删除当前列表"  @click.native="removePlayList" v-show="curListIndex !== -1"/>
        <mu-menu-item title="重命名当前列表"  @click.native="renamePlayList" v-show="curListIndex !== -1"/>
        <mu-menu-item title="排序模式"   @click.native="goSort" v-show="!isSortMode" />
        <mu-menu-item title="批量模式"   @click.native="goMulti" v-show="!isMultiMode" />
        <mu-menu-item title="批量删除"   @click.native="multiDelete" v-show="isMultiMode" />
        <mu-menu-item title="批量添加"   @click.native="multiAdd" v-show="isMultiMode" />
        <mu-menu-item title="退出排序模式"   @click.native="leaveSort" v-show="isSortMode" />
        <mu-menu-item title="退出批量模式"   @click.native="leaveMulti" v-show="isMultiMode" />
        <mu-menu-item title="设置"  @click.native="openSettings"/>
        <mu-menu-item title="刷新"  @click.native="reload"/>
        <mu-menu-item title="备份与恢复"  @click.native="showBackup"/>
        <mu-menu-item title="专辑视图"  @click.native="openAlbum"/>
        <mu-menu-item title="听歌排行"  @click.native="openRank"/>
        <mu-menu-item title="退出" @click.native="quit" />
      </mu-icon-menu>
    </mu-appbar>

    <div class="main-slot">

      <keep-alive>
      <router-view></router-view>
      </keep-alive>

    </div>

    <mu-toast v-if="toast" :message="message" @close="hideToast"/>

    <mu-drawer :open="open" :docked="docked" @close="toggle()">
      <mu-list @itemClick="docked ? '' : toggle()">
         <mu-list-item >当前分组: <b>{{groupList[curGroupIndex].name}}</b></mu-list-item >
        <mu-list-item  @click.native="changeListToAll()" >全部歌曲</mu-list-item >
        <!-- <mu-list-item  @click.native="changeListToAllRandom()" >全部歌曲(随机)</mu-list-item > -->
        <mu-list-item v-for="(item, index) in curPlayList" @click="changeList(index, item)" v-if="item">{{item.name}}<span class="counter" v-if="settings.displayCounter">({{item.list.length}})</span></mu-list-item>
        <mu-list-item v-if="docked" @click.native="open = false" title="Close"/>
      </mu-list>
    </mu-drawer>

    <mu-dialog :open="dialog" title="主题色" @close="closePicker">
         <mu-checkbox label="背景图片主色" v-model="isFollowImage"/>
        <picker  v-model="colors"></picker>

       <mu-flex class="row" style="margin: 8px 0">
         <mu-raised-button label="清空背景" class="demo-raised-button" primary @click="clearBg"/>
       </mu-flex>


        <mu-flat-button slot="actions" @click="closePicker" primary label="取消"/>
        <mu-flat-button slot="actions" primary @click="confirmPicker" label="确定"/>
      </mu-dialog>


      <DlgAddPlayList ref="dlgAddPlayList"></DlgAddPlayList>
      <DlgAddListGroup ref="dlgAddListGroup"></DlgAddListGroup>
      <DlgSettings ref="dlgSettings"></DlgSettings>
      <DlgGroupList ref="dlgGroupList"></DlgGroupList>
      <DlgBackup ref="dlgBackup"></DlgBackup>

      <canvas id="myCanvas"></canvas>
      <img id="imgs" src="" width='100'></img>
  </div>


</template>
<script>

import {mapState, mapMutations} from 'vuex'
import Compact from 'vue-color/src/components/Compact';

import DlgAddPlayList from './components/dialog/DlgAddPlayList'
import DlgAddListGroup from './components/dialog/DlgAddListGroup'
import DlgSettings from './components/dialog/DlgSettings'
import DlgGroupList from './components/dialog/DlgGroupList'
import DlgBackup from './components/dialog/DlgBackup'
export default {
  name: 'App',
  data() {
    return {
      docked: false,
      open: false,
      icon: 'star',
      isStar: false,
      dialog: false,
      colors: [],
      styleObj: {
        background: ''
      },
      isFollowImage: false,
      imageColor: '',
      curList: {list: []},
      message: '',
      toast: false,

      // themeColor: '',
    }
  },
  computed: {
      ...mapState(['playlist', 'curListIndex', 'isSortMode', 'isMultiMode', 'settings', 'groupList', 'curGroupIndex', 'imageData', 'bgOpacity']
      ),
      appTitle() {
        if (this.$store.state.curListIndex === -1) {
          return this.listName;
        } else {
          return this.listName + '(' + this.curList.list.length + ')';
        }
      },
      curPlayList() {
        if(this.curGroupIndex === 0) {
          return this.playlist
        } else {
          return this.groupList[this.curGroupIndex].playlist;
        }
      },
      listName() {
        if (this.$store.state.isAlbumMode) {
          return this.$store.state.curAlbum.title;
        }
        if (this.$store.state.curListIndex === -1) {
          return '全部歌曲'
        } else {
          return this.curPlayList[this.$store.state.curListIndex].name;
        }
      },

      isAlbumView() {
        return this.$route.path == '/album';
      },

      isMainView() {
        return this.$route.path == '/mp3-list' || this.$route.path == '/'  ;
      },

      isRankView() {
        return this.$route.path == '/rank';
      },


      themeColor() {

        return  this.settings.isFollowImage ? this.imageColor: this.colors.hex;
      },
      theme() {

        var color = this.imageColor;
         color = this.settings.isFollowImage ? this.imageColor: this.colors.hex;

        window.theme = color;
        return (
        `.mu-slider-fill
        {
          background: ${color} !important;
        }



        .mu-slider-thumb {
          color: ${color} !important;
          background: ${color} !important;
        }

        .mu-flat-button-primary {
           color: ${color} !important;
        }

        .lyric .active {
           color: ${color} !important;
        }

        .mu-raised-button {
          background: ${color} !important;
        }

        .mu-switch-thumb {
          color: ${color} !important;
          background: ${color} !important;
        }

        .mu-switch-track {
          background: ${color} !important;
          opacity: .5;
        }

        .mu-checkbox-icon-checked {
          color: ${color} !important;
        }
        `)
      },
  },
  watch: {
    '$route.path'(newVal, oldVal) {
      if(newVal !== '/star') {
        this.icon = 'star_outline'
        this.isStar = false;
      } else {
        this.icon = 'star';
        this.isStar = true
      }
    },

    theme: {
      deep: true,
      immediate: true,
    },

    isFollowImage(val) {
      this.settings.isFollowImage = val;
      this.$store.commit('saveSettings');

    if (val) {

      if (this.imageColor) {
         this.styleObj.background = this.imageColor;
      } else {

      }

    } else {
      this.styleObj.background = this.bg;
    }
    },

   theme(newVal) {

     document.getElementById('theme').innerHTML = newVal
   },

   colors(newVal) {

     if (!this.settings.isFollowImage)
     this.styleObj.background = newVal.hex;
   },

  },
  components:{
    'picker': Compact,DlgAddPlayList, DlgSettings, DlgAddListGroup, DlgGroupList,DlgBackup,
  },
  mounted() {
    window.$V = this;


    this.$store.commit('getPlayList')
    this.$store.commit('getSettings')

    this.$store.commit('getAllAlbums')
    this.$store.commit('getAllSongs')
    this.$store.commit('getAllSingers')
    this.$store.commit('getAllLyrics')

    this.$store.commit('getGroup')

     this.$store.commit('getImage')
     this.$store.commit('getRank')

    let bg = localStorage.getItem('background');
    let imageColor = localStorage.getItem('imageColor');

    this.imageColor = imageColor;
    this.bg = bg;

    window.settingsBg = bg;

    this.colors = {
      hex: bg,
    }

    this.isFollowImage = this.settings.isFollowImage;

    this.message2('Hello')




  },
  methods: {
    ...mapMutations(['removePlayList', 'renamePlayList']),
    
    clearBg() {
      this.$store.commit('clearImage')
    },
    goSort() {
      this.$store.state.isSortMode = true;
    },
    goMulti() {
      this.$store.state.isMultiMode = true;
    },
    message2(msg, timeout=2000) {
      this.toast = true
      this.message = msg;
      if (this.toastTimer) clearTimeout(this.toastTimer)
      this.toastTimer = setTimeout(() => { this.toast = false }, timeout)
        },
    multiDelete() {
      window.$Mp3List.multiDelete();
    },
    multiAdd() {
      window.Hub.$emit("multiAdd")

    },
    leaveSort() {
      this.$store.state.isSortMode = false;
    },

    leaveMulti() {
      this.$store.state.isMultiMode = false;
    },

    changeListToAll() {
      this.$store.commit('changeList', -1)
      this.$Mp3List.checkList = []
      window.Hub.$emit('clearSearch')
    },
    changeListToAllRandom() {
      this.$store.commit('changeListRandom', -1)
    },
    changeList(index, item) {
      this.curList = item;
      this.$store.commit('changeList', index, item)
      window.$Mp3List.checkList = []
      window.Hub.$emit('clearSearch')
    },
    changeGroup(index, item) {
      this.$refs.dlgGroupList.showDialog()
    },
    movePlayList(index, item) {
      this.$refs.dlgGroupList.showDialog('move-list')
    },

    createList() {
      this.$refs.dlgAddPlayList.showDialog()
    },
    createListGroup() {
      this.$refs.dlgAddListGroup.showDialog()
    },

    openSettings() {
      this.$refs.dlgSettings.showDialog()
    },

    reload() {
      window.location.reload();
    },
    showBackup() {
      this.$refs.dlgBackup.showDialog()
    },
    openAlbum() {
      this.$router.push('/album')
    },
    openRank() {
      this.$router.push('/rank')
    },

    renamePlayList() {
      this.$refs.dlgAddPlayList.showDialog(true)
    },
    openPicker() {
      this.dialog = true;
    },
    openGallery() {
      callplus('gallery', [], (res)=> {
        this.$store.commit('setImage', res.data)

        this.getImageColor();
      })
    },
    getImageColor() {
      var canvas=document.getElementById('myCanvas');

      var img=document.getElementById('imgs');

      img.src = this.imageData;
      img.onload = ()=> {
        let color = window.getImageColor(canvas,img)
        this.imageColor = color;


        localStorage.setItem('imageColor', color)

        this.styleObj.background = color;
      }
    },
    closePicker() {
      this.dialog = false;
    },
    confirmPicker() {
      this.dialog = false;
      // this.styleObj.background = this.colors.hex;



      localStorage.setItem('background', this.colors.hex)

      // this.settings.theme =  this.colors.hex;

      this.$store.commit('saveSettings');

    },
    toggle() {
      this.open = !this.open
    },

    playMusic() {
      if (this.icon == 'tv') {
        this.icon = 'android'
        window.Hub.$emit('play-music')

      }else {
        this.icon = 'tv'
        window.Hub.$emit('stop-music')
      }
    },

    goStar() {
      this.$router.push(this.$route.path == "/star" ?  '/mp3-list' : '/star')
    },

    backList() {
      this.$router.push('/mp3-list')
    },

    goLyric () {
      this.$router.push(this.$route.path == "/lyric" ?  '/' : '/lyric')
    },

    refresh() {
      window.Hub.$emit('refresh')
    },

    quit() {
      callplus("quit")
    },
  }
}

</script>
<style lang='scss'>
#app {
  .mu-appbar {
    position: fixed;
    top: 0;
  }

  .select-control-row {
    margin: 4px 0 0;
  }

  .main-slot {
    margin-top: 56px;
  }

  .image-box {
    position: fixed;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    z-index: 100;
    pointer-events: none;
  }

  #myCanvas, #imgs {
    position: absolute;
    opacity: 0;
    z-index: -1;
  }
}


</style>
