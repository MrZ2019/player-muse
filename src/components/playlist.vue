<template>
  <mu-dialog :open="dialog" title="播放列表" @close="close">
      <mu-list @change="handleChange">
        <mu-list-item :title="item.name" v-for="(item,index) in curPlayList" :value="index"/>
      </mu-list>
  </mu-dialog>
</template>

<script>

  import {mapState} from 'vuex'
  export default {
    data() {
      return {
        dialog: false,
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
        this.$store.commit('addItemToList', {index, item: this.selectedItem, curGroupIndex: this.curGroupIndex})
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
</style>
