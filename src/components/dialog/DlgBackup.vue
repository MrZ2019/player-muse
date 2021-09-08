<template>
  <mu-dialog :open="dialog" title="备份" @close="close">
    <mu-flex class="select-control-row">
      <mu-raised-button label="备份" class="demo-raised-button" primary @click="backup"/>

    </mu-flex>
<!--
    <mu-flex>
      <mu-raised-button label="备份数据库" class="demo-raised-button" primary @click="backupDB"/>
      <mu-raised-button label="恢复数据库" class="demo-raised-button" primary @click="restoreDB"/>
    </mu-flex> -->

    <mu-list>
      <mu-list-item v-for="i in fileList">
        <span class="text" @click="restore(i)">{{i}}</span>
        <mu-icon value="remove_circle" color="gray" @click.stop="remove(i)"/>
        <!-- <mu-icon value="restore" @click.native="restore(i)" /> -->
      </mu-list-item>
    </mu-list>


<!--    <mu-flat-button slot="actions" @click="close" primary label="取消"/>
    <mu-flat-button slot="actions" primary @click="finish" label="确定"/> -->
  </mu-dialog>
</template>

<script>
  import {mapMutations, mapState} from 'vuex';

  export default {
    data() {
      return {
        dialog: false,
        listName: '',
        fileList: [],
      }
    },
    watch: {

    },
    mounted() {


      setTimeout(()=> {
        this.getRestoreList()
      },1000)
    },
    computed:{
      ...mapState(['settings', 'groupList', 'playlist', 'allSongs', 'allSingers', 'dateMap', 'rankList', 'themeColor'])
    },
    methods: {
      ...mapMutations(['renamePlayList']),
      showDialog(isRename) {
        this.dialog = true;
        this.isRename = isRename;

        if (this.isRename) {
          this.listName = this.$store.state.playlist[this.$store.state.curListIndex].name;
        }
      },

      close() {
        this.dialog = false;
      },
      goScan() {
        this.$router.push('/scan')
        this.dialog = false;
      },

      finish() {
        this.$store.commit('saveSettings', this.settings);
        this.dialog = false;

      },

      backup() {

        // let imageColor = localStorage.getItem("imageColor");
        // let imageData = localStorage.getItem("imageData");
        let data = {
          settings: this.settings,
          playlist: this.playlist,
          groupList: this.groupList,
          dateMap: this.dateMap,
          rankList: this.rankList,
          // imageData: imageData,
        }

        let name = prompt('名称', '');

        if (name)
        callplus('backup', [data, name], (res) => {
          this.getRestoreList();
        })
      },
      backupDB() {
        this.$store.dispatch('getAllAlbums').then((data) => {
          let data2 = {
            singers: this.allSingers,
            songs: this.allSongs,
            albums: data,
            // groupList: this.groupList
          }


          callplus('backup', [data2, 'db'], (res) => {
            this.getRestoreList();
          }, true)
        })

      },

      restoreDB() {
        let self = this;
        callplus('restore', ['db.txt'], function(result) {

          // alert(123)
        })

      },

      getRestoreList() {
        let self = this
        callplus('getRestoreList', null, function(result) {


          self.fileList = result.data;

        })
      },

      restore(i) {
        let self = this;
        callplus('restore', [i], function(result) {

          let data = JSON.parse(result.data);

          self.$store.state.playlist = data.playlist;
          self.$store.state.groupList = data.groupList;
          data.settings.isFollowImage = false;
          self.$store.commit('setImage', '')
          self.$store.state.settings = data.settings;
          self.$store.state.dateMap = data.dateMap;
          self.$store.state.rankList = data.rankList;


          localStorage.setItem('dateMap', JSON.stringify(data.dateMap));
          localStorage.setItem('rankList', JSON.stringify(data.rankList));
          // localStorage.setItem('imageData', JSON.stringify(data.imageData));

          self.$store.commit('saveSettings');
          self.$store.commit('savePlayList');
          self.$store.commit('saveGroupList');

          self.dialog = false

        })
      },

      remove(i) {
        let self = this;
        callplus('removeRestore', [i], function() {

          self.getRestoreList()
        })
      },

    }
  }
</script>

<style>
  .select-control-row {
    display: block;
  }

  .mu-item {
    text-align: left;
  }

  .text, .mu-icon {
    display: inline-block;
    vertical-align: middle;
    /* font-size: 24px; */
  }
</style>
