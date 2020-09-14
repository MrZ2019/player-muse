<template>
  <div id="app">
    <div class="image-box" :style="{'backgroundImage': 'url(' + imageData + ')'}">

    </div>
    <mu-appbar :title="listName" :style="styleObj">
      <mu-icon-button icon="menu" slot="left" @click.native="open = true" />
      <mu-icon-button icon="title" slot="right" @click.native="goLyric" v-show="!isAlbumView" />
      <mu-icon-button icon="refresh" slot="right"  @click='refresh' v-show="!isStar && !isAlbumView"/>
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
        <mu-menu-item title="排序模式"   @click.native="goSort" v-show="!isSortMode && curListIndex !== -1" />
        <mu-menu-item title="退出排序模式"   @click.native="leaveSort" v-show="isSortMode && curListIndex !== -1" />
        <mu-menu-item title="设置"  @click.native="openSettings"/>
        <mu-menu-item title="刷新"  @click.native="reload"/>
        <mu-menu-item title="备份与恢复"  @click.native="showBackup"/>
        <mu-menu-item title="专辑视图"  @click.native="openAlbum"/>
        <mu-menu-item title="退出" @click.native="quit" />
      </mu-icon-menu>
    </mu-appbar>

    <div class="main-slot">

      <keep-alive>
      <router-view></router-view>
      </keep-alive>

    </div>

    <mu-drawer :open="open" :docked="docked" @close="toggle()">
      <mu-list @itemClick="docked ? '' : toggle()">
         <mu-list-item >当前分组: <b>{{groupList[curGroupIndex].name}}</b></mu-list-item >
        <mu-list-item  @click.native="changeListToAll()" >全部歌曲</mu-list-item >
        <!-- <mu-list-item  @click.native="changeListToAllRandom()" >全部歌曲(随机)</mu-list-item > -->
        <mu-list-item :title="item.name" v-for="(item, index) in curPlayList" @click="changeList(index, item)" v-if="item"/>
        <mu-list-item v-if="docked" @click.native="open = false" title="Close"/>
      </mu-list>
    </mu-drawer>

    <mu-dialog :open="dialog" title="主题色" @close="closePicker">

        <picker  v-model="colors"></picker>
        <mu-flat-button slot="actions" @click="closePicker" primary label="取消"/>
        <mu-flat-button slot="actions" primary @click="confirmPicker" label="确定"/>
      </mu-dialog>


      <DlgAddPlayList ref="dlgAddPlayList"></DlgAddPlayList>
      <DlgAddListGroup ref="dlgAddListGroup"></DlgAddListGroup>
      <DlgSettings ref="dlgSettings"></DlgSettings>
      <DlgGroupList ref="dlgGroupList"></DlgGroupList>
      <DlgBackup ref="dlgBackup"></DlgBackup>
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
    }
  },
  computed: {
      ...mapState(['playlist', 'curListIndex', 'isSortMode', 'settings', 'groupList', 'curGroupIndex', 'imageData']
      ),
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

      theme() {
        return (
        `.mu-slider-fill
        {
          background: ${this.colors.hex} !important;
        }

        .mu-slider-thumb {
          color: ${this.colors.hex} !important;
          background: ${this.colors.hex} !important;
        }

        .mu-flat-button-primary {
           color: ${this.colors.hex} !important;
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

   theme(newVal) {

     document.getElementById('theme').innerHTML = newVal
   },

   colors(newVal) {
     this.styleObj.background = newVal.hex;
   },

  },
  components:{
    'picker': Compact,DlgAddPlayList, DlgSettings, DlgAddListGroup, DlgGroupList,DlgBackup,
  },
  mounted() {
    window.$V = this;
    let bg = localStorage.getItem('background');

    window.settingsBg = bg;

    this.colors = {
      hex: bg,
    }
    this.styleObj.background = bg;

    this.$store.commit('getPlayList')
    this.$store.commit('getSettings')

    this.$store.commit('getAllAlbums')
    this.$store.commit('getAllSongs')
    this.$store.commit('getAllSingers')

    this.$store.commit('getGroup')

     this.$store.commit('getImage')



  },
  methods: {
    ...mapMutations(['removePlayList', 'renamePlayList']),
    goSort() {
      this.$store.state.isSortMode = true;
    },
    leaveSort() {
      this.$store.state.isSortMode = false;
    },

    changeListToAll() {
      this.$store.commit('changeList', -1)
    },
    changeListToAllRandom() {
      this.$store.commit('changeListRandom', -1)
    },
    changeList(index, item) {
      this.$store.commit('changeList', index, item)
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

    renamePlayList() {
      this.$refs.dlgAddPlayList.showDialog(true)
    },
    openPicker() {
      this.dialog = true;
    },
    openGallery() {
      callplus('gallery', [], (res)=> {
        this.$store.commit('setImage', res.data)
      })
    },
    closePicker() {
      this.dialog = false;
    },
    confirmPicker() {
      this.dialog = false;
      this.styleObj.background = this.colors.hex;



      localStorage.setItem('background', this.colors.hex)

      this.settings.theme =  this.colors.hex;
      
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
      this.$router.push(this.$route.path == "/star" ?  '/' : '/star')
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
    opacity: .5;
    pointer-events: none;

  }
}


</style>
