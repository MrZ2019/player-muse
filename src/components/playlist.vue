<template>
  <mu-dialog :open="dialog" title="播放列表" @close="close">

      <el-tabs v-model="activeGroup" @change="handleTabChange">
          <el-tab-pane :label="g.name" :name="gIndex" v-for="(g, gIndex) in groupList">

            <mu-list @change="handleChange">
              <mu-list-item :title="item.name" v-for="(item,index) in playlist" :value="index" v-if="gIndex === 0"/>

              <mu-list-item :title="item.name" v-for="(item,index) in g.playlist" :value="index" v-if="gIndex !== 0"/>
            </mu-list>


          </el-tab-pane>
        </el-tabs>

        <div>
      </div>
  </mu-dialog>
</template>

<script>

  import {mapState} from 'vuex'
  export default {
    data() {
      return {
        dialog: false,
        activeGroup: '',
        selectedItem: '',
      }
    },
    computed:{
      ...mapState(['playlist', 'groupList', 'curGroupIndex']
      ),
      curPlayList() {
        if(this.curGroupIndex === 0) {
          return this.playlist
        } else {
          return this.groupList[this.curGroupIndex].playlist;
        }
      },
    },
    methods: {
      handleChange(index) {
        this.$store.commit('addItemToList', {index, item: this.selectedItem, curGroupIndex: this.activeGroup})
        this.dialog = false;
      },

      showDialog(item) {
        this.dialog = true;
        this.selectedItem = item;
      },

      close() {
        this.dialog = false;
      },
    }
  }
</script>

<style>

  .el-tab-pane {
    overflow: auto;
    max-height: 320px;
    min-height: 128px;
  }
</style>
