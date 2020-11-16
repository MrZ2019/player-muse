<template>

  <mu-dialog :open="dialog" title="播放列表" @close="close" dialogClass="dlg-playlist">
    <div slot="title" class="title-box">播放列表
      <mu-icon value="sort" :color="activeColor" @click.native="toggleSort"/>
      <mu-icon-button icon="add" @click='addList' />
    </div>
    <div>
    <el-tabs v-model="activeGroup">
      <el-tab-pane :label="g.name" :name="gIndex + ''" v-for="(g, gIndex) in groupList">

        <mu-list>

          <draggable :list="playlist" class="list-group" ghost-class="ghost"  v-if="gIndex === 0" s
            @start="dragging = true" @end="onDragEnd" :disabled="!isSort">
            <mu-list-item  v-for="(item,index) in playlist" :value="index" @click.native="handleChange(index)" v-if="item">
              <span class="title">{{item.name}}</span>
              <mu-icon value="remove_circle" color="gray" @click.stop="remove(index)" />
            </mu-list-item>

          </draggable>

          <draggable :list="g.playlist" class="list-group" ghost-class="ghost"  v-if="gIndex !== 0"
            @start="dragging = true" @end="onDragEnd"  :disabled="!isSort">
            <mu-list-item v-for="(item,index) in g.playlist" :value="index" v-if="item" @click="handleChange(index)">
              <span class="title">{{item.name}}</span>
              <mu-icon value="remove_circle" color="gray" @click.stop="remove(index)" />
            </mu-list-item>
          </draggable>

        </mu-list>


      </el-tab-pane>
    </el-tabs>

    <div>
    </div>
    </div>
  </mu-dialog>
</template>

<script>
  import {
    mapState
  } from 'vuex'

  import draggable from "vuedraggable";
  export default {
    data() {
      return {
        dialog: false,
        activeGroup: '',
        selectedItem: '',
        dragging: false,

        isSort: false,
      }
    },
    components: {
      draggable
    },
    computed: {
      ...mapState(['playlist', 'groupList', 'curGroupIndex', 'settings']),
      curPlayList() {
        if (this.curGroupIndex === 0) {
          return this.playlist
        } else {
          return this.groupList[this.curGroupIndex].playlist;
        }
      },

      activeColor() {
        return this.isSort ? ($V.themeColor ||  'purple') : ''
      }
    },
    methods: {
      handleChange(listIndex) {
        // alert()


        if (this.isMulti) {

          for (let index = 0; index < this.nameList.length; index++) {
            const element = this.nameList[index];


            this.$store.commit('addItemToList', {
              index:listIndex,
              item: element.name,
              curGroupIndex: this.activeGroup
            })
          }
        } else {



          this.$store.commit('addItemToList', {
            index: listIndex,
            item: this.selectedItem,
            curGroupIndex: this.activeGroup
          })
        }
        this.dialog = false;
      },
      onDragEnd() {
        this.dragging = false;
        this.$store.commit('savePlayList')
        this.$store.commit('saveGroupList')
      },
      addList() {
        let name = prompt("新建列表", "")

        if (name)
        this.$store.commit('addPlayList', [name, this.activeGroup]);
      },

      showDialog(item, isMulti) {

        // alert(1234)
        this.dialog = true;
        // alert(1)
        this.isMulti = isMulti;


        if (isMulti) {
          this.nameList = item;
        } else {
          this.selectedItem = item;
        }
      },

      close() {
        this.dialog = false;
      },

      remove(index) {
        this.$store.commit('removePlayList', [index, this.activeGroup])
      },

      toggleSort() {
        this.isSort = !this.isSort;
      },
    }
  }
</script>

<style >
  .el-tab-pane {
    overflow: auto;
    max-height: 320px;
    min-height: 128px;
  }

  .title-box {
    display: flex;
    align-items: center;
  }

  .title,
  .mu-icon {
    display: inline-block;
    vertical-align: middle;
  }

 /* .dlg-playlist .el-tabs__item {
    padding: 0 5px;
  }

  .dlg-playlist .mu-dialog-body {
    padding: 10px;
  }

  .dlg-playlist.mu-dialog {
    width: 90%;
  }
  .dlg-playlist .mu-list {
    pading: 2px 0;
  }
 .dlg-playlist .mu-item {
    padding: 4px 0;
    min-height: 40px;
  }

  .dlg-playlist .el-tabs__header {
    margin-bottom: 5px;
  } */
</style>
