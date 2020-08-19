<template>
  <div id="app">
    <mu-appbar :title="listName" :style="styleObj">
      <mu-icon-button icon="menu" slot="left" @click.native="open = true" />
      <mu-icon-button icon="title" slot="right" @click.native="goLyric" />
      <mu-icon-button icon="refresh" slot="right"  @click='refresh' v-show="!isStar"/>
      <mu-icon-button :icon="icon" slot="right"  @click='goStar'/>
      <mu-icon-menu icon="more_vert" slot="right">
        <mu-menu-item title="主题色" @click.native="openPicker"/>
        <mu-menu-item title="新建列表"  @click.native="createList"/>
        <mu-menu-item title="删除当前列表"  @click.native="removePlayList" v-show="curListIndex !== -1"/>
        <mu-menu-item title="重命名当前列表"  @click.native="renamePlayList" v-show="curListIndex !== -1"/>
        <mu-menu-item title="排序模式"   @click.native="goSort" v-show="!isSortMode && curListIndex !== -1" />
        <mu-menu-item title="退出排序模式"   @click.native="leaveSort" v-show="isSortMode && curListIndex !== -1" />
        <mu-menu-item title="菜单 4" />
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
        <mu-list-item  @click.native="changeListToAll()" >全部歌曲</mu-list-item >
        <mu-list-item  @click.native="changeListToAllRandom()" >全部歌曲(随机)</mu-list-item >
        <mu-list-item :title="item.name" v-for="(item, index) in playlist" @click="changeList(index, item)" />
        <mu-list-item v-if="docked" @click.native="open = false" title="Close"/>
      </mu-list>
    </mu-drawer>

    <mu-dialog :open="dialog" title="主题色" @close="closePicker">

        <picker  v-model="colors"></picker>
        <mu-flat-button slot="actions" @click="closePicker" primary label="取消"/>
        <mu-flat-button slot="actions" primary @click="confirmPicker" label="确定"/>
      </mu-dialog>


      <DlgAddPlayList ref="dlgAddPlayList"></DlgAddPlayList>
  </div>
</template>
<script>

import {mapState, mapMutations} from 'vuex'
import Compact from 'vue-color/src/components/Compact';

import DlgAddPlayList from './components/dialog/DlgAddPlayList'

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
      }
    }
  },
  computed: {
      ...mapState(['playlist', 'curListIndex', 'isSortMode']
      ),
      listName() {
        if (this.$store.state.curListIndex === -1) {
          return '全部歌曲'
        } else {
          return this.$store.state.playlist[this.$store.state.curListIndex].name;
        }
      }
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
    }
  },
  components:{
    'picker': Compact,DlgAddPlayList
  },
  mounted() {
    let bg = localStorage.getItem('background');

    this.styleObj.background = bg;

    this.$store.commit('getPlayList')
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
    createList() {
      this.$refs.dlgAddPlayList.showDialog()
    },
    renamePlayList() {
      this.$refs.dlgAddPlayList.showDialog(true)
    },
    openPicker() {
      this.dialog = true;
    },
    closePicker() {
      this.dialog = false;
    },
    confirmPicker() {
      this.dialog = false;
      this.styleObj.background = this.colors.hex;

      localStorage.setItem('background', this.colors.hex)

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

}


</style>
